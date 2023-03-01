import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Form, Input, Divider, Radio, Select, Space, SelectProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import axios from 'axios';

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
    axios({
      method: 'post',
      url: '/api/test',
      data: {
        result: values,
      },
    });
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const { TextArea } = Input;
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  return (
    <>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="请求方式"
          name="method"
          rules={[{ required: true, message: '请求方式缺少' }]}
        >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={0}>GET</Radio>
            <Radio value={1}>POST</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="url" name="url" rules={[{ required: true, message: 'url缺少' }]}>
          <Input name="url" defaultValue="" />
        </Form.Item>
        <Form.Item label="data" name="data" rules={[{ required: true, message: 'data缺少' }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="headers"
          name="headers"
          rules={[{ required: true, message: 'headers缺少' }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
      <Divider></Divider>Divider>
      <Row justify="center">
        <Col span={4}>
          <Button>查看快照</Button>
        </Col>
        <Col span={4}>
          <Button>查看源码</Button>
        </Col>
        <Col span={4}></Col>
        <Col span={4}></Col>
      </Row>
    </>
  );
};

export default App;
