from django.shortcuts import render
from django.contrib.auth.models import User

from rest_framework import status, filters
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import geocoder

from PB.paginations import CustomPagination
from studios.models import Studio, Class, Amenity
from studios.serializers import StudioSerializer

# Create your views here.

class ListStudioView(ListAPIView):
    # template_name = 'html_template.html'
    model = Studio
    context_object_name = 'studios'
    pagination_class = CustomPagination
    serializer_class = StudioSerializer

    def get_queryset(self):
        studios = Studio.objects.all().values()

        if self.request.query_params.get('name'):
            studios = studios.filter(name=self.request.query_params.get('name'))
        
        if self.request.query_params.get('coach'):
            c = self.request.query_params.get('coach')
            wanted = []
            for s in studios:
                classes = Class.objects.filter(studio = s['id'])
                classes = classes.values_list('coach', flat=True)
                if c in classes: wanted.append(s['id'])
            studios = studios.filter(id__in = wanted)
        
        if self.request.query_params.get('class'):
            n = self.request.query_params.get('class')
            wanted = []
            for s in studios:
                classes = Class.objects.filter(studio = s['id'])
                classes = classes.values_list('name', flat=True)
                if n in classes: wanted.append(s['id'])
            studios = studios.filter(id__in = wanted)
        
        if self.request.query_params.get('amenity'):
            a = self.request.query_params.get('amenity')
            q = 0
            if self.request.query_params.get('quantity'): 
                q = int(self.request.query_params.get('quantity'))
            wanted = []
            for s in studios:
                amenities = Amenity.objects.filter(studio = s['id'])
                amenities_type = amenities.values_list('type', flat=True)
                if a in amenities_type: 
                    am = amenities.filter(type = a).values()
                    for aq in am:
                        if aq['quantity'] >= q : wanted.append(s['id'])
                        break
            studios = studios.filter(id__in = wanted)

        if self.request.query_params.get('lat'):
            if self.request.query_params.get('lng'):
                try:
                    latitude = self.request.query_params.get('lat')
                    longitude = self.request.query_params.get('lng')
                except:
                    g = geocoder.ip('me')
                    g = g.latlng
                    latitude = g[0]
                    longitude = g[1]
            else:
                g = geocoder.ip('me')
                g = g.latlng
                latitude = g[0]
                longitude = g[1]
        else:
            g = geocoder.ip('me')
            g = g.latlng
            latitude = g[0]
            longitude = g[1]

        result = []
        print(latitude)
        print(longitude)
        for s in studios:
            dist = geodesic((latitude, longitude), (s["latitude"], s["longitude"]))
            id = s["id"]
            result.append([dist, id])

        def takeDist(elem):
            return elem[0]
        result.sort(key=takeDist)
        close_studios = []
        
        for r in result:
            close_studios += studios.filter(id=r[1])

        return close_studios


class DetailStudioView(APIView):
    # template_name = 'html_template.html'
    model = Studio
    context_object_name = 'studio'

    def get_object(self):
        studios = Studio.objects.all().values()
        serializer = StudioSerializer(studios, many=True)
        return get_object_or_404(studios, id=self.kwargs['pk'])

    def get(self, request, pk):
        obj = self.get_object()
        return Response(obj, status=status.HTTP_200_OK)
