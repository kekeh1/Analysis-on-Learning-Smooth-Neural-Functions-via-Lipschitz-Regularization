from datetime import datetime, timezone, timedelta

from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework import status, filters
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import geocoder

from studios.models import Studio, Class, Time
from studios.serializers import StudioSerializer, ClassSerializer, TimeSerializer
from rest_framework import generics

from PB.paginations import CustomPagination


# Create your views here.

class ListClassView(ListAPIView):
    # template_name = 'html_template.html'
    model = Time
    context_object_name = 'times'
    pagination_class = CustomPagination
    serializer_class = TimeSerializer

    def get_queryset(self):

        try: find_studio = Studio.objects.get(pk=self.kwargs['pk'])
        except Studio.DoesNotExist:
            return get_object_or_404(Studio, id=self.kwargs['pk'])  

        studio = Studio.objects.filter(id=self.kwargs['pk'])
        
        cl = Class.objects.filter(studio = find_studio)
        classes = Time.objects.none()
        for c in cl:
            times = Time.objects.filter(studio_class = c)
            classes |= times

        now = datetime.now(timezone.utc)
        result = []
        for c in classes:
            if c.date_from < now: continue
            diff = c.date_from - now
            id = c.pk
            result.append([diff, id])

        def takeDist(elem):
            return elem[0]

        result.sort(key=takeDist)
        close_classes = Time.objects.none()

        for r in result: close_classes |= classes.filter(id=r[1])
        return close_classes


class ClassSearchView(generics.ListAPIView):
    model = Class
    serializer_class = ClassSerializer
    pagination_class = CustomPagination

    def get_queryset(self):

        try:
            find_studio = Studio.objects.get(pk=self.kwargs['pk'])
        except Studio.DoesNotExist:
            return get_object_or_404(Studio, id=self.kwargs['pk'])
        result = Class.objects.filter(studio=find_studio)

        if self.request.query_params.get('name'):
            result = result.filter(name=self.request.query_params.get('name'))

        if self.request.query_params.get('coach'):
            result = result.filter(coach=self.request.query_params.get('coach'))

        if self.request.query_params.get('start_date'):
            _datetime = datetime.strptime(self.request.query_params.get('start_date'), '%Y-%m-%d')
            result = result.filter(start_date=_datetime)

        if self.request.query_params.get('end_date'):
            _datetime = datetime.strptime(self.request.query_params.get('end_date'), '%Y-%m-%d')
            result = result.filter(end_date=_datetime)

        if self.request.query_params.get('range_smaller'):
            try:
                date_object = int(self.request.query_params.get('range_smaller'))

            except ValueError:
                return []
            result = result.filter(range__range=[0, date_object], studio=find_studio)
        if self.request.query_params.get('range_greater'):
            try:
                date_object = int(self.request.query_params.get('range_greater'))
            except ValueError:
                return []



            result = result.filter(range__range=[date_object, 600], studio=find_studio)
        return result


class TimeSearchView(generics.ListAPIView):
    model = Time
    serializer_class = TimeSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        try:
            find_studio = Studio.objects.get(pk=self.kwargs['pk'])
        except Studio.DoesNotExist:
            return get_object_or_404(Studio, id=self.kwargs['pk'])

        result = Time.objects.none()
        have_p = False
        _Class = Class.objects.filter(studio=find_studio)


        if self.request.query_params.get('name'):
            have_p = True
            _Class = _Class.filter(name=self.request.query_params.get('name'))

            for _class in _Class :
                temp = Time.objects.filter(studio_class = _class)
                result = temp | result

        if self.request.query_params.get('coach'):
            have_p = True
            _Class = _Class.filter(coach=self.request.query_params.get('coach'))
            for _class in _Class:
                temp = Time.objects.filter(studio_class=_class)
                result = temp | result

        if self.request.query_params.get('date_from'):
            have_p = True

            _datetime = datetime.strptime(self.request.query_params.get('date_from'), '%Y-%m-%d').date()
            temp = Time.objects.filter(date_from__year=_datetime.year, date_from__month=_datetime.month, date_from__day=_datetime.day)
            result = result | temp
        if self.request.query_params.get('date_end'):
            have_p = True
            _datetime = datetime.strptime(self.request.query_params.get('date_end'), '%Y-%m-%d')
            result = result | Time.objects.filter(date_end__year=_datetime.year, date_end__month=_datetime.month, date_end__day=_datetime.day)

        if self.request.query_params.get('capacity'):
            have_p = True

            temp = Time.objects.filter(capacity = self.request.query_params.get('capacity'))
            result = temp | result

        if(have_p == False):
            for _class in _Class :
                temp = Time.objects.filter(studio_class = _class)
                result = result | temp
        return result