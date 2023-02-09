import React, { useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button, Tabs, SelectProps } from 'antd';
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
  };

  const items: TabsProps['items'] = [
    {
      key: '基本配置',
      label: `Tab 1`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: '文件管理',
      label: `Tab 2`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ];
  return (
    <>
      <Button onClick={() => history.goBack()}>返回</Button>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};

export default App;
