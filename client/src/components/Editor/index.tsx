
import React, { useEffect, useRef, useState } from 'react'


import { connect, mapProps, mapReadPretty } from '@formily/react'
import EditorReact from "@monaco-editor/react"  ;
//import { PreviewText } from '@formily/antd'
//import * as monaco2 from 'monaco-editor';
import * as monaco2 from 'monaco-editor/esm/vs/editor/editor.api';
const myFuncProvider = {
  provideCompletionItems: (model:any, position:any, context:any, token:any) => {

    // 获取当前行数
  const line = position.lineNumber
   
  // 获取当前列数
  const column = position.column
   
  // 获取当前输入行的所有内容
  const content = model.getLineContent(line)
  let suggestions=[]
  // 通过下标来获取当前光标后一个内容，即为刚输入的内容
 // const sym = content[column - 2]
 let end=column-1
let begin=end-7
 if(begin<0)
 begin=0
 const commonStr = content.substring(begin,end)
 console.log("commonStr",commonStr)
if(commonStr=="common." || commonStr=="common")
{
  suggestions = [
    {
      label: 'exe',
      kind: monaco2.languages.CompletionItemKind.Method,
      insertText:'exe(1,2)',
      detail: '执行事件',
    },
    {
      label: 'add',
      kind: monaco2.languages.CompletionItemKind.Property,
      insertText: 'add=1',
      detail: '添加属性',
    }
   
];
}
else{
     suggestions = [
      {
        label: 'common',
        kind: monaco2.languages.CompletionItemKind.Class,
        insertText: 'common',
        detail: '常用函数静态类',
      },
      {
        label: 'exe',
        kind: monaco2.languages.CompletionItemKind.Method,
        insertText:'exe(1,2)',
        detail: '执行事件',
      },
      {
        label: 'add',
        kind: monaco2.languages.CompletionItemKind.Property,
        insertText: 'add=1',
        detail: '添加属性',
      },
      {
        label: '$SendEmit',
        kind: monaco2.languages.CompletionItemKind.Function,
        insertText: '$SendEmit()',
        detail: '发送事件',
      },
     
  ];
}
    return { suggestions };
  },
  triggerCharacters: ['.']
};

export const Editor3: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(props?.defaultValue);


  let defaultLanguage="javascript"
if(props?.defaultLanguage!=null || props?.defaultLanguage!="")
defaultLanguage=props.defaultLanguage


let width="100%"
if(props?.width!=null || props?.width!="")
width=props.width



let height=300
if(props?.height!=null || props?.height!="")
height=props.height

  const editorRef:any = useRef(null);


  useEffect(() => {
    setValue(props?.defaultValue)
  }, [])
  function handleEditorChange(value:any, event:any) {
    // here is the current value
   // console.log("代码改变:", value);
   setValue(value)
  }

  function handleEditorDidMount(editor:any, monaco:any) {
if(defaultLanguage!=null && defaultLanguage=="javascript")
{
  monaco.languages.registerCompletionItemProvider('javascript', myFuncProvider);
}
  
editorRef.current = editor; 

   // console.log("onMount: the editor instance:", editor);
   // console.log("onMount: the monaco instance:", monaco)
  }

  function handleEditorWillMount(monaco:any) {
   // console.log("beforeMount: the monaco instance:", monaco);
  }

  function handleEditorValidation(markers:any) {
    // model markers
  markers.forEach(marker => console.log('代码验证:', marker.message));
  }
  function showValue() {
    alert(editorRef?.current?.getValue());
  }


  return  (
  <>
  <EditorReact


  
  onChange={handleEditorChange}
  onMount={handleEditorDidMount}
  beforeMount={handleEditorWillMount}
  onValidate={handleEditorValidation}

  options={{
    minimap: {
      enabled: false,
    },
    fontSize: 16,
    cursorStyle: "line",
    wordWrap: "on",
    
  }}
 {...props}
 defaultLanguage={defaultLanguage}
 width={width}
 height={height}
/>
</>
  )
};




  

export const Editor = connect(
  Editor3,
    mapProps((props: any, field:any) => {
      
     // const { withCount } = props;
  //console.log("field",field)
    // console.log("select field",field)
      return {
        ...props,
        defaultValue: field?.initialValue,
      //  value: field?.value,
    
      //  loading: loading,
      //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
      };
    })
  );
  

export default Editor;
