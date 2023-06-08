# -*- coding: utf-8 -*-
# @Date    : 2022-11-29 11:21
# @Author  : chenxuepeng

import urllib
import urllib.parse
import datetime
import json
import re
import scrapy
import uuid
from spidertools.tool.data_process import Xpath
from urllib.parse import urljoin


class MainSpider(scrapy.Spider):
    name = 'myspider'
    to_day = datetime.datetime.now()

    def __init__(self, *args, **kwargs):
        super(MainSpider, self).__init__(*args, **kwargs)
        self.pname = []
        self.listing_url = self.eval(kwargs.get('starturl'))
        self.listing_name = self.eval(kwargs.get('listing_name'))
        self.listing_value = self.eval(kwargs.get('listing_value'))
        self.listing_filter = self.eval(kwargs.get('listing_filter'))
        self.CData = self.eval(kwargs.get('CData'))
        self.content_name = self.CData.get('Ctitle')
        self.content_value = self.CData.get('Cxpath')
        self.content_filter = self.CData.get('Cfilter')
        self.host = self.eval(kwargs.get('host'))
        self.pucode = self.eval(kwargs.get('spider'))
        self.nextpage_value = kwargs.get('nextpage_value')
        self.nextpage_name = kwargs.get('nextpage_name')
        startpage = kwargs.get('startpage')
        endpage = kwargs.get('endpage')
        method = kwargs.get('method')
        listing_data = self.eval(kwargs.get('listing_data'))
        listing_headers = self.eval(kwargs.get('listing_headers'))
        self.startpage = int(self.eval(startpage)[0]) if startpage else 5
        self.endpage = int(self.eval(endpage)[0]) if endpage else 0
        self.method = self.eval(method)[0] if method else method
        headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,application/json,',
            'Accept-Language': 'en,zh-CN,zh;q=0.9,en;q=0.8',
        }
        self.listing_data = listing_data[0] if listing_data else listing_data
        self.headers = self.headers_cell(
            header=listing_headers[0]) if listing_headers else headers
        nextpage_value = self.eval(kwargs.get('nextpage_value'))
        self.nextpage_value = nextpage_value[0] if nextpage_value else None
        self.nextpage_name = self.eval(self.nextpage_name)[
            0] if self.nextpage_name else None
        self.nextpage = True

    def start_requests(self):
        self.listing_url = self.listing_url.split('\n')
        for starturl in self.listing_url:
            if self.method == 'POST':
                meta = {
                    'body': self.listing_data,
                    'method': 'POST',
                }
                yield scrapy.Request(url=starturl, callback=self.listing_parse, method='POST',
                                     body=self.listing_data, headers=self.headers, meta=meta)
            else:
                meta = {
                    'body': self.listing_data,
                    'method': 'GET',
                    'pucode': self.pucode,
                }
                yield scrapy.Request(url=starturl, callback=self.listing_parse,
                                     headers=self.headers, meta=meta)

    def listing_parse(self, response):
        ldict = {}
        litem = {}
        clink = []
        liserrorlist = []
        self.pname = []
        for fate in range(len(self.listing_name)):
            lfilter = self.listing_filter[fate] if self.listing_filter[fate] else None
            lname = self.listing_name[fate]
            lvalue = self.listing_value[fate]
            lresponse = Xpath(response)
            if lname == '链接':
                value = lresponse.xpath(lvalue, filter=lfilter, is_list=True)
                value = [urljoin(response.url, i) for i in value]
                clink = value
                ldict[lname] = value
                if not value:
                    liserrorlist.append({
                        lname: lvalue,
                        'msg': 'not found',
                        'pageurl': response.url,
                        'pagesource': response.text
                    })

            else:
                lname = self.dict_name(name=lname)
                lresult = lresponse.xpath(lvalue, filter=lfilter, is_list=True)
                ldict[lname] = lresult
                litem[lname] = lresult
                if not lresult:
                    liserrorlist.append({
                        lname: lvalue,
                        'msg': 'not found',
                        'pageurl': response.url,
                        'pagesource': response.text
                    })

            if self.nextpage_value and self.nextpage:
                if self.nextpage_name == 'xpath':
                    value = lresponse.xpath(
                        self.nextpage_value, filter=lfilter)
                    next_url = response.urljoin(value)
                    if self.startpage < self.endpage + 1:
                        self.startpage += 1
                        yield scrapy.Request(url=next_url, headers=self.headers, callback=self.listing_parse)

                if self.nextpage_name == '正则':
                    for page in range(self.startpage, self.endpage + 1):
                        if response.meta['method'] == 'POST':
                            body = self.nextpage_value.replace('$', str(page))
                            self.nextpage = False
                            yield scrapy.Request(url=response.url, callback=self.listing_parse, method='POST',
                                                 headers=self.headers, body=body, meta={'pucode': self.pucode})
                        else:
                            next_url = response.urljoin(
                                self.nextpage_value).replace('$', str(page))
                            self.nextpage = False
                            yield scrapy.Request(url=next_url, headers=self.headers, callback=self.listing_parse,
                                                 meta={'pucode': self.pucode})

        ldict['pucode'] = self.pucode
        ldict['url'] = response.url
        ldict['createtime'] = self.datetime()
        ldict['uuid'] = uuid.uuid5(
            uuid.NAMESPACE_DNS, (response.url + response.text)).hex
        ldict['pagesource'] = response.text
        if liserrorlist:
            ldict['errors'] = {'listing_errors': liserrorlist,
                               'euuid': uuid.uuid5(uuid.NAMESPACE_DNS, str(liserrorlist)).hex}
        print(clink)
        print(ldict)
        if clink:
            for query in range(len(clink)):
                queryitem = {}
                for k, v in litem.items():
                    try:
                        queryitem[k] = v[query]  # 依次取对于的字典
                    except:
                        pass

                ldict['queryitem'] = queryitem
                yield scrapy.Request(url=clink[query], callback=self.cparse, headers=self.headers, meta=ldict,
                                     dont_filter=True)
        else:
            yield ldict

    def cparse(self, response):
        cdict = {}
        self.pcname = []
        for i in self.pname:
            self.pcname.append(i)
        conerrorlist = []
        conerrordict = {}
        listing_errors = response.meta.get('errors')
        print(self.content_name)
        for fate in range(len(self.content_name)):
            cfilter = self.content_filter[fate] if self.content_filter[fate] != '过滤器' else None
            cname = self.content_name[fate]
            cvalue = self.content_value[fate]
            cresponse = Xpath(response)
            cname = self.cdict_name(name=cname)
            cresult = cresponse.xpath(cvalue, filter=cfilter)
            cdict[cname] = cresult
            if not cresult:
                conerrorlist.append({
                    cname: cvalue,
                    'msg': 'not found',
                    'pageurl': response.url,
                    'pagesource': response.text
                })

        cdict.update(response.meta.get('queryitem'))
        cdict['curl'] = response.url
        cdict['section'] = response.meta['url']
        cdict['uuid'] = uuid.uuid5(uuid.NAMESPACE_DNS, json.dumps(cdict)).hex
        cdict['pucode'] = self.pucode[0]
        cdict['createtime'] = self.datetime()
        cdict['pagesource'] = response.text

        """xpath报错"""
        if conerrorlist:
            conerrordict['errors'] = {'content_errors': conerrorlist,
                                      'cuuid': uuid.uuid5(uuid.NAMESPACE_DNS, str(conerrorlist)).hex}
            if listing_errors:
                conerrordict['errors'].update(listing_errors)
            cdict['errors'] = conerrordict.get('errors')
        else:
            if listing_errors:
                conerrordict['errors'] = listing_errors
                cdict['errors'] = conerrordict.get('errors')
        yield cdict

    def dict_name(self, name):
        if name in self.pname:
            search = re.findall("\d+", name)
            if search:
                name = name.replace(search[0], '') + str(int(search[0]) + 1)
            else:
                name += '1'
            return self.dict_name(name)
        else:
            self.pname.append(name)
            return name

    def cdict_name(self, name):
        if name in self.pcname:
            search = re.findall("\d+", name)
            if search:
                name = name.replace(search[0], '') + str(int(search[0]) + 1)
            else:
                name += '1'
            return self.cdict_name(name)
        else:
            self.pcname.append(name)
            return name

    def headers_cell(self, header):
        headers_dict = {}
        headers = header.split('\r\n')
        for hitem in headers:
            key = hitem.split(':')[0]
            value = hitem.split(':')[1:]
            value = ''.join(value)
            headers_dict[key] = value.strip()
        return headers_dict

    def eval(self, obj):
        try:
            obj = urllib.parse.unquote(obj, 'utf-8')
            if '[' in obj:
                return eval(obj) if obj else obj
            else:
                return obj
        except:
            return obj

    def datetime(self):
        return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
