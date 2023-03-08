import React, { useState } from 'react';
import { history, useParams } from 'umi';

export default () => {
  const params = useParams();
  const nativeHtml = '<h1>Hello Native HTML</h1>';
  console.log(params);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: nativeHtml }} />
    </>
  );
};
