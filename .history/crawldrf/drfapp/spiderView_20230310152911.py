from multiprocessing import Process
import datetime
import urllib
from django.shortcuts import render, HttpResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from drfapp.models import *
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from concurrent.futures import ThreadPoolExecutor
from drfapp.tool.prmongo import PrMongo
from drfapp.tool.runspider import RunSpider
executor = ThreadPoolExecutor(200)

scheduler = BackgroundScheduler(timezone='Asia/Shanghai')
scheduler.add_jobstore(DjangoJobStore(), "default")

register_events(scheduler)
scheduler.start()


def ScrapyRun(spider):
    pbdate = datetime.datetime.now()
    queryset = SpiderTask.objects.get(spider=spider)
    queryset = eval(queryset.value)
    cls = ['scrapy', 'crawl', 'myspider', '-s', 'LOG_STDOUT=true', '-s',
           'LOG_FILE=log/{}/{}{}{}.log'.format(spider, pbdate.year, pbdate.month, pbdate.day)]
    for k, v in dict(queryset).items():
        cls.append('-a')
        cls.append(f"{k}=%s" % urllib.parse.quote(str(v), 'utf-8'))
    cls = ' '.join(cls)

    p = Process(target=RunSpider, args=(
        cls, spider, pbdate.strftime('%Y-%m-%d %H:%M:%S')))
    p.start()
    p.join()
    enddate = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    condition = {'startTime': pbdate.strftime(
        '%Y-%m-%d %H:%M:%S'), 'pucode': spider}
    value = {'$set': {'status': '已完成', 'endTime': enddate}}
    mymg = PrMongo(dbname='mytasks')
    mymg.update(cname='tasks', condition=condition, value=value)


class SpiderRunAPIView(APIView):  # 运行爬虫
    def post(self, request):
        GetData = request.data.get("data")
        GetSpider = GetData.get("spider")
        project = GetData.get("project")
        timenow = (datetime.datetime.now() +
                   datetime.timedelta(seconds=3)).strftime('%Y-%m-%d %H:%M:%S')
        if project == 0:
            JobStauts = scheduler.add_job(
                ScrapyRun, 'date', run_date=timenow, args=[GetSpider])
        Status = {'jobid': JobStauts.id}
        return Response(Status)  # 返回成功数据


class SpiderResultAPIView(APIView):
    def post(self, request):
        clist = []
        myclient = PrMongo()
        collection = myclient.findall(tbname='runoob')
        collection = [doc for doc in collection]
        print(collection)
        Status = [{
            'title': '标题',
            'dataIndex': 'name',
            'key': 'name',
        },
            {
            'title': '创建时间',
            'key': 'since',
            'dataIndex': 'createdAt',
        }]
        return Response(Status)
