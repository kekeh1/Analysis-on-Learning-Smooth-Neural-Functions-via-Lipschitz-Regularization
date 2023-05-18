from rest_framework import serializers

from accounts.models import CustomUser
from studios.models import Studio, Class, Time

class StudioSerializer(serializers.ModelSerializer):
    # class_set = ClassSerializer(many=True)
    class Meta:
        model = Studio
        fields = '__all__'

class ClassSerializer(serializers.ModelSerializer):
    studio = StudioSerializer
    class Meta:
        model = Class
        fields = ('id', 'name', 'description', 'coach', 'keywords',
            'capacity', 'start_date', 'end_date', 'recurring', 'time_from', 'time_end' , 'range')

class TimeSerializer(serializers.ModelSerializer):
    studio_class = ClassSerializer(read_only=True)
    class Meta:
        model = Time
        fields = ('id', 'studio_class', 'date_from', 'date_end', 'capacity')

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class UserTimeView(serializers.ModelSerializer):
    class_time = TimeSerializer(read_only=True, many=True)
    
    class Meta:
        model = CustomUser
        fields = ('class_time', 'date_from', 'date_end')