import React, { useState } from 'react';
import { Modal, Button, Upload } from 'antd';
import JSZip from 'jszip';

export default () => {
  const [visible, setVisible] = useState(false);
  const handleUpload = async (options) => {
    const { file } = options;
    const zip = new JSZip();
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const data = reader.result;
      const array = new Uint8Array(data);
      zip.file(file.name, array);
      const content = await zip.generateAsync({ type: 'blob' });
      const formData = new FormData();
      formData.append('file', content, `${file.name}.zip`);
      // 这里可以使用 axios 或其他方式将 formData 发送到服务器
      console.log(formData);
      setVisible(false);
    };
  };
  const showModal = () => {
    setVisible(true);
  };
  return <>1</>;
};
