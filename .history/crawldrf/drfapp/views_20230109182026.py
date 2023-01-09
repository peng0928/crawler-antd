import random

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from drfapp.page import MyPageNumberPagination
from drfapp.serializer import SpiderSerializer

class SpiderAPIView(APIView):  # 查看所有及添加数据视图

    def get(self, request):
        testnum = random.randint(0, 9)
        testnum2 = random.randint(0, 9)
        testname = ['阿里', '腾讯', '网易', '知乎', '淘宝', '拼多多', '京东', '快手', '抖音', '小红书']
        SpiderTask.objects.filter(id=testnum).update(pucode=testname[int(testnum2)])
        print(request)
        roles = SpiderTask.objects.get_queryset().order_by('id')
        page = MyPageNumberPagination()
        page_roles = page.paginate_queryset(queryset=roles, request=request, view=self)
        roles_serializer = SpiderSerializer(instance=page_roles, many=True)
        return page.get_paginated_response(roles_serializer.data)  # 返回成功数据
