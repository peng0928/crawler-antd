from django.db import models


# Create your models here.


class Task(models.Model):
    task_name = models.CharField(max_length=50, verbose_name="任务名称")
    task_uuid = models.CharField(
        max_length=50, verbose_name="任务id", blank=True, null=True
    )
    start_time = models.DateTimeField(verbose_name="开始时间", auto_now=True)
    end_time = models.DateTimeField(verbose_name="结束时间", blank=True, null=True)
    status_choice = (
        (0, "未启动"),
        (1, "正在运行"),
        (2, "已完成"),
        (3, "异常"),
    )
    status = models.IntegerField(choices=status_choice, default=0, verbose_name="状态")


class TaskList(models.Model):
    task_name = models.CharField(max_length=50, verbose_name="任务名称")
    task_uuid = models.CharField(
        max_length=50, verbose_name="任务id", blank=True, null=True
    )
    start_time = models.DateTimeField(verbose_name="开始时间", auto_now=True)
    end_time = models.DateTimeField(verbose_name="结束时间", blank=True, null=True)
    status_choice = (
        (0, "未启动"),
        (1, "正在运行"),
        (2, "已完成"),
        (3, "异常"),
        (4, "正在停止"),
    )
    status = models.IntegerField(choices=status_choice, default=0, verbose_name="状态")


class SpiderTask(models.Model):
    spider = models.CharField(max_length=100, verbose_name="爬虫")
    # project 0: webspider; 1: scrapy; 2: other spideer
    project_choices = (
        (0, "webspider"),
        (1, "scrapy"),
        (2, "other spideer"),
    )
    project = models.CharField(max_length=2, choices=project_choices, default=0)
    value = models.CharField(max_length=1000, verbose_name="任务详细")
    uuid = models.CharField(max_length=36, verbose_name="爬虫uuid")
    start_time = models.DateTimeField(verbose_name="创建时间", auto_now=True)


class MongoConfig(models.Model):
    name = models.CharField(max_length=50, verbose_name="名称")
    host = models.CharField(max_length=50, verbose_name="地址")
    port = models.IntegerField(verbose_name="端口")
    status_choice = (
        (0, "使用"),
        (1, "挂起"),
    )
    status = models.IntegerField(choices=status_choice, default=1, verbose_name="状态")


class SchedulerTask(models.Model):
    schedulerid = models.CharField(max_length=255, verbose_name="调度id")
    crontitle = models.CharField(max_length=255, verbose_name="定时任务名称")
    cronspider = models.CharField(max_length=255, verbose_name="爬虫")
    start_time = models.DateTimeField(verbose_name="定时任务创建时间", auto_now=True)


class UploadFileModel(models.Model):
    uuid = models.CharField(max_length=36)
    path = models.FileField()


class Test(models.Model):
    starturl = models.CharField(max_length=255, verbose_name="测试链接")
    method = models.CharField(max_length=10, verbose_name="请求方式")
    data = models.CharField(max_length=1024, verbose_name="请求参数")
    headers = models.CharField(max_length=1024, verbose_name="请求头")
