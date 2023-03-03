import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useHistory, Link } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const items: MenuProps['items'] = [
    {
      label: 'MySQL配置',
      key: 'settion',
      icon: <MailOutlined />,
    },
    {
      label: 'Mongo配置',
      key: 'settion/mongo',
      icon: <MailOutlined />,
    },
    {
      label: '爬虫设置',
      key: 'settion/spider',
      icon: <MailOutlined />,
    },
  ];
  const [current, setCurrent] = useState('settion');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    history.push(e.key);
  };
  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </>
  );
};
