import React,{ useEffect, useRef, useState }  from 'react';

import Editor from "@monaco-editor/react";
import styles from './style.less';
const Page: React.FC = (props:any) => {
  

  const editorRef = useRef(null);
  function handleEditorChange(value, event) {
    // here is the current value
   // console.log("代码改变:", value);
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor; 
   // console.log("onMount: the editor instance:", editor);
   // console.log("onMount: the monaco instance:", monaco)
  }

  function handleEditorWillMount(monaco) {
   // console.log("beforeMount: the monaco instance:", monaco);
  }

  function handleEditorValidation(markers) {
    // model markers
  markers.forEach(marker => console.log('onValidate:', marker.message));
  }
  function showValue() {
    alert(editorRef.current.getValue());
  }


  return  (
  <>
  <button onClick={showValue}>Show value</button>
  <Editor
  height="90vh"
  //defaultLanguage="javascript"
  defaultLanguage="json"
  defaultValue={props?.defaultValue}
  onChange={handleEditorChange}
  onMount={handleEditorDidMount}
  beforeMount={handleEditorWillMount}
  onValidate={handleEditorValidation}
  width="50%"

  options={{
    minimap: {
      enabled: false,
    },
    fontSize: 16,
    cursorStyle: "line",
    wordWrap: "on",
    
  }}
/>
</>
  )

};
export default Page;
//import '~antd/lib/style/themes/default.less';
