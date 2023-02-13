
import json
from pathlib import Path
paths = ['scrape/1.html', 'scrape/spa2.py', 'scrape/spa6.py', 'scrape/ssr3.py', 'scrape/scrapy启动.py', 'scrape/.idea/misc.xml', 'scrape/.idea/.gitignore', 'scrape/.idea/modules.xml', 'scrape/.idea/workspace.xml', 'scrape/.idea/inspectionProfiles/profiles_settings.xml', 'scrape/.idea/inspectionProfiles/Project_Default.xml', 'scrape/.idea/scrape.iml', 'splash_demo/scrapy.cfg', 'splash_demo/splash_demo/items.py', 'splash_demo/splash_demo/__init__.py', 'splash_demo/splash_demo/__pycache__/settings.cpython-37.pyc', 'splash_demo/splash_demo/middlewares.py', 'splash_demo/splash_demo/__pycache__/__init__.cpython-37.pyc', 'splash_demo/splash_demo/spiders/spider.py', 'splash_demo/splash_demo/spiders/__init__.py',
         'splash_demo/splash_demo/spiders/__pycache__/__init__.cpython-37.pyc', 'splash_demo/.idea/.gitignore', 'splash_demo/splash_demo/settings.py', 'splash_demo/splash_demo/pipelines.py', 'splash_demo/.idea/modules.xml', 'splash_demo/splash_demo/spiders/__pycache__/spider.cpython-37.pyc', 'splash_demo/.idea/splash_demo.iml', 'splash_demo/.idea/workspace.xml', 'splash_demo/.idea/inspectionProfiles/profiles_settings.xml', 'splash_demo/.idea/inspectionProfiles/Project_Default.xml', 'splash_demo/.idea/misc.xml', '.idea/.gitignore', '.idea/misc.xml', '.idea/splash_demo.iml', '.idea/inspectionProfiles/Project_Default.xml', '.idea/inspectionProfiles/profiles_settings.xml', '.idea/modules.xml', '.idea/workspace.xml']


def treenode(paths):
    l = []
    l2 = []
    for path in paths:
        pathlist = path.split('/')
        for i in range(len(pathlist)):
            pathdict = {}
            lpath = '0/'+'/'.join(pathlist[:i+1])
            lname = pathlist[i]
            pathdict['key'] = lpath
            pathdict['title'] = lname
            pathdict['leaf'] = True if '.' in lname else False
            pathdict['parent_key'] = '0/'+'/'.join(pathlist[:i])
            if str(pathdict) not in l2:
                l.append((pathdict))
                l2.append(str(pathdict))
    return l


def arr2tree(source, parent):
    tree = []
    for item in source:
        if item["parent_key"] == parent:
            if not item['leaf']:
                item["children"] = arr2tree(source, item["key"])
            tree.append(item)
    return tree


def getTree():
    l = treenode(paths)
    result = arr2tree(l, '0/')
    return result


if __name__ == '__main__':
    # result = arr2tree(arr, '0/')
    print(getTree())
