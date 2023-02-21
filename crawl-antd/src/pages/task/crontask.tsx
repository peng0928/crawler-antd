import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
export default () => {
  const [value, setValue] = useState('* * * * *');
  console.log(value);
  return (
    <>
      <Input value={value} />
      <Cron value={value} setValue={setValue} />
    </>
  );
};
