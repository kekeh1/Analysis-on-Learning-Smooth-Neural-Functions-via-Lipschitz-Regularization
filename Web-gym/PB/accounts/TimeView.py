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

class TimeUpcomingView(ListAPIView):
    serializer_class = TimeSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.request.user.id)
        return user
    
    def get(self, request):
        now = datetime.now(timezone.utc)
        times = CustomUser.objects.filter(id = self.request.user.id).values('class_time')
        result = Time.objects.none()
        for t in times:
            time = Time.objects.filter(id=t['class_time']).values()
            if len(time) == 0: continue
            if time[0]['date_from'] >= now:  result |= time
        #aa

        result = result.order_by('date_from')
        result = result.values()
        return Response(result, status=status.HTTP_200_OK)

class TimeHistoryView(ListAPIView):
    serializer_class = TimeSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.request.user.id)
        return user
    
    def get(self, request):
        now = datetime.now(timezone.utc)
        times = CustomUser.objects.filter(id = self.request.user.id).values('class_time')
        result = Time.objects.none()
        for t in times:
            time = Time.objects.filter(id=t['class_time']).values()
            if len(time) == 0: continue
            if time[0]['date_from'] < now:  result |= time
        
        result = result.order_by('date_from')
        result = result.values()
        return Response(result, status=status.HTTP_200_OK)