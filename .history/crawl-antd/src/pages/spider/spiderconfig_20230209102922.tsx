import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Form, Input, Tabs, Checkbox, SelectProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import axios from 'axios';
import { useHistory, Route } from 'react-router-dom';
import { history, useParams } from 'umi';
import type { TabsProps } from 'antd';

const options: SelectProps['options'] = [
  { value: 0, label: '标题' },
  { value: 1, label: '时间' },
  { value: 2, label: '内容' },
  { value: 3, label: '链接' },
];

const App: React.FC = () => {
  let history = useHistory();
  const [isData, Data] = useState(false);
  const params = useParams();
  axios({
    method: 'post',
    url: '/api/test',
    data: {
      result: params['uuid'],
    },
  });
  console.log(params);

  const onChange = (key: string) => {
    console.log(key);
    return <div>111</div>;
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `基本配置`,
      children: (
        <div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Button onClick={() => history.goBack()}>返回</Button>
            <Form.Item
              label="项目"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="爬虫"
              name="spider"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="执行命令"
              name="cls"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: `文件管理`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `定时任务`,
      children: `Content of Tab Pane 3`,
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};

export default App;
