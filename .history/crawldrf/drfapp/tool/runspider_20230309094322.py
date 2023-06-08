# -*- coding: utf-8 -*-
# @Date    : 2022-11-30 11:22
# @Author  : chenxuepeng
import uuid

from scrapy import cmdline
from .prmongo import *
import os


def RunSpider(spidercls, pucode, pbdate):
    taskdict = {}
    mymg = PrMongo(dbname='mytasks')
    os.chdir('./spidertools/spidertools')
    taskdict['pucode'] = pucode
    taskdict['startTime'] = pbdate
    taskdict['ospid'] = os.getpid()
    taskdict['status'] = '正在运行'
    taskdict['uuid'] = uuid.uuid5(uuid.NAMESPACE_DNS, str(taskdict)).hex
    mymg.insert(cname='tasks', value=taskdict)
    os.system(spidercls)
    # cmdline.execute(spidercls)
