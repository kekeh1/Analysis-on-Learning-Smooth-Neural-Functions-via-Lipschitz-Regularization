from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser, Subscription, PaymentTransaction


class SubscriptionAdmin(admin.ModelAdmin):
    model = Subscription
    list_display = ("name", "amount", "duration")
    fields = ["name", "amount", "duration"]



class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'subscription')
    readonly_fields = ('id',)
    filter_horizontal = ('class_time',)

class PaymentTransactionAdmin(admin.ModelAdmin):
    model = PaymentTransaction
    list_display = ('id', 'user', 'amount', 'date', 'card_info')
    readonly_fields = ('id',)




admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(PaymentTransaction, PaymentTransactionAdmin)