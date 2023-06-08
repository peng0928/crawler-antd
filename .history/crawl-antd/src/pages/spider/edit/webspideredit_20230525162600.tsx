import axios from 'axios';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Radio, Select, Space, Tag } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { history, useParams } from 'umi';
import { MinusCircleOutlined } from '@ant-design/icons';
export default function OnlineEdit() {
  const params = useParams();
  type TableListItem = {};
  const [form] = Form.useForm();
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const options = [
    { value: 0, label: '标题' },
    { value: 1, label: '时间' },
    { value: 2, label: '内容' },
    { value: 3, label: '链接' },
  ];
  const formRef = useRef<any>();
  const [value, setValue] = useState(1);
  const set_list = (data2) => {
    console.log(data2);
    let arr = data2;
    let new_arr = [];
    new_arr = arr.map((item, index) => ({
      title: item[0], //设置字段，在form.list下的form.item中指定的字段值
      xpath: item[1], //设置字段，在form.list下的form.item中指定的字段值
      filter: item[2], //设置字段，在form.list下的form.item中指定的字段值
      fieldKey: index,
      isListField: true,
      key: index,
      name: index,
    }));
    return new_arr;
  };
  const set_clist = (data2) => {
    console.log(data2);
    let arr = data2;
    let new_arr = [];
    new_arr = arr.map((item, index) => ({
      Ctitle: item[0], //设置字段，在form.list下的form.item中指定的字段值
      Cxpath: item[1], //设置字段，在form.list下的form.item中指定的字段值
      Cfilter: item[2], //设置字段，在form.list下的form.item中指定的字段值
      fieldKey: index,
      isListField: true,
      key: index,
      name: index,
    }));
    return new_arr;
  };
  useEffect(() => {
    axios({
      method: 'post',
      url: '/api/spider/edit',
      data: params,
    })
      .then(function (response) {
        const data = response.data.data;
        const CData = data.CData;
        const listing_name = data.listing_name;
        const listing_filter = data.listing_filter;
        const listing_value = data.listing_value;
        const arrlist = [];
        const CDatalist = [];
        listing_name.forEach((item, index) => {
          const lname = listing_name[index];
          var lname_text = '';
          switch (lname) {
            case '0':
              lname_text = '标题';
              break;
            case '1':
              lname_text = '时间';
              break;
            case '2':
              lname_text = '内容';
              break;
            case '3':
              lname_text = '链接';
              break;
          }
          arrlist.push([lname_text, listing_value[index], listing_filter[index]]);
        });
        CData.forEach((item, index) => {
          var Cfilter = item.Cfilter;
          var Ctitle = item.Ctitle[0];
          var Cxpath = item.Cxpath;
          var lname_text = '';
          switch (Ctitle) {
            case 0:
              lname_text = '标题';
              break;
            case 1:
              lname_text = '时间';
              break;
            case 2:
              lname_text = '内容';
              break;
            case 3:
              lname_text = '链接';
              break;
          }
          console.log('item', item, 'index', index, Ctitle, Cxpath, Cfilter);
          CDatalist.push([lname_text, Cxpath, Cfilter]);
        });
        console.log(data, params);
        form.setFieldsValue({
          starturl: data.starturl,
          host: data.host,
          spider: data.spider,
          LData: set_list(arrlist),
          CData: set_clist(CDatalist),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
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
          value={value}
          defaultValue={0}
        >
          <Radio value={0}>GET</Radio>
          <Radio value={1}>POST</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="starturl"
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
        <Input.TextArea name="starturl" placeholder="http://example.com" />
      </Form.Item>
      <Form.Item label="host" name="host" rules={[{ required: true, message: '域名缺少' }]}>
        <Input name="host" placeholder="example.com" />
      </Form.Item>
      <Form.Item label="spider" name="spider" rules={[{ required: true, message: 'spider缺少' }]}>
        <Input name="spider" placeholder="spider" />
      </Form.Item>
      <Form.Item label="data" name="data">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item label="headers" name="headers">
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
                  <Form.Item {...restField} name={[name, 'filter']}>
                    <Input style={{ width: 300 }} addonBefore="过滤器" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add({ filter: 'style|script' })}>
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
                <Button type="dashed" onClick={() => add({ Cfilter: 'style|script' })}>
                  添加内容页
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
      <Form.Item>
        <Button style={{ textAlign: 'center' }} type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}