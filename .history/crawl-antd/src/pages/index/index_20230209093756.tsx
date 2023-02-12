import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload，,Tabs  } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';

export default () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
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
  //   fetch('/api/test', {
  //     method: 'POST',
  //     body: formData,
  //     headers: {
  //      'Content-type': 'multipart/form-data'
  //   },
  //   })
  //     .then((res) => res.json())
  //     .then(() => {
  //       setFileList([]);
  //       message.success('upload successfully.');
  //     })
  //     .catch(() => {
  //       message.error('upload failed.');
  //     })
  //     .finally(() => {
  //       setUploading(false);
  //     });
  // };

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

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};