// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function test(options?: { [key: string]: any }) {
  return request<any>('/api/test', {
    method: 'GET',
    ...(options || {}),
  });
}

// export async function GetSpider(options?: { [key: string]: any }) {
//   return request<any>('/api/spider', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

export async function GetSpider(body: API.ReqSpider, options?: { [key: string]: any }) {
  return request<any>('/api/spider', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function GetSpiderRes(body: API.ReqSpider, options?: { [key: string]: any }) {
  return request<any>('/api/spider/result', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function GetTest(body: API.ReqSpider, options?: { [key: string]: any }) {
  return request<any>('/api/test', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function GetCron(body: API.ReqSpider, options?: { [key: string]: any }) {
  return request<any>('/api/cron', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
