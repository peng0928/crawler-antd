// 模糊查询接口
export function searchVideo (data) {
    return service.request({
        url:"/video/select",
        method:"get",
        params:data         //请求类型为 get 时
    })
}
