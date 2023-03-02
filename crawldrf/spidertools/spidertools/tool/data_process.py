import re, time, requests, json, datetime
from dateutil.relativedelta import relativedelta
from lxml import etree
from fake_useragent import UserAgent
from urllib.parse import urljoin


class Xpath():
    def __init__(self, response):
        self.res = etree.HTML(response.text)

    def xpath(self, x=None, filter=None, character=True, is_list=False, easy=False):
        filter = 'style|script' if filter is None else filter
        if filter != None:
            tree = xpath_filter(self.res, filter=filter)
            x = x.split('|')
            if easy:
                x = [i + '/text()' if '/@' not in i else i for i in x]
            else:
                x = [i + '//text()' if '/@' not in i else i for i in x]
            x = '|'.join(x)

            try:
                obj = tree.xpath(x)
                obj = process_text(obj, character, is_list)
            except:
                obj = ''
        else:
            x = x.split('|')
            if easy:
                x = [i + '/text()' if '/@' not in i else i for i in x]
            else:
                x = [i + '//text()' if '/@' not in i else i for i in x]
            x = '|'.join(x)
            try:
                obj = self.res.xpath(x)
                obj = process_text(obj, character, is_list)
            except:
                obj = ''

        return obj

    def dpath(self, x=None, rule=None):
        x = x.split('|')
        x = [i + '//text()' if '/@' not in i else i for i in x]
        x = '|'.join(x)

        obj = self.res.xpath(x)
        obj = ' '.join(obj)
        obj = process_date(data=obj, rule=rule)
        return obj

    def fxpath(self, x=None, p='', h='', rule=None):
        le = x.split('|')
        if len(le) > 1:
            x = x.split('|')
            for item in x:
                p += item + '//text()|'
                h += item + '//@href|'
            p = p[:-1]
            h = h[:-1]
        else:
            p = x + '//text()'
            h = x + '//@href'

        filename = self.res.xpath(p) or None
        filelink = self.res.xpath(h) or None
        fn = []
        fk = []
        try:
            if filename is not None and filelink is not None:
                for i in range(len(filelink)):
                    is_file = bool(
                        re.search(r'(\.tar|\.zip|\.pdf|\.png|\.doc|\.txt|\.ppt|\.html|\.xls|\.rar|\.jpg)',
                                  str(filename[i])))
                    is_link = bool(
                        re.search(r'(\.tar|\.zip|\.pdf|\.png|\.doc|\.txt|\.ppt|\.html|\.xls|\.rar|\.jpg)',
                                  str(filelink[i])))
                    if is_file or is_link:
                        fn.append(filename[i])
                        fk.append(filelink[i])
                    else:
                        pass
                if fn is not None and fk is not None:
                    filename = '|'.join(fn)
                    filename = replace(filename).replace('\n', '')
                    filelink = [urljoin(rule, i) for i in fk]
                    filelink = '|'.join(filelink)

                if len(filelink) == 0 or len(filename) == 0:
                    return None, None
                else:
                    return filename, filelink
            else:
                return None, None
        except:
            return None, None


# 取出时间 data->时间戳，文本
def process_date(data=None, rule=None):
    data = data.replace('年', '-').replace('月', '-').replace('日', ' ').replace('/', '-').replace('.', '-')
    if len(data) == 0:
        return None

    if len(data) == 13 and '-' not in data:
        localtime = time.localtime(int(data) / 1000)
        date = time.strftime("%Y-%m-%d %H:%M:%S", localtime)
        return date

    if len(data) == 10 and '-' not in data:
        localtime = time.localtime(int(data))
        date = time.strftime("%Y-%m-%d %H:%M:%S", localtime)
        return date

    else:
        if rule != None:
            patten = '[' + rule + r']*(\d{1,4}-\d{1,2}-\d{1,2})'
            result = re.findall(patten, data)
        else:
            patten = r'(\d{1,4}-\d{1,2}-\d{1,2})'
            result = re.findall(patten, data)

        if len(result) == 0:
            return None
        else:
            result = re.findall('\d{4}-\d{1,2}-\d{1,2}', result[0])[0]
            return timechange(result)


##时间戳->时间
def process_timestamp(t=None):
    if len(str(t)) != 10:
        t = str(t)[:10]
    else:
        t = t
    timeArray = time.localtime(int(t))
    formatTime = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
    return formatTime


##时间->时间戳
def timestamp(t=None, rule="%Y-%m-%d"):
    s_t = time.strptime(t, rule)
    mkt = int(time.mktime(s_t))
    return (mkt)


# etree解析
def process_text(obj, character=True, is_list=False):
    L = []
    if isinstance(obj, str):
        L.append(obj)

    if isinstance(obj, list):
        for item in obj:
            if item.isspace():
                pass
            elif '\n' in item or '\t' in item:
                item = item.replace('\n', '').replace('\t', '').replace('\r', '').replace('  ', ' ').strip()
                if len(item) == 0:
                    pass
                else:
                    L.append(item)
            else:
                L.append(item)
    if is_list:
        return L

    if character:
        result = '\n'.join(L)
        result = replace(result)
    else:
        result = '  '.join(L)
        result = replace(result)
    if len(result) == 0:
        return None
    else:
        return result.replace("'", "‘").replace('"', '“').replace('  ', ' ').strip()


def replace(str):
    result = re.sub(r'(\\u[a-zA-Z0-9]{4})', lambda x: x.group(1).encode("utf-8").decode("unicode-escape"), str)
    result = re.sub(r'(\\r|\\n|\\t|\xa0)', lambda x: '', result)
    return result


def xpath_filter(response=None, filter=None):
    filter_num = filter.split('|')
    if len(filter_num) > 1:
        filter = filter.split('|')
        filter = '//' + '|//'.join(filter)
    else:
        filter = '//' + filter

    ele = response.xpath(filter)
    for e in ele:
        e.getparent().remove(e)
    return response


def get_link(url=None, headers=None, rpath=None):
    if headers is None:
        headers = {
            'user-agent': UserAgent().random}
    res = requests.get(url=url, headers=headers)
    res.encoding = 'utf-8'
    tree = etree.HTML(res.text)
    xpathobj = tree.xpath(rpath)
    return xpathobj


def get_link_json(url=None, headers=None, proxy=None):
    if headers is None:
        headers = {
            'user-agent': UserAgent().random,
            'Content-Type': 'application/json;charset=utf-8'}

    res = requests.get(url=url, headers=headers, proxies=proxy)
    res.encoding = 'utf-8'
    try:
        resjson = json.loads(res.text)
        return resjson
    except:
        return res.text


def post_link(url=None, rpath=None, data=None, headers=None):
    if headers is None:
        headers = {
            'user-agent': UserAgent().random}
    res = requests.post(url=url, data=data, headers=headers)
    res.encoding = 'utf-8'
    tree = etree.HTML(res.text)
    xpathobj = tree.xpath(rpath)
    return xpathobj


def post_link_json(url=None, data=None, headers=None, proxies=None):
    if headers is None:
        headers = {
            'user-agent': UserAgent().random,
            'Content-Type': 'application/json;charset=utf-8'}

    res = requests.post(url=url, data=data, headers=headers, proxies=proxies)
    if res.status_code == 200:
        res.encoding = 'utf-8'
        resjson = json.loads(res.text)
        return resjson
    else:
        return res.status_code, res.headers


def proxies():
    res = requests.get('http://127.0.0.1:5010/get/')
    proxy = res.json().get('proxy', None)
    proxies = {'http': proxy}
    return proxies


def req_proxies():
    proxies = {'http': 'tps163.kdlapi.com:15818'}
    return proxies


def get_datetime_now(rule='%Y-%m-%d', reduce_year=0, reduce_months=0):
    daytime = datetime.datetime.now()
    if reduce_year or reduce_months:
        daytime = ((daytime - relativedelta(years=reduce_year, months=reduce_months)).strftime(rule))
    else:
        daytime = daytime.strftime(rule)
    return daytime


# 微秒级时间戳
def microsecond_timestamp():
    t = time.time()
    docIdTime = int(round(t * 1000000))
    return docIdTime


# md5
def encrypt_md5(key=None):
    import hashlib
    key = bytes(key, 'utf-8')
    m = hashlib.md5()
    m.update(key)
    result = m.hexdigest()
    return result


def timechange(start_date):
    middle = datetime.datetime.strptime(start_date.replace('/', '-'), '%Y-%m-%d')
    end_date = datetime.datetime.strftime(middle, '%Y-%m-%d')
    return end_date


def url_join(baseurl, url):
    if isinstance(url, list):
        for i in range(len(url)):
            if re.findall('^http', url[i]):
                pass
            else:
                url[i] = urljoin(baseurl, url[i])

    if isinstance(url, str):
        if re.findall('^http', url):
            pass
        else:
            url = urljoin(baseurl, url)
    return url


def error(e):
    datenow = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    msg = {
        '时间': datenow,
        '错误信息': e,
    }
    return msg
