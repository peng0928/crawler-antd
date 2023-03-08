from drfapp.treenodes import *
from django import forms
from django.views.decorators.csrf import csrf_exempt
import uuid
import time
import datetime
from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from drfapp.page import MyPageNumberPagination
from drfapp.serializer import SpiderSerializer
from .tool.encryptions import *
from .tool.prequest import *


class SpiderAPIView(APIView):  # 查看所有及添加数据视图
    def post(self, request):
        page = request.data.get("page")
        project = request.data.get("project")
        size = request.data.get("size")
        sorter = request.data.get("sorter", "descend")
        sorter = "-start_time" if sorter == "descend" else "start_time"
        request.query_params._mutable = True
        request.query_params["page"] = page
        request.query_params["size"] = size
        spider = request.data.get("spider")
        if spider == -1:
            roles = (
                SpiderTask.objects.get_queryset()
                .filter(
                    project=project,
                )
                .order_by(sorter)
            )
        else:
            roles = (
                SpiderTask.objects.get_queryset()
                .filter(project=project, spider=spider)
                .order_by(sorter)
            )
        page = MyPageNumberPagination()
        page_roles = page.paginate_queryset(
            queryset=roles, request=request, view=self)
        roles_serializer = SpiderSerializer(instance=page_roles, many=True)
        return page.get_paginated_response(roles_serializer.data)  # 返回成功数据


class SpiderUUIDAPIView(APIView):
    def post(self, request):
        GetUUID = request.data.get("uuid")
        GetType = request.data.get("type")
        if GetType == "config":
            GetData = SpiderTask.objects.get_queryset().filter(uuid=GetUUID).values()
            return Response(GetData)


class SpiderDel(APIView):  # 查看所有及添加数据视图
    def post(self, request):
        try:
            GetId = request.data.get("id")
            SpiderTask.objects.filter(id=GetId).delete()
            Status = {"status": True, "msg": "删除成功"}
            return Response(Status)
        except Exception as e:
            return Response(e)


class SpiderAdd(APIView):  # 查看所有及添加数据视图
    def post(self, request):
        try:
            TimeNow = datetime.datetime.now()
            SpiderData = request.data.get("data")
            project = SpiderData.get("project")
            spider = SpiderData.get("spider")
            Data = json.dumps(SpiderData)
            GetStrUUID = spider + "|" + str(project) + "|" + str(TimeNow)
            UUID = uuid.uuid5(uuid.NAMESPACE_DNS, GetStrUUID)
            SpiderTask.objects.create(
                spider=spider, project=project, uuid=UUID, value=Data)
            Status = {"status": True, "msg": "爬虫添加成功"}
            return Response(Status)
        except Exception as e:
            Status = {"status": False, "msg": "爬虫添加失败"}
            return Response(e)


class TestAPIView(APIView):  # 查看所有及添加数据视图
    def post(self, request):
        try:
            queryset = Test.objects.all()
            querydict = {"results": queryset.values()}
            return Response(querydict)
        except Exception as e:
            return Response(e)

    def get(self, request):
        return Response("1")


class TestAPIViewView(APIView):  # 查看所有及添加数据视图
    def post(self, request):
        try:
            GetID = request.data.get('id')
            queryset = Test.objects.all().filter(id=GetID)
            querydict = {"results": queryset.values()}
            return Response(querydict)
        except Exception as e:
            return Response(e)

    def get(self, request):
        return Response("1")


class TestAddAPIView(APIView):  # 添加测试
    def post(self, request):
        try:
            queryset = request.data
            method = queryset.get("method")
            method = "post" if method == 1 else "get"
            starturl = queryset.get("starturl")
            data = queryset.get("data", "")
            headers = queryset.get("headers", "")
            headers = getHeaders(headers)
            start_time = str(int(time.time()))
            _md5 = md5(start_time)
            get_status, get_source = getRequest(
                url=starturl, headers=headers, method=method, data=data
            )
            Test.objects.create(
                _md5=_md5,
                starturl=starturl,
                method=method,
                headers=headers,
                data=data,
                source=get_source,
                status=get_status,
            )

            return Response(request.data)
        except Exception as e:
            return Response(e)


class TestDelAPIView(APIView):
    def post(self, request):
        try:
            GetId = request.data.get("id")
            Test.objects.filter(id=GetId).delete()
            Status = {"status": True, "msg": "删除成功"}
            return Response(Status)
        except Exception as e:
            return Response(e)


class TestDelAllAPIView(APIView):
    def post(self, request):
        try:
            GetIds = request.data.get("data")
            for GetId in GetIds:
                Test.objects.filter(id=GetId).delete()
            Status = {"status": True, "msg": "删除成功"}
            return Response(Status)
        except Exception as e:
            return Response(e)


class Upload(APIView):
    def post(self, request):
        TreeList = []
        GetUUID = request.data.get("uuid")
        GetData = (
            UploadFileModel.objects.get_queryset().filter(uuid=GetUUID).values("path")
        )
        for GetQuerySet in GetData:
            path = GetQuerySet.get("path")
            TreeList.append(path)
        tree = getTree(TreeList)
        if not tree:
            tree = [{"title": "~", "key": "0-0"}]
        return Response(tree)


@csrf_exempt
def FileUpload(request):
    if request.method == "POST":
        FILES = request.FILES
        for k, v in FILES.items():
            ksplit = k.split("&")
            uuid = ksplit[0]
            path = ksplit[1]
            UploadFileModel.objects.create(uuid=uuid, path=path)
        #     with open(f'./upload/{v}', 'wb+') as destination:
        #         for chunk in v.chunks():
        #             destination.write(chunk)

        return HttpResponse("1sssss")

    return HttpResponse("1")
