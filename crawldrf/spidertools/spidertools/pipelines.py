from spidertools.tool.prmongo import PrMongo


class SpidertoolsPipeline:

    def process_item(self, item, spider):
        PrMongo(dbname='myspider').insert(cname=item['pucode'], value=item)
        return item
