import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

import { Layout, Menu, theme, Button } from 'antd';
const { Header, Sider, Content } = Layout;

let myCodeMirror;
export default function OnlineEdit() {
  const [submitResult, setSubmitResult] = useState('');

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
    axios({
      method: 'post',
      url: 'http://192.168.2.139:7000/edit_api/edit',
      params: {
        code: myCodeMirror.getValue(),
      },
      // timeout: 5000,
    })
      .then(function (res) {
        console.log('3:', res);
        if (res.data.code === 0) {
          setSubmitResult(res.data.data.output);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div>
      <Button onClick={runFunction} type="primary">
        运行
      </Button>
      <textarea id="editor"></textarea>
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
          <div className="logo" />
        </Sider>
        <Layout>
          <Header style={{ padding: 0 }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, minHeight: 360 }}>content</div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
