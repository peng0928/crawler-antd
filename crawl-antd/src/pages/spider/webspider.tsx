import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Radio, Input, Space, Select, Tag, Table } from 'antd';
import { GetSpider } from '../../services/ant-design-pro/api';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
type GithubIssueItem = {};
import { Link, Route } from 'react-router-dom';
const tableListDataSource: GithubIssueItem[] = [];
import { useHistory } from 'react-router-dom';
export default () => {
  const [collapsed, setCollapsed] = useState(false);
  const history = useHistory();
  const { Option } = Select;
  const options = [
    { value: 0, label: '标题' },
    { value: 1, label: '时间' },
    { value: 2, label: '内容' },
    { value: 3, label: '链接' },
  ];
  const SpiderDetail = (row) => {
    let id: string = row.id;
    history.push(`/spider/${id}`);
    console.log(row);
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '项目',
      dataIndex: 'project',
      filters: true,
      onFilter: true,
      ellipsis: true,
      fixed: 'left',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '通用爬虫',
          status: 'Success',
        },
        2: {
          text: '定制爬虫',
          status: 'Success',
        },
        1: { text: 'Scrapy爬虫', status: 'Processing' },
      },
    },
    {
      title: '爬虫名',
      dataIndex: 'spider',
      valueType: 'text',
      fixed: 'left',
      render: (text, row, index, action) => [
        <Link to={{ pathname: `/spider/scrapy/${row.uuid}`, state: { id: row.uuid } }}>
          {text}
        </Link>,
      ],
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'start_time',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      fixed: 'right',
      valueType: 'option',
      render: (text, row, index, action) => [
        <Button type="default" size="small" onClick={() => SpiderEdit(row)}>
          {/* <Link to={{ pathname: `/spider/webspider/edit/${row.uuid}`, state: { id: row.uuid } }}> */}
          编辑
          {/* </Link> */}
        </Button>,
        <Button size="small" type="primary" onClick={() => {}}>
          运行
        </Button>,
        <Button size="small" type="primary" danger onClick={() => SpiderDel(row)}>
          删除
        </Button>,
      ],
    },
  ];
  const SpiderDel = (row) => {
    console.log(row);
    const DelData = { id: row.id };
    SendAxios('/api/spider/del', DelData);
    message.success('爬虫删除成功');
    actionRef.current?.reload();
  };
  const SendAxios = (url, values) => {
    axios({
      method: 'post',
      url: url,
      data: values,
    });
  };

  const [Editname, setEditname] = useState('');
  const SpiderEdit = (row) => {
    history.push(`/spider/webspider/edit/${row.uuid}`);
  };

  const [form] = Form.useForm();
  const formRef = useRef<any>();

  const actionRef = useRef<ActionType>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(1);

  const onFinish = async () => {
    const values = await form.validateFields();
    values['project'] = 0;
    console.log(values);
    console.log('Received values of form:', values);
    // 掉接口
    axios({
      method: 'post',
      url: '/api/spider/add',
      data: values,
    });
    // 关闭模态框
    setIsModalOpen(false);
    message.success('爬虫添加成功');
    // 表单清空
    formRef.current.resetFields();
    actionRef.current?.reload();
  };
  const a = (row) => {
    console.log(row);
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  //@ts-ignore
  useEffect(() => {
    //   let a = setInterval(async () => {
    //     actionRef.current?.reload();
    //   }, 600000);
    //   return () => {
    //     clearInterval(a);
    //   };
  }, []);
  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        formRef.current?.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        formRef.current?.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        formRef.current?.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <ProTable<GithubIssueItem>
        columns={columns}
        cardBordered
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          console.log(selectedRowKeys, selectedRows);
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          );
        }}
        tableAlertOptionRender={(selectedRowKeys) => {
          return (
            <Space size={16}>
              <Button danger onClick={() => a(selectedRowKeys)}>
                批量删除
              </Button>
              <Button type="primary">批量运行</Button>
            </Space>
          );
        }}
        actionRef={actionRef}
        request={async (params = {}, sorter, filter) => {
          try {
            console.log(params, sorter, filter);
            sessionStorage.setItem('currentPage', 'params.current');
            let res = await GetSpider({
              page: params.current as number,
              project: 0,
              size: params.pageSize as number,
              spider: params.hasOwnProperty('spider') ? params.spider : -1,
              sorter: sorter['start_time'],
            });
            return {
              data: res.results,
              success: true,
              total: res.count,
            };
          } catch (error) {
            message.error('请求失败！');
            return {};
          }
        }}
        form={{
          ignoreRules: false,
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
          collapsed,
          onCollapse: setCollapsed,
        }}
        scroll={{ x: 1300 }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          // pageSizeOptions: [10, 20, 50, 100],
          defaultCurrent:
            sessionStorage.getItem('currentPage') == null
              ? sessionStorage.getItem('currentPage')
              : 1,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setIsModalOpen(true)}
          >
            新建
          </Button>,
        ]}
      />
      <Modal
        title="爬虫添加"
        onCancel={() => {
          setIsModalOpen(false), formRef.current.resetFields();
        }}
        open={isModalOpen}
        width={'100%'}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false), formRef.current.resetFields();
            }}
          >
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={onFinish}>
            提交
          </Button>,
        ]}
      >
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
            <Radio.Group
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={value}
            >
              <Radio value={0}>GET</Radio>
              <Radio value={1}>POST</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="starturl"
            name="starturl"
            rules={[{ required: true, message: '起始网站缺少' }]}
          >
            <Input name="starturl" defaultValue="" />
          </Form.Item>
          <Form.Item label="host" name="host" rules={[{ required: true, message: '域名缺少' }]}>
            <Input name="host" defaultValue="" />
          </Form.Item>
          <Form.Item
            label="spider"
            name="spider"
            rules={[{ required: true, message: 'spider缺少' }]}
          >
            <Input name="pucode" defaultValue="" />
          </Form.Item>
          <Form.Item label="data" name="data" rules={[{ required: true, message: 'data缺少' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="headers"
            name="headers"
            rules={[{ required: true, message: 'headers缺少' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Form.List name="LData">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        marginBottom: 8,
                        marginTop: 8,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                      align="center"
                    >
                      <Form.Item>
                        <Tag color="success">列表页</Tag>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                        label="标题"
                        rules={[{ required: true, message: 'Missing values' }]}
                      >
                        <Select
                          style={{ width: 300 }}
                          mode="tags"
                          placeholder="Tags Mode"
                          onChange={handleChange}
                          options={options}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'xpath']}
                        label="Xpath"
                        rules={[{ required: true, message: 'Missing values' }]}
                      >
                        <Input style={{ width: 300 }} placeholder="Last Name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'filter']}
                        rules={[{ required: false, message: 'Missing values' }]}
                      >
                        <Input
                          style={{ width: 300 }}
                          placeholder="Last Name"
                          addonBefore="过滤器"
                          defaultValue="过滤器"
                        />
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
            <Form.List name="CData">
              {(Cfields, { add, remove }) => (
                <>
                  {Cfields.map(({ key, name, ...restCField }) => (
                    <Space
                      key={key}
                      style={{
                        marginBottom: 8,
                        marginTop: 8,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                      align="center"
                    >
                      <Form.Item>
                        <Tag color="warning">内容页</Tag>
                      </Form.Item>
                      <Form.Item
                        {...restCField}
                        name={[name, 'Ctitle']}
                        label="标题"
                        rules={[{ required: true, message: 'Missing first name' }]}
                      >
                        <Select
                          style={{ width: 300 }}
                          mode="tags"
                          placeholder="Tags Mode"
                          onChange={handleChange}
                          options={options}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restCField}
                        name={[name, 'Cxpath']}
                        label="Xpath"
                        rules={[{ required: true, message: 'Missing last name' }]}
                      >
                        <Input style={{ width: 300 }} placeholder="Last Name" />
                      </Form.Item>
                      <Form.Item {...restCField} name={[name, 'Cfilter']}>
                        <Input
                          style={{ width: 300 }}
                          placeholder="Last Name"
                          addonBefore="过滤器"
                          defaultValue="过滤器"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()}>
                      添加内容页
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
