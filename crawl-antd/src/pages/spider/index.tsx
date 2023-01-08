import React from 'react';
import {  Button, Space, Table, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from "react";
import { GetSpider } from '../../services/ant-design-pro/api'

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'id',
    dataIndex: 'id',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'pucode',
    dataIndex: 'pucode',
  },
  {
    title: 'value',
    dataIndex: 'value',
  },
];



const App: React.FC = () => {



    const [data, setdata] = useState()
    
    //@ts-ignore
    useEffect( () => {
        GetSpider().then((res) => {
                setdata(res.results)
            })
        const a =  setInterval(async () => {
                const temp = await GetSpider()
                setdata(temp.results)
            }, 3000)

        return () => {
                clearInterval(a)
            }
    }, [])
    
    return (
        
      <div>

      <Space style={{ marginBottom: 16 }}>
        <Button >添加</Button>
        <Button >Clear filters</Button>
        <Button >Clear filters and sorters</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        />
    </div>
    );
    
};

export default App;