# -*- coding: utf-8 -*-
# @Date    : 2022-11-30 13:55
# @Author  : penr
import pymongo, uuid


class PrMongo(object):

    def __init__(self, dbname=None, Timeout=3000):
        config = self.getconfig()
        self.dbname = dbname if dbname else 'myspider'
        self.myclient = pymongo.MongoClient(f'mongodb://{config[0]}:{config[1]}', serverSelectionTimeoutMS=Timeout)

    def insert(self, cname, value):
        mydb = self.myclient[self.dbname]
        mycol = mydb[cname]
        myecol = mydb[cname+'_errors']
        if isinstance(value, dict):
            muuid = value.get('uuid')
            errors = value.get('errors')
            if errors:
                euuid = errors.get('euuid')
                cuuid = errors.get('cuuid')
                if euuid or cuuid:
                    geteuuid = myecol.find_one({"euuid": euuid})
                    getcuuid = myecol.find_one({"cuuid": cuuid})
                    content_errors = errors.get('content_errors')
                    listing_errors = errors.get('listing_errors')
                    if geteuuid and listing_errors:
                        del errors['listing_errors']
                    if getcuuid and content_errors:
                        del errors['content_errors']
                    if content_errors or listing_errors:
                        myecol.insert_one(errors)
                        del value['errors']

            if not muuid:
                print('uuid not found:')
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

    def error_insert(self, cname, value):
        mydb = self.myclient[self.dbname]
        myecol = mydb[cname+'_errors']
        exception = value.get('exception')
        if exception:
            uuid = exception.get('uuid')
            getcuuid = myecol.find_one({"uuid": uuid})
            if not getcuuid:
                myecol.insert_one(exception)

    def getconfig(self):
        with open('../../config/config.json', 'r', encoding='utf-8')as f:
            config = f.read()
        config = eval(config)
        mongoItem = config.get('mongo')
        host = mongoItem.get('host')
        port = mongoItem.get('port')
        return host, port

if __name__ == '__main__':
    prdict = [
        {'title': 'xxx', 'age': 18, 'uuid': uuid.uuid5(uuid.NAMESPACE_DNS, 'xxx18').hex},
        {'title': 'xxx', 'age': 18, 'uuid': uuid.uuid5(uuid.NAMESPACE_DNS, 'xxx182').hex},
        {'title': 'xxx','title1': 'xxx','title2': 'xxx', 'age': 18, 'uuid': uuid.uuid5(uuid.NAMESPACE_DNS, 'xxx11813').hex},
    ]

    P = PrMongo(dbname='spider').insert('data', prdict)

