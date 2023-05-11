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
      url: '/api/spider/result',
      data: params,
    })
      .then(function (response) {
        setcolumns(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
   1
  );
}
