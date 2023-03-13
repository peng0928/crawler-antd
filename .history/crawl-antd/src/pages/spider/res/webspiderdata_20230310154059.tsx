import axios from 'axios';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { history, useParams } from 'umi';

export default function OnlineEdit() {
  const params = useParams();
  type TableListItem = {};
  const [iscolumn, setcolumns] = useState([]);
  const ref = useRef<ProFormInstance>();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    axios({
      method: 'post',
      url: '/api/spider/res',
      data: params,
    })
      .then(function (response) {
        const data = response.data;
        setcolumns(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <ProTable<TableListItem>
      columns={iscolumn}
      request={() =>
        Promise.resolve({
          data: [
            {
              key: 1,
              name: `TradeCode ${1}`,
              createdAt: 1602572994055,
            },
          ],
          success: true,
        })
      }
      rowKey="key"
      pagination={{
        showSizeChanger: true,
      }}
      search={false}
      formRef={ref}
      toolBarRender={() => [
        <Button
          key="set"
          onClick={() => {
            if (ref.current) {
              ref.current.setFieldsValue({
                name: 'test-xxx',
              });
            }
          }}
        >
          赋值
        </Button>,
        <Button
          key="submit"
          onClick={() => {
            if (ref.current) {
              ref.current.submit();
            }
          }}
        >
          提交
        </Button>,
      ]}
      options={false}
      dateFormatter="string"
      headerTitle="采集结果"
    />
  );
}
