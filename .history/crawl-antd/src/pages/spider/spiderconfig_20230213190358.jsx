import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
//主题
import 'codemirror/theme/yonce.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/solarized.css';
// 折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/indent-fold.js';

// 代码提示
import 'codemirror/addon/hint/show-hint.css'; //
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js'; // 简单提示，按需引入，spl可引入sql-hint.js

import 'codemirror/addon/comment/comment.js';
// 高亮
import 'codemirror/addon/selection/active-line.js';

// python语言
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/django/django.js';

// 括号匹配
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';

import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';

import {
  Layout,
  Col,
  Row,
  Menu,
  Modal,
  theme,
  Button,
  Tree,
  Tabs,
  Form,
  Input,
  message,
  Upload,
} from 'antd';
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState, Component } from 'react';
import axios from 'axios';
import { useHistory, Route } from 'react-router-dom';
import { history, useParams } from 'umi';
const { DirectoryTree } = Tree;
const { Header, Sider, Content } = Layout;

let myCodeMirror;

export default function OnlineEdit() {
  const [submitResult, setSubmitResult] = useState('');
  const [isShowModalOpen, setShowModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const params = useParams();
  const projectname = '111';
  const spidername = '222';
  const cls = '333';
  console.log(params);
  let spiderfile = new FormData();
  let sfile = [];
  const onSelect = (keys, info) => {
    myCodeMirror.setOption('value', '1111'); //初始值
    console.log('Trigger Select', keys, info);
  };
  const onRightClick = (keys, info) => {};
  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };
  // **文件上传
  const ModerFunc = () => {
    setShowModalOpen(true);
  };
  // 初始化编辑器
  useEffect(() => {
    const textArea = document.getElementById('editor');
    myCodeMirror = CodeMirror.fromTextArea(textArea, {
      theme: 'material', //主题
      lineNumbers: true, //显示行号
      firstLineNumber: 1, //行号从几开始，默认1
      lineWrapping: true, //滚动或换行
      scrollbarStyle: null, //隐藏滚动条样式
      tabSize: 2, //tab键缩进,默认4
      smartIndent: true, // 智能缩进
      indentUnit: 2, // 智能缩进单位为2个空格长度
      indentWithTabs: true, // 使用制表符进行智能缩进
      autofocus: true, //自动获取焦点
      // 在行槽中添加行号显示器、折叠器、语法检测器
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      foldGutter: true, // 启用行槽中的代码折叠
      mode: 'python', // 要使用的模式//https://codemirror.net/mode/
      styleActiveLine: true, // 显示选中行的样式
      matchBrackets: true, //括号匹配
      autoCloseBrackets: true, //括号自动补全，()[]{}''""
      hintOptions: {
        completeSingle: false, //代码自动补全功能不默认补充
      },
    });
    myCodeMirror.setOption('value', 'print("hello word")'); //初始值
    myCodeMirror.on('keypress', function () {
      //代码补全功能
      myCodeMirror.showHint();
    });
    myCodeMirror.setSize('100%', '88vh'); //编辑框大小(宽，高)
    axios({
      method: 'post',
      url: '/api/spider/uuid',
      data: { uuid: params['uuid'], type: 'config' },
    }).then(function (response) {
      setProject(response.data[0].project);
      setSpider(response.data[0].spider);
      setCls(response.data[0].value);
      console.log(isProject, setProject);
    });
    axios({
      method: 'post',
      url: '/api/upload',
      data: { uuid: params['uuid'] },
    }).then(function (response) {
      setTreeData(response.data);
      console.log(response);
    });
  }, []);

  // 将值传给后端，后端返回运行结果
  function runFunction() {
    myCodeMirror.setOption('value', '1111'); //初始值
    console.log(myCodeMirror.getValue());
    console.log(myCodeMirror.modes);
    // axios({
    //   method: 'post',
    //   url: 'http://192.168.2.139:7000/edit_api/edit',
    //   params: {
    //     code: myCodeMirror.getValue(),
    //   },
    //   // timeout: 5000,
    // })
    //   .then(function (res) {
    //     console.log('3:', res);
    //     if (res.data.code === 0) {
    //       setSubmitResult(res.data.data.output);
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const [isProject, setProject] = useState();
  const [isSpider, setSpider] = useState();
  const [isCls, setCls] = useState();
  const [isTreeData, setTreeData] = useState([]);
  console.log(isProject);
  if (isProject == 'Scrapy爬虫') {
    const items = [
      {
        key: '1',
        label: `基本配置`,
        children: (
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="项目"
              name="project"
              rules={[
                {
                  required: true,
                  message: 'Please input your project!',
                },
              ]}
            >
              <Input defaultValue={isProject} />
            </Form.Item>

            <Form.Item
              label="爬虫"
              name="spider"
              rules={[
                {
                  required: true,
                  message: 'Please input your spider!',
                },
              ]}
            >
              <Input defaultValue={isSpider} />
            </Form.Item>
            <Form.Item
              label="命令"
              name="cls"
              rules={[
                {
                  required: true,
                  message: 'Please input your cls!',
                },
              ]}
            >
              <Input defaultValue={isCls} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        ),
      },
      {
        key: '2',
        label: `文件管理`,
        children: (
          <div>
            <Button
              type="primary"
              onClick={ModerFunc}
              icon={<UploadOutlined />}
              loading={uploading}
            >
              {uploading ? 'Uploading' : '上传'}
            </Button>
            <Row style={{ paddingTop: 18 }}>
              <Col span={20} push={4}>
                <textarea id="editor"></textarea>
              </Col>
              <Col span={4} pull={20}>
                <Tree
                  multiple
                  onSelect={onSelect}
                  onExpand={onExpand}
                  // treeData={isTreeData}
                  treeData={isTreeData}
                  switcherIcon={<DownOutlined />}
                  onRightClick={onSelect}
                  style={{ minHeight: '88vh' }}
                />
              </Col>
            </Row>
          </div>
        ),
      },
      {
        key: '3',
        label: `任务记录`,
        children: `Content of Tab Pane 3`,
      },
    ];
  } else {
    const items = [
      {
        key: '1',
        label: `基本配置`,
        children: (
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="项目"
              name="project"
              rules={[
                {
                  required: true,
                  message: 'Please input your project!',
                },
              ]}
            >
              <Input defaultValue={isProject} />
            </Form.Item>

            <Form.Item
              label="爬虫"
              name="spider"
              rules={[
                {
                  required: true,
                  message: 'Please input your spider!',
                },
              ]}
            >
              <Input defaultValue={isSpider} />
            </Form.Item>
            <Form.Item
              label="命令"
              name="cls"
              rules={[
                {
                  required: true,
                  message: 'Please input your cls!',
                },
              ]}
            >
              <Input defaultValue={isCls} />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        ),
      },
      {
        key: '2',
        label: `文件管理`,
        children: 1,
      },
      {
        key: '3',
        label: `任务记录`,
        children: `Content of Tab Pane 3`,
      },
    ];
  }

  const handleUpload = () => {
    fileList.forEach((file) => {
      const formData = new FormData();
      console.log(file);
      formData.append(params['uuid'] + '&' + file.webkitRelativePath, file);
      console.log(file, file.webkitRelativePath);
      axios({
        method: 'post',
        url: '/api/upload/file',
        data: formData,
      }).finally(function () {
        setFileList([]);
        setUploading(false);
        setShowModalOpen(false);
      });
      axios({
        method: 'post',
        url: '/api/upload',
        data: { uuid: params['uuid'] },
      }).then(function (response) {
        setTreeData(response.data);
        console.log(response);
      });
    });
  };
  const fileclose = () => {
    setFileList([]);
    setShowModalOpen(false);
  };
  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      fileList.push(file);
      return false;
    },
    fileList,
  };
  return (
    <div>
      <Tabs defaultActiveKey="2" items={items} />
      <Modal
        title="文件上传"
        onCancel={() => {
          fileclose();
        }}
        open={isShowModalOpen}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              fileclose();
            }}
          >
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpload}>
            提交
          </Button>,
        ]}
      >
        <Upload {...props} directory>
          <Button icon={<UploadOutlined />}>上传</Button>
        </Upload>
        <Upload action="/api/upload/file" directory>
          <Button icon={<UploadOutlined />}>Upload Directory</Button>
        </Upload>
      </Modal>
    </div>
  );
}
