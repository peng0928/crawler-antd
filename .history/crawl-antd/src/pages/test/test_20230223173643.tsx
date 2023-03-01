import React from 'react';
import { Button, Input } from 'antd';

export default () => {
  return (
    <>
      <Input.Group compact>
        <Input style={{ width: 'calc(100% - 200px)' }} placeholder="http://example.com" />
        <Button type="primary">开始</Button>
      </Input.Group>
    </>
  );
};
