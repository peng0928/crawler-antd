import scrapy


class SpiderSpider(scrapy.Spider):
    name = 'spider'
    start_urls = ['https://www.hainan.gov.cn/hainan/swygwj/list3.shtml']

    def parse(self, response):
        print(response)
