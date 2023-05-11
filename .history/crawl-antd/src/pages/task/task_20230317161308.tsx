import { Collapse } from 'antd';

export default () => {
  const logs = [
    {
      title: '2021-10-01',
      content: '这是 2021 年 10 月 1 日的日志信息。',
    },
    {
      title: '2021-10-02',
      content: '这是 2021 年 10 月 2 日的日志信息。',
    },
    {
      title: '2021-10-03',
      content: '这是 2021 年 10 月 3 日的日志信息。',
    },
  ];

  return (
    <Collapse>
      {logs.map((log, index) => (
        <Collapse.Panel header={log.title} key={index}>
          {log.content}
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};
