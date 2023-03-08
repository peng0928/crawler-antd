import React, { useState } from 'react';
import { history, useParams } from 'umi';

export default () => {
  const params = useParams();
  console.log(params);
  return <></>;
};
