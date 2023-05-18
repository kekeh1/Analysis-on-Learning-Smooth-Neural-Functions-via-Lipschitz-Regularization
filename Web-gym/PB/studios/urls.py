from django.urls import path
from rest_framework_simplejwt import views

from .views.StudioView import ListStudioView, DetailStudioView
from .views.ClassView import ClassSearchView, TimeSearchView, ListClassView
from .views.EnrollDropView import EnrollClassView, EnrollTimeView, DropClassView, DropTimeView, UserTimeView

urlpatterns = [
    path('list/', ListStudioView.as_view()),
    path('detail/<int:pk>/', DetailStudioView.as_view()),
    path('class/list/<int:pk>/', ListClassView.as_view()),
    path('class/filter/<int:pk>/', ClassSearchView.as_view()),
    path('class/times/filter/<int:pk>/', TimeSearchView.as_view()),

    path('class/<int:pk>/enroll/', EnrollClassView.as_view()),
    path('class/times/<int:pk>/enroll/', EnrollTimeView.as_view()),
    path('class/<int:pk>/drop/', DropClassView.as_view()),
    path('class/times/<int:pk>/drop/', DropTimeView.as_view()),
]