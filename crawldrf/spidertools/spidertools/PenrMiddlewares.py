from spidertools.tool.useragent import *
from spidertools.tool.prmongo import *
import uuid

class Middleware(object):
    """
    随机使用 User Agent 中间件
    """

    def process_request(self, request, spider):
        """
        每次请求都会添加一个随机的 UA
        :param request:
        :param spider:
        :return:
        """
        user_agent = get_ua()
        request.headers['User-Agent'] = user_agent

    def process_response(self, request, response, spider):
        status = response.status
        if status != 200:
            pucode = request.meta.get('pucode')
            pucode = pucode[0] if pucode else pucode
            exception_dict = {
                'pageurl': response.url,
                'pagesource': response.text,
                'msg': 'Spider Exception Code %s' % status
            }
            cuuid = uuid.uuid5(uuid.NAMESPACE_DNS, str(exception_dict)).hex
            exception = {
                'exception': {
                    'uuid': cuuid,
                    'Exception': exception_dict
                }
            }
            PrMongo().error_insert(pucode, exception)

        return response

class ProxyMiddleware(object):
    def __init__(self):
        pass

    def process_request(self, request, spider):
        dont_retry = request.meta.get('dont_retry', False)
        if dont_retry:
            print('代理正在使用：')
            request.meta['retry_times'] += 1
            return
        else:
            request.meta['retry_times'] = 1

    def process_response(self, request, response, spider):
        # retry_times是请求次数
        retry_times = request.meta['retry_times']
        if response.status != 200:
            if retry_times > 3:
                print(response.url, '当前已请求3次，放弃请求:')
                return response
            else:
                print('响应正在尝试ip：', response.url)
                new_request = request.copy()
                new_request.dont_filter = True
                new_request.meta['dont_retry'] = True
                return new_request
        return response
