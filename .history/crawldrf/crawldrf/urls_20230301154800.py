"""crawldrf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from drfapp import views, spiderView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/spider", views.SpiderAPIView.as_view()),
    path("api/spider/run", spiderView.SpiderRunAPIView.as_view()),
    path("api/spider/uuid", views.SpiderUUIDAPIView.as_view()),
    path("api/spider/add", views.SpiderAdd.as_view()),
    path("api/spider/del", views.SpiderDel.as_view()),
    path("api/upload", views.Upload.as_view()),
    path("api/upload/file", views.FileUpload),

    """测试"""
    path("api/test", views.TestAPIView.as_view()),
    path("api/test/add", views.TestAddAPIView.as_view()),
]
