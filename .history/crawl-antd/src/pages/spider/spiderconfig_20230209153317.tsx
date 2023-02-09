import React, { useEffect, useState } from 'react';

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

import { Layout, Menu, theme, Button, Tree } from 'antd';
const { DirectoryTree } = Tree;
const { Header, Sider, Content } = Layout;
import React, { useRef, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Upload,
  Radio,
  Tabs,
  Checkbox,
  SelectProps,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory, Route } from 'react-router-dom';
import { history, useParams } from 'umi';
import type { TabsProps } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const App: React.FC = () => {
  const myCodeMirror = '';
  const history = useHistory();
  const formRef = useRef<any>();
  const [form] = Form.useForm();
  const [isData, Data] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const options: SelectProps['options'] = [
    { value: 0, label: '标题' },
    { value: 1, label: '时间' },
    { value: 2, label: '内容' },
    { value: 3, label: '链接' },
  ];
  const [value, setValue] = useState(1);

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
  const [isShowModalOpen, setShowModalOpen] = useState(false);

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
        setShowModalOpen(false);
        // 表单清空
        setFileList([]);
        formRef.current.resetFields();
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
          <Button onClick={() => ModerFunc()}>上传</Button>
          <div>
            <Button onClick={runFunction} type="primary">
              运行
            </Button>
            <div>
              <p>运行结果</p>
            </div>
            <div>{submitResult}</div>
            <Layout>
              <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                  console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                  console.log(collapsed, type);
                }}
              >
                <DirectoryTree
                  multiple
                  defaultExpandAll
                  onSelect={onSelect}
                  onExpand={onExpand}
                  treeData={treeData}
                />
              </Sider>
              <Layout>
                <Content>
                  <textarea id="editor"></textarea>
                </Content>
              </Layout>
            </Layout>
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: `定时任务`,
      children: `Content of Tab Pane 3`,
    },
  ];

  const [submitResult, setSubmitResult] = useState('');
  const treeData = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        {
          title: (
            <button onClick={runFunction} type="primary">
              1
            </button>
          ),
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];
  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };
  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };
  // 初始化编辑器
  useEffect(() => {
    const textArea = document.getElementById('editor');
    myCodeMirror = CodeMirror.fromTextArea(textArea, {
      theme: 'yonce', //主题
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
    myCodeMirror.setOption('value', 'print("hello word2")'); //初始值
    myCodeMirror.on('keypress', function () {
      //代码补全功能
      myCodeMirror.showHint();
    });
    myCodeMirror.setSize('40vw', '50vh'); //编辑框大小(宽，高)
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

  return (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

      <Modal
        title="文件上传"
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
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginLeft: 1 }}
          >
            {uploading ? 'Uploading' : '确定'}
          </Button>,
        ]}
      >
        <Form
          name="dynamic_form_nest_item"
          form={form}
          ref={formRef}
          autoComplete="off"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
        >
          <Upload {...props} directory>
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>
        </Form>
      </Modal>
    </>
  );
};

export default App;
