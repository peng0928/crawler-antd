import React, { Component } from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

class SearchData extends Component {
  state = {
    file: [],
  };

  componentDidMount() {}

  // beforeUpload 返回 false 后，手动上传文件。
  beforeUpload = () => {
    return false;
  };

  //文件发送请求事件
  getFilesHandle = () => {
    const { file } = this.state;
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('file', file[i]);
    }
    commonConfig.ajaxUploadHttp(
      commonConfig.url + 'dataset/importExcel/_login',
      formData,
      (res) => {
        console.log(res);
      },
      null,
      'POST',
    );
  };

  //获取已经上传文件的列表
  uploadChange = (info) => {
    const { file } = this.state;
    this.setState({ file: [info.file, ...file] });
    return false;
  };

  //点击确定按钮
  uploadConfirm = () => {
    const { file } = this.state;
    if (file.length > 0) {
      this.getFilesHandle(); //调用请求接口
    } else {
      message.info('请上传文件');
    }
  };

  render() {
    const props = {
      multiple: true,
      accept: '.zip,.xls,.xlsx',
      action: null,
      onChange: this.uploadChange,
      beforeUpload: this.beforeUpload,
      showUploadList: false,
    };
    return (
      <div>
        <h3>上传文件</h3>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <button onClick={this.uploadConfirm}>确定</button>
      </div>
    );
  }
}

export default SearchData;
