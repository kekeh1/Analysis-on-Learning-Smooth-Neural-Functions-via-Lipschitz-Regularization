from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db.models import CASCADE
from studios.models import Time


class Subscription(models.Model):
    choices = (
        ("Weekly", "Weekly"),
        ("Bi-weekly", "Bi-weekly"),
        ("Monthly", "Monthly"),
        ("Yearly", "Yearly")
    )
    name = models.CharField(max_length=50, unique=True)
    amount = models.FloatField(default=0)
    duration = models.CharField(max_length=10, choices=choices)

    def __str__(self):
        return self.name


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, is_superuser=True, **extra_fields)

        user.set_password(password)
        user.is_staff = True

        user.save()

        return user


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=12)
    avatar = models.ImageField(upload_to='images/', default='images/default.jpg')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_subscribed = models.BooleanField(default=False)
    subscription = models.ForeignKey(to=Subscription, on_delete=CASCADE, blank=True, null=True)
    card_info = models.CharField(max_length=16, blank=True, null=True)
    class_time = models.ManyToManyField(to=Time, blank=True, verbose_name="Class")
    next_payment_date = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone']

    def get_full_name(self):
        return self.first_name

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email

    @property
    def token(self):
        return self._generate_jwt_token()


class PaymentTransaction(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=CASCADE)
    amount = models.CharField(max_length=10)
    date = models.DateTimeField(auto_now_add=True)
    card_info = models.CharField(max_length=16)