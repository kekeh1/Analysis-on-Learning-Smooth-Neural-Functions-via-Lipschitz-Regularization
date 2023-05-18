from datetime import datetime, timezone, timedelta

from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

from rest_framework import status, filters, serializers
from rest_framework.generics import ListAPIView, UpdateAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from accounts.models import CustomUser
from PB.paginations import CustomPagination
from studios.models import Studio, Class, Time
from studios.serializers import CustomUserSerializer, UserTimeView, TimeSerializer

# Create your views here.

class EnrollClassView(APIView):
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.request.user.id)
        return user
    
    def get(self, request, pk):
        user = self.get_object()
        if not user.is_subscribed: return Response("You are not subscribed yet.")
        class_ = get_object_or_404(Class, id=self.kwargs['pk'])
        now = datetime.now(timezone.utc)

        times = Time.objects.filter(studio_class=class_)
        for t in times:
            if t.date_from < now: continue
            if t in user.class_time.all(): continue
            if t.capacity <= 0: continue
            user.class_time.add(t)
            t.capacity -= 1
            t.save()
        return Response("Successfully enrolled in all available classes.")


class EnrollTimeView(APIView):
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.request.user.id)
        return user
    
    def get(self, request, pk):
        user = self.get_object()
        if not user.is_subscribed: return Response("You are not subscribed yet.")
        time = get_object_or_404(Time, id=self.kwargs['pk'])
        now = datetime.now(timezone.utc)
        if time.date_from < now: return Response("This class has been ended.")
        if time in user.class_time.all(): return Response("Already enrolled.")
        if time.capacity <= 0: return Response("This class is already full.")
        user.class_time.add(time)
        time.capacity -= 1
        time.save()
        return Response("Successfully enrolled.")

class DropClassView(APIView):
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.request.user.id)
        return user
    
    def get(self, request, pk):
        user = self.get_object()
        if not user.is_subscribed: return Response("You are not subscribed yet.")
        class_ = get_object_or_404(Class, id=self.kwargs['pk'])
        now = datetime.now(timezone.utc)

        times = Time.objects.filter(studio_class=class_)
        for t in times:
            if t.date_from < now: continue
            if t not in user.class_time.all(): continue
            user.class_time.remove(t)
            t.capacity += 1
            t.save()
        return Response("Successfully dropped.")


class DropTimeView(APIView):
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.request.user.id)
        return user
    
    def get(self, request, pk):
        user = self.get_object()
        if not user.is_subscribed: return Response("You are not subscribed yet.")
        time = get_object_or_404(Time, id=self.kwargs['pk'])
        now = datetime.now(timezone.utc)
        if time.date_from < now: return Response("This class has been ended.")
        if time not in user.class_time.all(): return Response("Already dropped.")
        user.class_time.remove(time)
        time.capacity += 1
        time.save()
        return Response("Successfully dropped.")


        
        
