import axios from 'axios';
import type { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRef, useState, useEffect } from 'react';
import { history, useParams } from 'umi';
import { GetSpiderRes } from '../../../services/ant-design-pro/api';

export default function OnlineEdit() {
  const prparams = useParams();
  type TableListItem = {};
  const actionRef = useRef<ActionType>();
  const [iscolumn, setcolumns] = useState([]);
  const ref = useRef<ProFormInstance>();
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    // axios({
    //   method: 'post',
    //   url: '/api/spider/res',
    //   data: prparams,
    // })
    //   .then(function (response) {
    //     const data = response.data;
    //     setcolumns(data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }, []);

  return (
    <ProTable<TableListItem>
      columns={iscolumn}
      actionRef={actionRef}
      request={async (params = {}, sorter, filter) => {
        try {
          console.log(params, sorter, filter);
          sessionStorage.setItem('currentPage', 'params.current');
          let res = await GetSpiderRes({
            spider: params,
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
      rowKey="key"
      pagination={{
        showSizeChanger: true,
      }}
      search={false}
      formRef={ref}
      toolBarRender={() => [
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
