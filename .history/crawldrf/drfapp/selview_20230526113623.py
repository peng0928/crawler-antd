from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from drfapp.tool.prmongo import PrMongo


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
        queryset = []
        myclient = PrMongo()
        uuid = request.data.get('uuid')
        collection = myclient.findall(tbname=uuid)
        collection = [doc for doc in collection]
        clist = collection[0]
        for k, v in clist.items():
            queryset.append({
                'title': k,
                'dataIndex': k,
                'key': k,
                'ellipsis': True
            })
        return Response(queryset)
