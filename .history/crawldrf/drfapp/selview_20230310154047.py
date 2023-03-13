from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *


class GetSpiderName(APIView):

    def post(self, request):
        querylist = []
        queryset = SpiderTask.objects.values('spider')
        for query in queryset:
            gspider = query.get('spider')
            querylist.append({'value': gspider, 'label': gspider})
        return Response({'data': querylist})


class GetSpiderRes(APIView):
    def post(self, request):
        pass
