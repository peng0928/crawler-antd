import os
import datetime
from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(200)

scheduler = BackgroundScheduler(timezone='Asia/Shanghai')
scheduler.add_jobstore(DjangoJobStore(), "default")

register_events(scheduler)
scheduler.start()


def ScrapyRun(spider):
    print(os.getcwd())
    cls = 'scrapy crawl %s' % spider
    pbdate = datetime.datetime.now()
    print(cls, pbdate)


class SpiderRunAPIView(APIView):  # 运行爬虫
    def post(self, request):
        uuid = request.data.get("uuid")
        SpiderType = request.data.get("SpiderType")
        timenow = (datetime.datetime.now() +
                   datetime.timedelta(seconds=3)).strftime('%Y-%m-%d %H:%M:%S')
        if SpiderType == 0:
            JobStauts = scheduler.add_job(
                ScrapyRun, 'date', run_date=timenow, args=[uuid])
        Status = {'jobid': JobStauts.id}
        return Response(Status)  # 返回成功数据
