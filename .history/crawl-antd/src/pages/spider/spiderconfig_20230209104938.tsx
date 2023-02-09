import React, { useRef, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Upload, Tabs, Checkbox, SelectProps } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory, Route } from 'react-router-dom';
import { history, useParams } from 'umi';
import type { TabsProps } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const options: SelectProps['options'] = [
  { value: 0, label: '标题' },
  { value: 1, label: '时间' },
  { value: 2, label: '内容' },
  { value: 3, label: '链接' },
];

const App: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<any>();
  const [isData, Data] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isShowModalOpen, setShowModalOpen] = useState(false);

  const params = useParams();
  axios({
    method: 'post',
    url: '/api/test',
    data: {
      result: params['uuid'],
    },
  });
  console.log(params);

  // **文件上传
  const ModerFunc = () => {
    setShowModalOpen(true);
  };
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files', file as RcFile);
    });
    setUploading(true);
    // You can use any AJAX library you like
    console.log('正在上传');
    console.log(fileList);
    console.log(formData);
    axios({
      method: 'post',
      url: '/api/test2',
      data: formData,
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        message.success('上传成功');
        console.log(response);
      })
      .catch(function (error) {
        message.success('上传失败');
        console.log(error);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  // ** //

  const onChange = (key: string) => {
    console.log(key);
    return <div>111</div>;
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `基本配置`,
      children: (
        <div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Button onClick={() => history.goBack()}>返回</Button>
            <Form.Item
              label="项目"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="爬虫"
              name="spider"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="执行命令"
              name="cls"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: `文件管理`,
      children: (
        <div>
          <Button onClick={() => history.goBack()}>返回</Button>
          <Button onClick={() => ModerFunc()}>返回</Button>
          {/* <Upload {...props} directory>
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginLeft: 1 }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button> */}
        </div>
      ),
    },
    {
      key: '3',
      label: `定时任务`,
      children: `Content of Tab Pane 3`,
    },
  ];

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <Modal
        title="爬虫添加"
        onCancel={() => {
          setShowModalOpen(false), formRef.current.resetFields();
        }}
        open={isShowModalOpen}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowModalOpen(false), formRef.current.resetFields();
            }}
          >
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={onFinish}>
            提交
          </Button>,
        ]}
      ></Modal>
    </>
  );
};

export default App;
