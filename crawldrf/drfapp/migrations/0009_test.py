# Generated by Django 4.1.7 on 2023-02-23 12:08

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("drfapp", "0008_alter_spidertask_project"),
    ]

    operations = [
        migrations.CreateModel(
            name="Test",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("starturl", models.CharField(max_length=255, verbose_name="测试链接")),
                ("method", models.CharField(max_length=10, verbose_name="请求方式")),
                ("data", models.CharField(max_length=1024, verbose_name="请求参数")),
                ("headers", models.CharField(max_length=1024, verbose_name="请求头")),
                ("source", models.TextField(verbose_name="源码")),
                ("status", models.IntegerField(verbose_name="响应状态码")),
                (
                    "start_time",
                    models.DateTimeField(auto_now=True, verbose_name="创建时间"),
                ),
            ],
        ),
    ]
