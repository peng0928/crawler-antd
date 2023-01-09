import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { GetSpider } from '../../services/ant-design-pro/api'
import { useEffect, useRef } from 'react';

type GithubIssueItem = {

};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    search:false
  },
  {
    title: 'pucode',
    dataIndex: 'pucode',
  },
  {
    title: 'value',
    dataIndex: 'value',
    search:false
  }
];

export default () => {
  const actionRef = useRef<ActionType>();

  //@ts-ignore
  useEffect( () => {
    const a = setInterval(async () => {
        actionRef.current?.reload(true)
      }, 3000)
      return () => {
              clearInterval(a)
          }
  }, [])


  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        // console.log(sort, filter);
        console.log(params);
        let res = await GetSpider({page:params.page,size:params.pageSize,pucode:params.hasOwnProperty('pucode')?params.pucode:-1})
        console.log(res);
        return {
          data: res.results,
          success: true,
          total:res.count
        }
      }}
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
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      pagination={{
          showQuickJumper: true,
          pageSize:10
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>
      ]}
    />
  );
};