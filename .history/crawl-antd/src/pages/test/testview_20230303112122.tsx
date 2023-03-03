import React, { useState, useEffect } from 'react';
import { history, useParams } from 'umi';
import axios from 'axios';

export default () => {
  const params = useParams();
  const [isHtml, setHtml] = useState('');
  useEffect(() => {
    axios({
      method: 'post',
      url: '/api/test/view',
      data: params,
    })
      .then(function (response) {
        setHtml(response.data.results[0].source);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  console.log(params);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: isHtml }} />
    </>
  );
};
