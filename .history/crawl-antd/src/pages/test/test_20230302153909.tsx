import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Radio, Input, Space, Select, Tag, Table } from 'antd';
import { GetTest } from '../../services/ant-design-pro/api';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
type GithubIssueItem = {};
import { Link, Route } from 'react-router-dom';
const tableListDataSource: GithubIssueItem[] = [];
import { useHistory } from 'react-router-dom';
export default () => {
  let history = useHistory();
  const [form] = Form.useForm();
  const formRef = useRef<any>();
  const actionRef = useRef<ActionType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iskzModalOpen, setkzModalOpen] = useState(false);
  const [isvalue, setValue] = useState(0);
  const [iskz, setkz] = useState('');
  interface ActionType {
    reload: () => void;
    reloadAndRest: () => void;
    reset: () => void;
    clearSelected?: () => void;
    startEditable: (rowKey: key) => boolean;
    cancelEditable: (rowKey: key) => boolean;
  }

  const SpiderDetail = (row) => {
    let id: string = row.id;
    history.push(`/spider/${id}`);
    console.log(row);
  };
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '测试网站',
      dataIndex: 'starturl',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '状态码',
      dataIndex: 'status',
      valueType: 'text',
      initialValue: 200,
      filters: true,
      onFilter: true,
      valueEnum: {
        200: { text: '200', status: 'Success' },
        close: { text: '关闭', status: 'Default' },
        running: { text: '运行中', status: 'Processing' },
        online: { text: '已上线', status: 'Success' },
        404: { text: '404', status: 'Error' },
        405: { text: '405', status: 'Error' },
      },
    },
    {
      title: '请求方式',
      dataIndex: 'method',
      valueType: 'text',
      initialValue: 200,
      filters: true,
      onFilter: true,
      valueEnum: {
        get: { text: 'get', status: 'Success' },
        post: { text: 'post', status: 'Processing' },
      },
    },
    {
      title: '请求参数',
      dataIndex: 'data',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '请求头',
      dataIndex: 'headers',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '创建时间',
      key: 'start_time',
      dataIndex: 'start_time',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      fixed: 'right',
      valueType: 'option',
      render: (_, row, index, action) => [
        <Button size="small" type="primary" onClick={() => TestKZ(row)}>
          快照
        </Button>,
        <Button size="small" type="primary" onClick={() => Testps(row)}>
          源码
        </Button>,
        <Button size="small" type="primary" danger onClick={() => TestDel(row)}>
          删除
        </Button>,
      ],
    },
  ];
  const TestDel = (row) => {
    console.log(row);
    const DelData = { id: row.id };
    SendAxios('/api/test/del', DelData);
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
  const TestKZ = (row) => {
    setkz(row.source);
    setkzModalOpen(true);
  };

  const Testps = (row) => {
    setkzModalOpen(true);
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    console.log(values);
    console.log('Received values of form:', values);
    // 掉接口
    axios({
      method: 'post',
      url: '/api/test/add',
      data: values,
    })
      .then(function (response) {
        actionRef.current?.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
    // 关闭模态框
    setIsModalOpen(false);
    message.success('测试添加成功');
    // 表单清空
    formRef.current.resetFields();
    actionRef.current?.reload();
  };
  const TestDellALL = (row) => {
    axios({
      method: 'post',
      url: '/api/test/del/all',
      data: { data: row.selectedRowKeys },
    })
      .then(function (response) {
        message.success('全部删除成功');
        actionRef.current?.reset();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const OpenTest = () => {
    setIsModalOpen(true);
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
  const modalContent = iskz;
  return (
    <div>
      <ProTable<GithubIssueItem>
        columns={columns}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                <Button type="dashed">取消选择</Button>
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={(selectedRowKeys) => {
          return (
            <Space size={16}>
              <Button danger onClick={() => TestDellALL(selectedRowKeys)}>
                全部删除
              </Button>
            </Space>
          );
        }}
        actionRef={actionRef}
        request={async (params = {}, sorter, filter) => {
          try {
            console.log(params, sorter, filter);
            sessionStorage.setItem('currentPage', 'params.current');

            let res = await GetTest({
              page: params.current as number,
              project: 0,
              size: params.pageSize as number,
              pucode: params.hasOwnProperty('pucode') ? params.pucode : -1,
              sorter: sorter['start_time'],
            });
            return {
              data: res.results,
              success: true,
              total: res.results.length,
            };
          } catch (error) {
            message.error('请求失败！');
            return {};
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
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => OpenTest()}>
            新建测试
          </Button>,
        ]}
      />
      <Modal
        title="测试添加"
        onCancel={() => {
          setIsModalOpen(false), formRef.current.resetFields();
        }}
        open={isModalOpen}
        width={'80%'}
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
          <Form.Item label="请求方式" name="method">
            <Radio.Group
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={isvalue}
              defaultValue={0}
            >
              <Radio value={0}>GET</Radio>
              <Radio value={1}>POST</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="请求网站"
            name="starturl"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || (names.search('http://') && names.search('https://'))) {
                    return Promise.reject(new Error('链接不正确'));
                  }
                },
              },
            ]}
          >
            <Input placeholder="http://example.com" />
          </Form.Item>
          <Form.Item label="请求参数" name="data">
            <Input.TextArea rows={6} placeholder="p=1&size=10" />
          </Form.Item>
          <Form.Item label="请求头" name="headers">
            <Input.TextArea rows={8} placeholder="useragent: antd_spider" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 快照模态框 */}
      <Modal
        title="页面快照"
        onCancel={() => {
          setkzModalOpen(false);
        }}
        open={iskzModalOpen}
        width={'78%'}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setkzModalOpen(false);
            }}
          >
            取消
          </Button>,
        ]}
      >
        {iskz ? modalContent : null}
        <div id="modalHTMLTest">Please try again</div>
        <script>
          {document.getElementById('modalHTMLTest')
            ? (document.getElementById('modalHTMLTest').innerHTML = modalContent)
            : null}
        </script>
      </Modal>
    </div>
  );
};
