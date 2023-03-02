from multiprocessing import Process
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
    pbdate = datetime.datetime.now()
    queryset = SpiderTask.objects.get(id=spider)
    queryset = eval(queryset.value)
    cls = ['scrapy', 'crawl', 'myspider', '-s', 'LOG_STDOUT=true', '-s',
           'LOG_FILE=log/{}{}{}{}.log'.format(spider, pbdate.year, pbdate.month, pbdate.day)]
    for k, v in dict(queryset).items():
        cls.append('-a')
        cls.append(f"{k}=%s" % urllib.parse.quote(str(v), 'utf-8'))
    cls = ' '.join(cls)


class SpiderRunAPIView(APIView):  # 运行爬虫
    def post(self, request):
        GetData = request.data.get("data")
        project = GetData.get("project")
        # timenow = (datetime.datetime.now() +
        #            datetime.timedelta(seconds=3)).strftime('%Y-%m-%d %H:%M:%S')
        if project == 0:
            print(GetData)
            # JobStauts = scheduler.add_job(
            #     ScrapyRun, 'date', run_date=timenow, args=[uuid])
        # Status = {'jobid': JobStauts.id}
        Status = {'jobid': 1}
        return Response(Status)  # 返回成功数据
