import React from 'react';
import { Button, Input } from 'antd';

export default () => {
  return (
    <>
      <Input.Group compact>
        <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="https://ant.design" />
        <Button type="primary">Submit</Button>
      </Input.Group>
    </>
  );
};
