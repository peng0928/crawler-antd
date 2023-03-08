# -*- coding: utf-8 -*-
# @Date    : 2022-11-30 13:55
# @Author  : penr
import pymongo
from bson import ObjectId



class PrMongo(object):

    def __init__(self, dbname=None, Timeout=3000):
        config = self.getconfig()
        self.dbname = dbname if dbname else 'myspider'
        self.myclient = pymongo.MongoClient(f'mongodb://{config[0]}:{config[1]}', serverSelectionTimeoutMS=Timeout)
        self.mydb = self.myclient[self.dbname]

    def insert(self, cname, value):
        mydb = self.myclient[self.dbname]
        mycol = mydb[cname]
        if isinstance(value, dict):
            muuid = value.get('uuid')
            if not muuid:
                print('uuid not found:', value, sep=' ')
            else:
                getuuid = mycol.find_one({"uuid": muuid})
                if getuuid:
                    pass
                else:
                    mycol.insert_one(value)

        if isinstance(value, list):
            for key in value:
                muuid = key.get('uuid')
                if not muuid:
                    print('uuid not found:', key, sep=' ')
                else:
                    getuuid = mycol.find_one({"uuid": muuid})
                    if getuuid:
                        print('重复数据未插入:', key, sep=' ')
                    else:
                        mycol.insert_one(key)
                        print('正在插入数据:', key, sep=' ')

    def update(self, cname, condition, value):
        mydb = self.myclient[self.dbname]
        mycol = mydb[cname]
        mycol.update_one(condition, value)

    def drop(self, tbname):
        mycol = self.mydb[tbname]
        mycol.drop()

    def findall(self, tbname, sort=False, count=False):
        mycol = self.mydb[tbname]
        if sort:
            return mycol.find().sort('startTime', -1)
        elif count:
            return mycol.count_documents({})
        else:
            return mycol.find()

    def find_filter(self, tbname, query):
        mycol = self.mydb[tbname]
        mydoc = mycol.find(query)
        return mydoc

    def delone(self, tbname, query):
        mycol = self.mydb[tbname]
        mycol.delete_one(query)
        return

    def getconfig(self):
        with open('./config/config.json', 'r', encoding='utf-8')as f:
            config = f.read()
        config = eval(config)
        mongoItem = config.get('mongo')
        host = mongoItem.get('host')
        port = mongoItem.get('port')
        return host, port

if __name__ == '__main__':
    p = PrMongo()
    query = {'_id': ObjectId("63a432e67a355c60c4e9c974")}
    collection = (p.find_filter(tbname='runoob_errors', query=query))
    for x in collection:
        print(x)
    print(collection)

