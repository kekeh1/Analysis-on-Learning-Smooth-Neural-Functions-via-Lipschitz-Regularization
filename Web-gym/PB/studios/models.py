import datetime
import re

from django.db import models
from django.db.models import RESTRICT, CASCADE
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import CheckConstraint, Q

from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import geocoder

# Create your models here.


def validate_date(time):
    if time < timezone.now().date():
        raise ValidationError(('Date is not an valid Date'), params={'time': time})

def valid_recurring(days):
    #if days > 1000:
        #raise ValidationError(('Recurring days is not an valid recurring.(must smaller than 1000 days)'), params={'days': days})
    return

def validate_time(time):
    if time < timezone.now():
        raise ValidationError(('Date time is not an valid Date time'), params={'time': time})

class Studio(models.Model):
    #basic information
    name = models.CharField(max_length = 200)
    address = models.TextField(verbose_name='Address', max_length = 200)
    postal_code = models.CharField(verbose_name='Postal Code', max_length = 200)
    phone_number = models.CharField(verbose_name='Phone Number', max_length = 200)
    #geo part
    latitude = models.FloatField(blank=True, null=True, validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)],editable=False)
    longitude = models.FloatField(blank=True, null=True, validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)],editable=False)

    class Meta:
        constraints = (
            CheckConstraint(check=Q(latitude__gte=-90.0) & Q(latitude__lte=90.0), name='lat_range'),
            CheckConstraint(check=Q(longitude__gte=-180.0) & Q(longitude__lte=180.0), name='lng_range'),
            )

    def clean(self):
        errors = []
        geolocator = Nominatim(user_agent="studios")
        try: 
            location = geolocator.geocode(self.address, exactly_one=True)
        except:
            raise ValidationError(["Address is not specific enough"])
        pattern = re.compile("^\d{3}-\d{3}-\d{4}$")
        if not location: errors += ["Address is not valid"]
        if not pattern.match(self.phone_number): errors += ["Phone number does not match format (E.g. ???-???-????)"]
        
        if errors: raise ValidationError(errors)

    def save(self, *args, **kwargs):
        geolocator = Nominatim(user_agent="studios")
        location = geolocator.geocode(self.address)
        self.latitude = location.latitude
        self.longitude = location.longitude
        super(Studio, self).save(*args, **kwargs)


    def __str__(self):
        return self.name



class Image(models.Model):
    image = models.ImageField(upload_to='images/', default='default.jpg')
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='Image')

class Amenity(models.Model):

    type = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=0)
    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='Amenity')

    def __str__(self):
        return self.type


class Class(models.Model):

    studio = models.ForeignKey(to=Studio, on_delete=CASCADE, related_name='Class')
    name = models.CharField(max_length = 200)
    description = models.TextField(verbose_name='description', max_length = 200, blank=True)
    coach = models.CharField(max_length = 200, blank=True)
    keywords = models.CharField(max_length = 200, blank=True)
    capacity = models.PositiveIntegerField(default=0, blank=True, verbose_name='default capacity')
    start_date = models.DateField(default=timezone.now, validators=[validate_date])
    end_date = models.DateField(validators=[validate_date], default=timezone.now)
    recurring = models.PositiveIntegerField(default = 7, verbose_name="Recurring days")
    range = models.PositiveIntegerField(default=0,verbose_name="Total days")

    time_from = models.TimeField(
        verbose_name='From',
        default=timezone.now
    )
    time_end = models.TimeField(
        verbose_name='End',
        default = timezone.now
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__start_date = self.start_date
        self.__end_date = self.end_date
        self.__time_end = self.time_end
        self.__time_from = self.time_from

    def clean(self):
        errors = {}
        if self.start_date and self.end_date:
            if self.start_date > self.end_date:
                errors['end_date'] = ('end date can not before the start date')
        if self.time_end and self.time_from:
            if self.time_end < self.time_from:
                errors['time_end'] = ('time end can not before the time start')
        if errors:
            raise ValidationError(errors)


    def save(self, *args, **kwargs):
        #setting range
        temp = str(self.end_date - self.start_date).split()[0]
        if temp == "0:00:00":
            temp = "0"
        self.range = int(temp) + 1


        if self.pk:  # save
            current_studio_class = Class.objects.get(pk=self.pk)
            times = (Time.objects.filter(studio_class=current_studio_class)).order_by('date_from')
            changed_e = (self.__time_end != self.time_end)
            changed_f = (self.__time_from != self.time_from)


            if times.exists():
                late_time = times.first().date_end

                for time in times:
                    #changing time peroid
                    if changed_f or changed_e:
                        time.date_from = datetime.datetime.combine(time.date_from.date(), self.time_from)
                        time.date_end = datetime.datetime.combine(time.date_end.date(), self.time_end)
                        time.save()


                    if late_time.date() < time.date_end.date():
                        late_time = time.date_end
                    #delete current Time before the new start date
                    if self.start_date != self.__start_date:
                        if time.date_from.date() < self.start_date:
                            time.delete()
                    #delete current Time after new end date
                    if self.end_date != self.__end_date:
                        if time.date_from.date() > self.end_date:
                            time.delete()


                first_date = times.first().date_from
                if self.start_date < first_date.date():
                    #create new Time before the old start date
                    while self.start_date < first_date.date() and first_date >= timezone.now():
                        first_date = first_date - datetime.timedelta(days=self.recurring)
                        start = datetime.datetime.combine(first_date, self.time_from)
                        end = datetime.datetime.combine(first_date, self.time_end)
                        Time.objects.create(studio_class=current_studio_class, date_from=start, date_end=end,
                                            capacity=current_studio_class.capacity)



                if self.end_date != self.__end_date:
                    while late_time.date() < self.end_date:
                        # create new Time after the old end date
                        late_time = late_time + datetime.timedelta(days=self.recurring)
                        start = datetime.datetime.combine(late_time, self.time_from)
                        end = datetime.datetime.combine(late_time, self.time_end)
                        Time.objects.create(studio_class=current_studio_class, date_from=start, date_end=end,
                                            capacity=current_studio_class.capacity)


        super(Class, self).save(*args, **kwargs)

        #create Times when empty times in Class (for example when creating)
        current_studio = Class.objects.get(pk=self.pk)
        times = Time.objects.filter(studio_class=current_studio)
        if not times.exists():
            date = self.start_date
            while date <= self.end_date:
                start = datetime.datetime.combine(date, self.time_from)
                end = datetime.datetime.combine(date, self.time_end)
                Time.objects.create(studio_class=current_studio, date_from=start, date_end=end, capacity=current_studio.capacity)
                date = date + datetime.timedelta(days=self.recurring)

        self.__start_date = self.start_date
        self.__end_date = self.end_date
        self.__time_end = self.time_end
        self.__time_from = self.time_from

    def __str__(self):
        return self.name


class Time(models.Model):

    studio_class = models.ForeignKey(to=Class, on_delete=CASCADE, related_name='Times')

    date_from = models.DateTimeField(
        verbose_name='From',
    )
    date_end = models.DateTimeField(
        verbose_name='End',
    )

    def clean(self):
        errors = {}
        if self.date_end and self.date_from:
            if self.date_end < self.date_from:
                errors['date_end'] = ('time end can not before the time start')
        if errors:
            raise ValidationError(errors)

    capacity = models.PositiveIntegerField(default=0, blank=True)


    def __str__(self):
        return "Studio class name: " + self.studio_class.name + " Start time: " + (self.date_from).strftime("%y-%m-%d, %H:%M:%S")