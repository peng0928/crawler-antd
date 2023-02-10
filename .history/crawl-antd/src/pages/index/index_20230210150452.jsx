// upload组件使用
import { Button, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
/*定义允许上传的文件后缀*/
const filePostfix =
  "'jpg', 'jpeg', 'png','bmp','svg','gif', 'doc','docx', 'xls', 'xlsx', 'ppt','pptx','pdf'";

export default function OnlineEdit() {
  const [form] = Form.useForm();
  //上传文件列表
  const [fileList, setFileList] = useState([]);
  // 文件上传预处理事件
  const beforeUploadHandler = (file) => {
    let splitByDot = file.name.split('.');
    //取最后一个“.”后的内容：1.1.jpg
    let postfix = splitByDot[splitByDot.length - 1];
    const check = fileList.length < 10;
    // 控制上传文件类型
    if (!check) {
      message.warning('最多上传十个文件');
    } else {
      if (filePostfix.indexOf(postfix) > -1) {
        fileList.push(file);
      } else {
        message.warning('文件格式不正确: 仅支持图片、word、ppt、excel类型的文件！');
      }
    }
    return false;
  };
  // 删除文件处理事件
  const handleRemove = (file) => {
    let idx = fileList.indexOf(file);
    let arr = [];
    for (let i = 0; i < fileList.length; i++) {
      arr[i] = fileList[i];
    }
    while (idx !== fileList.length - 1) {
      arr[idx] = fileList[idx + 1];
      idx++;
    }
    if (idx == fileList.length - 1) {
      arr.pop();
    }
    setFileList(arr);
    return true;
  };

  const onFinish = (val) => {
    console.log('success');
    console.log(val);
  };
  const onFinishFailed = (errInfo) => {
    console.log(errInfo);
  };
  const upload = () => {
    let params = form.getFieldValue();
    let uploadParams = { ...params };
    uploadFiles(uploadParams);
  };
  const uploadFiles = (params) => {
    let formData = new FormData();
    fileList.forEach((file, index) => {
      // multipartFiles为上传的文件参数名
      formData.append('multipartFiles', file);
    });
    console.log(formData);
  };
  const clear = () => {
    form.resetFields();
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelAlign="right"
        labelWrap={true}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item>
          <div>
            <Upload
              action=""
              accept={filePostfix}
              multiple
              fileList={fileList}
              beforeUpload={beforeUploadHandler}
              onRemove={handleRemove}
              directory
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ marginBottom: '10px' }}>
            <Button type="primary" onClick={upload}>
              提交
            </Button>
            <Button onClick={clear} style={{ marginLeft: '5px' }}>
              重置
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
