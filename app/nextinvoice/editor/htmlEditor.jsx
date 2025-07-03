'use client';

import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

export default function WysiwygEditor() {
  return (
    <SunEditor
     height='400px'
      setOptions={{
        buttonList: [
          ['undo', 'redo'],
          ['formatBlock'],
          ['bold', 'underline', 'italic', 'strike'],
          ['font', 'fontSize'],
          ['fontColor', 'hiliteColor'],
          ['align', 'horizontalRule', 'list'],
          ['table'],
          ['link', 'image', 'video'],
          ['fullScreen', 'showBlocks', 'codeView'],
        ],
        font: ['Arial', 'Tahoma', 'Comic Sans MS', 'Courier New', 'Georgia'],
        defaultStyle: 'font-family: Arial; font-size: 16px;',
        imageUploadUrl: '/api/upload', // Optional if you want to handle uploads
      }}
    />
  );
}
