import React,{ useEffect, useRef, useState }  from 'react';

import Editor from "@monaco-editor/react";
const Page: React.FC = () => {
  
  const editorRef = useRef(null);
  function handleEditorChange(value, event) {
    // here is the current value
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor; 
    console.log("onMount: the editor instance:", editor);
    console.log("onMount: the monaco instance:", monaco)
  }

  function handleEditorWillMount(monaco) {
    console.log("beforeMount: the monaco instance:", monaco);
  }

  function handleEditorValidation(markers) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }
  function showValue() {
    alert(editorRef.current.getValue());
  }
  return  (
  <>
  <button onClick={showValue}>Show value</button>
  <Editor
  height="90vh"
  defaultLanguage="javascript"
  defaultValue="// 注释"
  onChange={handleEditorChange}
  onMount={handleEditorDidMount}
  beforeMount={handleEditorWillMount}
  onValidate={handleEditorValidation}
/>
</>
  )

};
export default Page;
//import '~antd/lib/style/themes/default.less';