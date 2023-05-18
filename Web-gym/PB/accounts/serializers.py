from datetime import datetime, timezone, timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.generics import get_object_or_404
from .models import CustomUser, Subscription, PaymentTransaction
from dateutil.relativedelta import relativedelta
import re

from studios.models import Time


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_phone(self, data):
        pattern = re.compile("^\d{3}-\d{3}-\d{4}$")
        if not pattern.match(data):
            raise serializers.ValidationError("Phone number does not match format. (E.g. ???-???-????)")
        return data

    def validate_email(self, value):
        if get_user_model().objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def save(self):
        user = CustomUser(email=self.validated_data['email'],
                          first_name=self.validated_data['first_name'],
                          last_name=self.validated_data['last_name'],
                          phone=self.validated_data['phone'])
        # if self.validated_data.get('avatar'):
        #     user.avatar = self.validated_data.get('avatar')
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2:
            raise serializers.ValidationError("Password fields didn't match.")
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Password fields didn't match.")

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone', 'avatar']

    def validate_email(self, value):
        user = self.context['request'].user
        if get_user_model().objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_phone(self, data):
        pattern = re.compile("^\d{3}-\d{3}-\d{4}$")
        if not pattern.match(data):
            raise serializers.ValidationError("Phone number does not match format. (E.g. ???-???-????)")
        return data

    def partial_update(self):

        self.partial_update()


class AddSubscriptionSerializer(serializers.ModelSerializer):
    subscription = serializers.CharField()
    card_info = serializers.CharField(max_length=16)

    class Meta:
        model = CustomUser
        fields = ['subscription', 'card_info']

    def validate_subscription(self, value):
        if value not in list(Subscription.objects.values_list('name', flat=True)):
            raise serializers.ValidationError(f"Invalid subscription name. Must be one of these [{list(Subscription.objects.values_list('name', flat=True))}]")
        return value

    def validate_card_info(self, value):
        if not (len(value) == 16 and value.isdigit()):
            raise serializers.ValidationError("Invalid credit/debit card information.")
        return value

    def validate(self, attrs):
        if self.context['request'].user.is_subscribed:
            raise serializers.ValidationError("User is already subscribed to a gym membership. Please use update instead.")
        return attrs

    def update(self, instance, validated_data):

        user = self.context['request'].user
        instance.subscription = Subscription.objects.get(name=validated_data["subscription"])
        instance.is_subscribed = True

        instance.card_info = validated_data["card_info"]
        # if user has an active subscription
        if instance.next_payment_date != None:
            payment_day = instance.next_payment_date
        else:
            payment_day = datetime.today()

            if instance.subscription.duration == "Monthly":
                instance.next_payment_date = payment_day + relativedelta(months=+1)
            elif instance.subscription.duration == "Weekly":
                instance.next_payment_date = payment_day + relativedelta(weeks=+1)
            elif instance.subscription.duration == "Bi-weekly":
                instance.next_payment_date = payment_day + relativedelta(weeks=+2)
            elif instance.subscription.duration == "Yearly":
                instance.next_payment_date = payment_day + relativedelta(years=+1)

            current_payment = PaymentTransaction(user=user,
                                                 amount=instance.subscription.amount,
                                                 card_info=validated_data["card_info"])
            current_payment.save()

        instance.save()

        return instance


class UpdateCardInfoSerializer(serializers.ModelSerializer):
    card_info = serializers.CharField(max_length=16)

    class Meta:
        model = CustomUser
        fields = ['card_info']

    def validate_card_info(self, value):
        if not (len(value) == 16 and value.isdigit()):
            raise serializers.ValidationError("Invalid credit/debit card information.")
        return value

    def update(self, instance, validated_data):
        instance.card_info = validated_data["card_info"]
        instance.save()

        return instance


class UpdateSubscriptionSerializer(serializers.ModelSerializer):
    subscription = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ['subscription']

    def validate_subscription(self, value):
        if value not in list(Subscription.objects.values_list('name', flat=True)):
            raise serializers.ValidationError(f"Invalid subscription name. Must be one of these [{list(Subscription.objects.values_list('name', flat=True))}]")
        return value

    def validate(self, attrs):
        if not self.context['request'].user.is_subscribed:
            raise serializers.ValidationError("User is currently not subscribed to a gym membership.")
        return attrs

    def update(self, instance, validated_data):

        user = self.context['request'].user
        instance.subscription = Subscription.objects.get(name=validated_data["subscription"])

        # don't think this is necessary as updating a subscription should only trigger a payment on the next_payment_date
        # aka with process_payments.py

        # if instance.subscription.duration == "Monthly":
        #     instance.next_payment_date = current_next_payment + relativedelta(months=+1)
        # elif instance.subscription.duration == "Weekly":
        #     instance.next_payment_date = current_next_payment + relativedelta(weeks=+1)
        # elif instance.subscription.duration == "Bi-weekly":
        #     instance.next_payment_date = current_next_payment + relativedelta(weeks=+2)
        # elif instance.subscription.duration == "Yearly":
        #     instance.next_payment_date = current_next_payment + relativedelta(years=+1)
        #
        # current_payment = PaymentTransaction(user=user,
        #                                      amount=instance.subscription.amount,
        #                                      card_info=instance.card_info)
        # current_payment.save()

        instance.save()

        return instance


class CancelSubscriptionSerializer(serializers.ModelSerializer):
    confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['confirm']

    def validate_confirm(self, value):
        if not value.lower() == "confirm":
            raise serializers.ValidationError("Please type 'confirm' to cancel your subscription.")
        return value

    def validate(self, attrs):
        if not self.context['request'].user.is_subscribed:
            raise serializers.ValidationError("User is currently not subscribed to a gym membership.")
        return attrs

    def update(self, instance, validated_data):
        instance.subscription = None
        instance.is_subscribed = False

        ###### Canceling all classes ############################################

        now = datetime.now(timezone.utc)
        end_period = instance.next_payment_date
        times = instance.class_time.values()
        for t in times:
            time = get_object_or_404(Time, id=t['id'])
            if time.date_from >= end_period:
                instance.class_time.remove(time)
                time.capacity += 1
                time.save()

        ###### Canceling all classes ############################################

        instance.save()
        return instance


class PaymentTransactionSerializer(serializers.ModelSerializer):
    recurrence = serializers.CharField(allow_blank=True, allow_null=True)
    class Meta:
        model = PaymentTransaction
        fields = ['id', 'amount', 'date', 'card_info', 'recurrence']

class SubscriptionSerializer(serializers.ModelSerializer):
   class Meta:
    model = Subscription
    fields = ['id', 'name', 'amount', 'duration']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'phone', 'avatar', 'card_info', 'subscription', 'next_payment_date']