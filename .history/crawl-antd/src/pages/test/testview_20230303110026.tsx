import React, { useState } from 'react';
import { history, useParams } from 'umi';

export default () => {
  const params = useParams();
  const nativeHtml = '<p>Hello Native HTML</p>';
  console.log(params);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: nativeHtml }} />
    </>
  );
};
