import json, re
from .useragent import get_ua


def getHeaders(headers):
    if headers:
        if headers[0] == "{" and headers[-1] == "}":
            header = (
                headers.replace("\r", "")
                .replace(" ", "")
                .replace("':'", "': '")
                .split("\n")
            )
            header = "".join(header)
            json_string = json.dumps(eval(header))
            hdic = json.loads(json_string)

        else:
            hdic = {}
            headers = re.findall("(.*): (.*)", headers)
            for query in headers:
                hdic[query[0].replace('"', "")] = query[1].replace("\r", "")
    else:
        headers = {"user-agent": get_ua()}
        hdic = headers

    return hdic
