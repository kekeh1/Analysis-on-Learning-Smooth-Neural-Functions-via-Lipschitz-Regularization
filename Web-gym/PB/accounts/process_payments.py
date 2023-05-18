import django
import os

from dateutil.relativedelta import relativedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PB.settings')
django.setup()

from accounts.models import CustomUser, PaymentTransaction
from datetime import datetime

today = datetime.today()

year = today.year
month = today.month
day = today.day
payments_due_users = CustomUser.objects.filter(next_payment_date__year=year,
                                               next_payment_date__month=month,
                                               next_payment_date__day=day)

for user in payments_due_users:
    if user.is_subscribed:

        current_payment = PaymentTransaction(user=user,
                                            amount=user.subscription.amount,
                                            card_info=user.card_info)
        current_payment.save()

        if str(user.subscription.duration) == "Monthly":
            user.next_payment_date = today + relativedelta(months=+1)
        elif str(user.subscription.duration) == "Weekly":
            user.next_payment_date = today + relativedelta(weeks=+1)
        elif str(user.subscription.duration) == "Bi-weekly":
            user.next_payment_date = today + relativedelta(weeks=+2)
        elif str(user.subscription.duration) == "Yearly":
            user.next_payment_date = today + relativedelta(years=+1)

    else:
        user.next_payment_date = None

    user.save()
