import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Radio, Input, Space, Select } from 'antd';
import { GetSpider } from '../../services/ant-design-pro/api'
import { useEffect, useRef, useState } from 'react';

type GithubIssueItem = {

};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    search:false
  },
  {
    title: 'pucode',
    dataIndex: 'pucode',
  },
  {
    title: 'value',
    dataIndex: 'value',
    search:false
  }
];

const options = [
  { value: 0, label: '标题' },
  { value: 1, label: '时间' },
  { value: 2, label: '内容' },
  { value: 3, label: '链接' },
];

export default () => {
  const [form] = Form.useForm()
  const formRef = useRef<any>()

  const actionRef = useRef<ActionType>();

  const [isModalOpen,setIsModalOpen] = useState(false)
  const [value, setValue] = useState(1);


  const onFinish = async () => {
    const values = await form.validateFields()
    console.log(values);
    
    // 掉接口

    // setIsModalOpen(false)
    // actionRef.current?.reload()
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  //@ts-ignore
  useEffect(() => {
    let a = setInterval(async () => {
      actionRef.current?.reload()
    }, 15000)

    return () => {
            clearInterval(a)
        }
  }, [])


  return (
    <div>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          try {
            console.log(sort, filter);
            console.log(params);
            sessionStorage.setItem('currentPage','params.current')

            let res = await GetSpider({
              page: params.current as number,
              size: params.pageSize as number,
              pucode: params.hasOwnProperty('pucode') ? params.pucode : -1
            })
            return {
              data: res.results,
              success: true,
              total:res.count
            }
          } catch (error) {
            message.error("请求失败！")
            return {

            }
          }
        }}
        loading={false}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          // pageSizeOptions: [10, 20, 50, 100],
          defaultCurrent: sessionStorage.getItem('currentPage')==null?sessionStorage.getItem('currentPage'):1
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={()=>setIsModalOpen(true)}>
            新建
          </Button>
        ]}
      />
      <Modal title="Add" open={isModalOpen} width={'100%'} footer={[<Button key="cancel" onClick={() => {setIsModalOpen(false),formRef.current.resetFields()}}>取消</Button>,<Button key="submit" type="primary" onClick={onFinish}>提交</Button>]}>
        <Form
          name="dynamic_form_nest_item"
          form={form}
          ref={formRef}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
                  label="请求方式"
                  name="method"
                  rules={[{ required: true, message: '请求方式缺少' }]}
                >
                <Radio.Group onChange={(e)=>{setValue(e.target.value)}} value={value}>
                <Radio value={0}>GET</Radio>
                <Radio value={1}>POST</Radio>
                </Radio.Group>
          </Form.Item>
          <Form.Item
            label="host"
            name="host"
                  rules={[{ required: true, message: '域名缺少' }]}
                >
                  <Input name='host' defaultValue="" />
          </Form.Item>
          <Form.Item
            label="pucode"
            name="pucode"
                  rules={[{ required: true, message: 'pucode缺少' }]}

                >
                  <Input name='pucode' defaultValue="" />
          </Form.Item>
          <Form.Item
                  label="data"
                  name='data'
                  rules={[{ required: true, message: 'data缺少' }]}
                >
                  <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
                  label="headers"
                  name='headers'
                  rules={[{ required: true, message: 'headers缺少' }]}
                >
                  <Input.TextArea rows={4} />
          </Form.Item>
          <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
          <Form.List name="data">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{  marginBottom: 8, marginTop: 8, marginLeft:'auto', marginRight:'auto' }} align="center">
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            label="标题"
                            rules={[{ required: true, message: 'Missing first name' }]}
                          >
                            <Select
                              style={{ width: 300 }}
                              mode="tags"
                              placeholder="Tags Mode"
                              onChange={handleChange}
                              options={options} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'xpath']}
                            label="Xpath"
                            rules={[{ required: true, message: 'Missing last name' }]}
                          >
                            <Input style={{ width: 300 }} placeholder="Last Name"  />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'filter']}
                            rules={[{ required: true, message: 'Missing last name' }]}
                          >
                            <Input style={{ width: 300 }} placeholder="Last Name" addonBefore="过滤器" defaultValue="过滤器" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()}>
                        添加列表页
                      </Button>
                    </Form.Item>
                  </>
                )}
          </Form.List>
          </div>
        </Form>
      </Modal>
    </div>
  );
};