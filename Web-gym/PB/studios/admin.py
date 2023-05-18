from django.contrib import admin

# Register your models here.
from django.contrib import admin
from studios.models import Studio, Class, Amenity, Image, Time

from django.contrib import messages







class ImageInline(admin.TabularInline):
    model = Image
    fields = ["image"]

class AmenityInline(admin.TabularInline):
    model = Amenity
    fields = ["type", "quantity"]

class TimeInline(admin.TabularInline):

    model = Time
    fields = ["date_from", "date_end"]
    ordering = ['date_from']


class StudioAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'postal_code')
    readonly_fields = ['latitude', 'longitude']
    inlines = [ImageInline, AmenityInline]
    fieldsets = (
        ['Main', {
            'fields': ('name', 'address', 'phone_number', 'postal_code', 'latitude', 'longitude'),
        }],
    )

class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'end_date', 'capacity')

    def add_view(self, request, extra_content=None):
        self.inlines = ()
        self.exclude = ('description', 'coach', 'keywords', 'range')
        self.readonly_fields = ['range']
        return super(ClassAdmin, self).add_view(request)

    def change_view(self, request, object_id, extra_content=None):
        #how to in change_view add fieldset
        self.inlines = (TimeInline, )
        self.exclude = ('range', 'recurring', 'capacity')
        self.readonly_fields = ['range']
        return super(ClassAdmin, self).change_view(request, object_id)

class AmentiyAdmin(admin.ModelAdmin):
    list_display = ('type', 'quantity', 'studio')
    fields = ['type', 'quantity', 'studio']


class TimeAdmin(admin.ModelAdmin):
    list_display = ('date_from', 'date_end',  'capacity', 'studio_class')
    fields = ['date_from', 'date_end', 'capacity', 'studio_class']
    ordering = ['date_from']

    @admin.action(description="Delete selected class times and all class's times after it")
    def deleted_all_after(self, request, queryset):
        if queryset.exists():

            if queryset.count() != 1:

                self.message_user(request, "Can not choose more than one Time", level=messages.ERROR)
            else:

                list = []
                list.append(queryset.first().pk)
                current_studio = queryset.first().studio_class
                end_time = queryset.first().date_end
                Times = Time.objects.filter(studio_class = current_studio)
                for time in Times:

                    if time.date_end > end_time:
                        list.append(time.pk)

                queryset_new = Time.objects.filter(pk__in=list)
                queryset_new.delete()
                self.message_user(request, "Success delete", level=messages.SUCCESS)
    actions = [deleted_all_after]


admin.site.register(Studio, StudioAdmin)
admin.site.register(Amenity, AmentiyAdmin)
admin.site.register(Image)

admin.site.register(Class, ClassAdmin)
admin.site.register(Time, TimeAdmin)

