from multiprocessing import Process
import datetime, os
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
    os.makedirs(f'./spidertools/spidertools/log/{spider}', exist_ok=True)
    pbdate = datetime.datetime.now()
    queryset = SpiderTask.objects.get(spider=spider)
    queryset = eval(queryset.value)
    cls = ['scrapy', 'crawl', 'myspider', '-s', 'LOG_STDOUT=true', '-s',
           'LOG_FILE=log/{}/{}{}{}.log'.format(spider, pbdate.year, pbdate.month, pbdate.day)]
    for k, v in dict(queryset).items():
        cls.append('-a')
        cls.append(f"{k}=%s" % str(v))
    cls = ' '.join(cls)
    print(cls)
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
        titlelist =     {
              '0' : '标题',
              '1' : '时间',
              '2' : '内容',
              '3' : '链接',
                          }
        querylist = []
        myclient = PrMongo()
        lable_list = ['_id', 'pucode', 'url', 'createtime', 'uuid',
                    #    'pagesource'
                       ]
        spider = request.data.get('uuid')
        collection = myclient.findall(tbname=spider)
        for i in collection:
            _id = i.get('_id')
            i.update({'_id': str(_id)})
            querylist.append(i)
        return Response({'results': querylist})
