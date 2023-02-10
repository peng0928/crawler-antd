from django import forms
from django.views.decorators.csrf import csrf_exempt
import uuid
import datetime
from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from drfapp.page import MyPageNumberPagination
from drfapp.serializer import SpiderSerializer


class SpiderAPIView(APIView):  # 查看所有及添加数据视图

    def post(self, request):
        page = request.data.get("page")
        size = request.data.get("size")
        sorter = request.data.get("sorter", 'descend')
        sorter = '-start_time' if sorter == 'descend' else 'start_time'
        request.query_params._mutable = True
        request.query_params['page'] = page
        request.query_params['size'] = size
        pucode = request.data.get('pucode')
        if pucode == -1:
            roles = SpiderTask.objects.get_queryset().order_by(sorter)
        else:
            roles = SpiderTask.objects.get_queryset().filter(pucode=pucode).order_by(sorter)
        page = MyPageNumberPagination()
        page_roles = page.paginate_queryset(
            queryset=roles, request=request, view=self)
        roles_serializer = SpiderSerializer(instance=page_roles, many=True)
        return page.get_paginated_response(roles_serializer.data)  # 返回成功数据


class SpiderDel(APIView):  # 查看所有及添加数据视图

    def post(self, request):
        try:
            GetId = request.data.get('id')
            SpiderTask.objects.filter(id=GetId).delete()
            Status = {
                "status": True,
                "msg": '删除成功'
            }
            return Response(Status)
        except Exception as e:
            return Response(e)


class SpiderAdd(APIView):  # 查看所有及添加数据视图

    def post(self, request):
        try:
            TimeNow = datetime.datetime.now()
            pucode = request.data.get('SpiderName')
            project = request.data.get('project')
            GetStrUUID = pucode + '|' + project + '|' + str(TimeNow)
            UUID = uuid.uuid5(uuid.NAMESPACE_DNS, GetStrUUID)
            SpiderTask.objects.create(
                pucode=pucode, project=project, uuid=UUID)
            Status = {
                "status": True,
                "msg": '爬虫添加成功'
            }
            return Response(Status)
        except Exception as e:
            return Response(e)


class TestAPIView(APIView):  # 查看所有及添加数据视图

    def post(self, request):
        try:
            print(request.data)
            return Response(request.data)
        except Exception as e:
            return Response(e)

    def get(self, request):
        return Response('1')


@csrf_exempt
def FileUpload(request):
    if request.method == 'POST':
        print(request.FILES)
        print(request.data)
        # UploadFileModel.objects.create(title=request.FILES['files'], file=request.FILES)
        return HttpResponse('1sssss')

    return HttpResponse('1')
