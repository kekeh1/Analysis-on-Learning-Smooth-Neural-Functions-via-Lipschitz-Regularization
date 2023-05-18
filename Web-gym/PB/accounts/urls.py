from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import RegistrationView, LogoutView, ChangePasswordView, UpdateProfileView, AddSubscriptionView, \
    UpdateCardInfoView, UpdateSubscriptionView, CancelSubscriptionView, ListPaymentHistoryView, ProfileView, \
    ListSubscriptionsView
from rest_framework_simplejwt import views

from .TimeView import TimeUpcomingView, TimeHistoryView

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', views.TokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change_password/', ChangePasswordView.as_view()),
    path('update_profile/', UpdateProfileView.as_view()),
    path('add_subscription/', AddSubscriptionView.as_view()),
    path('update_card_info/', UpdateCardInfoView.as_view()),
    path('update_subscription/', UpdateSubscriptionView.as_view()),
    path('cancel_subscription/', CancelSubscriptionView.as_view()),
    path('payment_history/', ListPaymentHistoryView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('subscriptions/', ListSubscriptionsView.as_view()),

    path('time/upcoming/', TimeUpcomingView.as_view()),    
    path('time/history/', TimeHistoryView.as_view()),   
]