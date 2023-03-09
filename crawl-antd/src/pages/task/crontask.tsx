import { Cron } from 'szdt-admin-components';

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
  const [iscronvalue, setcronValue] = useState(null);
  const [isSp, setSp] = useState([]);

  interface ActionType {
    reload: () => void;
    reloadAndRest: () => void;
    reset: () => void;
    clearSelected?: () => void;
    startEditable: (rowKey: key) => boolean;
    cancelEditable: (rowKey: key) => boolean;
  }

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '项目',
      dataIndex: 'CronName',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
      fixed: 'left',
    },
    {
      title: '定时爬虫',
      dataIndex: 'CronSpider',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'Cron表达式',
      dataIndex: 'Cron',
      valueType: 'text',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      initialValue: 200,
      filters: true,
      onFilter: true,
      valueEnum: {
        run: { text: '启动', status: 'Success' },
        stop: { text: '关闭', status: 'Default' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'CronCreateTime',
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
          编辑
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

  const OpenTest = () => {
    axios({
      method: 'post',
      url: '/api/spider/obj',
    })
      .then(function (response) {
        console.log(response);
        console.log(response.data.data);
        setSp(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
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

            let res = await GetCron({
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
          <Button key="button" icon={<PlusOutlined />} type="default" onClick={() => OpenTest()}>
            批量添加
          </Button>,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => OpenTest()}>
            新建定时任务
          </Button>,
        ]}
      />

      {/* 定时任务模态框 */}
      <Modal
        title="定时任务"
        onCancel={() => {
          setIsModalOpen(false);
          formRef.current.resetFields();
        }}
        open={isModalOpen}
        width={'50%'}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setIsModalOpen(false);
              formRef.current.resetFields();
            }}
          >
            提交
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              setIsModalOpen(false);
              formRef.current.resetFields();
            }}
          >
            取消
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
          <Form.Item label="定时任务名称" name="CronName">
            <Input placeholder="Example" />
          </Form.Item>
          <Form.Item label="定时任务爬虫" name="CronSpider">
            <Select options={isSp} />
          </Form.Item>
          <Form.Item label="Cron表达式" name="Cron">
            {/* 定时任务 */}
            <Cron defaultType="customize" value={iscronvalue} onChange={setcronValue} />
            <Input value={iscronvalue} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
