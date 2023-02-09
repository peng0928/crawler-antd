import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Form, Input, Radio, Select, Space, SelectProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import axios from 'axios';
import { useHistory, Route } from 'react-router-dom';
import { history, useParams } from ' umi';

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
        <Form.Item label="host" name="host" rules={[{ required: true, message: '域名缺少' }]}>
          <Input name="host" defaultValue="" />
        </Form.Item>
        <Form.Item label="pucode" name="pucode" rules={[{ required: true, message: 'pucode缺少' }]}>
          <Input name="pucode" defaultValue="" />
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
        <Form.List name="data">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ marginBottom: 8 }} align="baseline">
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
                      options={options}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'xpath']}
                    label="Xpath"
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder="Last Name" style={{ width: 300 }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'filter']}
                    rules={[{ required: true, message: 'Missing last name' }]}
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
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加列表页
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default App;
