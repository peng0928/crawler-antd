import json
import re
from .useragent import get_ua
import requests


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
        hdic = {}
    hdic.update({"user-agent": get_ua()})
    return hdic


def getRequest(
    url,
    headers,
    method,
    data,
    timeout=3,
    encode="utf-8",
):
    if method == 'post':
        response = requests.request(
            url=url, headers=headers, timeout=timeout, method=method, data=data
        )
    else:
        response = requests.request(
            url=url, headers=headers, timeout=timeout, method=method, params=data
        )
    print(response.text)
    return response.status_code, response.text,
