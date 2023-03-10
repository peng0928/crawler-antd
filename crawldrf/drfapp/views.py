import random

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from drfapp.page import MyPageNumberPagination
from drfapp.serializer import SpiderSerializer

class SpiderAPIView(APIView):  # 查看所有及添加数据视图

    def post(self, request):
        print(request.data)
        page = request.data.get("page")
        size = request.data.get("size")
        request.query_params._mutable = True  
        request.query_params['page'] = page 
        request.query_params['size'] = size
        testnum = random.randint(0, 9)
        testnum2 = random.randint(0, 9)
        testname = ['阿里', '腾讯', '网易', '知乎', '淘宝', '拼多多', '京东', '快手', '抖音', '小红书']
        SpiderTask.objects.filter(id=testnum).update(pucode=testname[int(testnum2)])  
        pucode = request.data.get('pucode')
        if pucode == -1:
            roles = SpiderTask.objects.get_queryset().order_by('id')
        else:
            roles = SpiderTask.objects.get_queryset().filter(pucode=pucode).order_by('id')
        page = MyPageNumberPagination()
        page_roles = page.paginate_queryset(queryset=roles, request=request, view=self)
        roles_serializer = SpiderSerializer(instance=page_roles, many=True)
        return page.get_paginated_response(roles_serializer.data)  # 返回成功数据
