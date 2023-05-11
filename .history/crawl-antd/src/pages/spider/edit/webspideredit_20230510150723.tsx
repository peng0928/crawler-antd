import axios from 'axios';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Radio, Select, Space, Tag } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { history, useParams } from 'umi';
import { MinusCircleOutlined } from '@ant-design/icons';

import React from 'react';
function demo() {
  const FormConfig = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [form] = Form.useForm();
  const data = '2,3'; //数据源

  /**
   * 适配器-可以根据自己的数据类型自行改变数据结构
   * @param {*} data
   * @returns
   */
  const trans_val = (data) => {
    let arr = data.split(',');
    let new_arr = [];
    new_arr = arr.map((item, index) => ({
      val: item, //设置字段，在form.list下的form.item中指定的字段值
      fieldKey: index,
      isListField: true,
      key: index,
      name: index,
    }));
    return new_arr;
  };

  useEffect(() => {
    form.setFieldsValue({
      trigger_conds_group: trans_val(data),
    });
  }, []);
  return (
    <div>
      <Form form={form} name="form_in_modal" hideRequiredMark={true}>
        <Form.List name="trigger_conds_group">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                    alignItems: 'center',
                  }}
                >
                  <Form.Item
                    {...restField}
                    label="触发条件"
                    name={[name, 'val']}
                    fieldKey={[fieldKey, 'val']}
                    rules={[{ required: true, message: '请输入触发条件' }]}
                  >
                    <Input
                      placeholder="请输入触发条件"
                      addonAfter={
                        <MinusCircleOutlined
                          style={{ marginLeft: '8px' }}
                          onClick={() => remove(name)}
                        />
                      }
                    />
                  </Form.Item>
                </div>
              ))}
              <Form.Item
                wrapperCol={{
                  span: FormConfig.wrapperCol.span,
                  offset: FormConfig.labelCol.span,
                }}
              >
                <Button
                  type="dashed"
                  onClick={() => {
                    // add_trigger_h(add);
                    add();
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  添加触发条件
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
}
export default demo;
