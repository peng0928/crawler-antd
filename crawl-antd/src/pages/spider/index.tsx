import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { GetSpider } from '../../services/ant-design-pro/api'
import { useEffect, useRef, useState } from 'react';

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
  useEffect(() => {
    let a = setInterval(async () => {
      actionRef.current?.reload()
    }, 5000)

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
        sessionStorage.setItem('currentPage','params.current')

        let res = await GetSpider({
          page: params.current as number,
          size: params.pageSize as number,
          pucode: params.hasOwnProperty('pucode') ? params.pucode : -1
        })
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
        pageSize: 10,
        defaultCurrent: sessionStorage.getItem('currentPage')==null?sessionStorage.getItem('currentPage'):1
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