from rest_framework import serializers
from drfapp.models import SpiderTask


class SpiderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpiderTask
        fields = '__all__'
