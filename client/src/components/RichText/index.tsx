import React, { useEffect, useRef, useState } from 'react'

import { connect, mapProps, mapReadPretty, observer, useField } from '@formily/react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Field } from '@formily/core'

import type { SlateElement } from "@wangeditor/editor";

export type ImageElement = SlateElement & {
  src: string;
  alt: string;
  url: string;
  href: string;
};
export type InsertFnType = (url: string, alt: string, href: string) => void;



const RichTextCom: React.FC = (props: any) => {

  // 设置编辑器初始内容

  const [value, setValue] = useState(props?.value);
  const field = useField<Field>()
  const [editor, setEditor] = useState<IDomEditor | null>(null) 


  useEffect(() => {
field.value=value
//setValue(value)
}, [value])




const toolbarConfig: Partial<IToolbarConfig> = { }  


// 自定义校验图片
function customCheckImageFn(src: string, alt: string, url: string): boolean | undefined | string {
  // TS 语法
  if (!src) {
    return;
  }
  if (src.indexOf("http") !== 0) {
    return "图片网址必须以 http/https 开头";
  }
  return true;

  // 返回值有三种选择：
  // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
  // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
  // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
}
// 转换图片链接
function customParseImageSrc(src: string): string {
  // TS 语法
  if (src.indexOf("http") !== 0) {
    return `http://oss-cn-shanghai.aliyuncs.com/${src}`;
  }
  return src;

}

const editorConfig: Partial<IEditorConfig> = {    // TS 语法
     
      placeholder: '请输入内容...',
      autoFocus: false,
      // 粘贴
      // customPaste: (editor: IDomEditor, event: ClipboardEvent): boolean => {
      //   //const html = event.clipboardData?.getData("text/html"); // 获取粘贴的 html
      //   const text = event.clipboardData?.getData("text/plain"); // 获取粘贴的纯文本
      //   // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）
      //   editor.insertText(text ? text : "");
      //   event.preventDefault();
      //   return false;
      // },
   
      //插图
      MENU_CONF: {
        // 不一定要使用，插图配置
        insertImage: {
          onInsertedImage(imageNode: ImageElement | null) {
            // TS 语法
            if (imageNode == null) {
              return;
            }
   
            const { src, alt, url, href } = imageNode;
            console.log("inserted image", src, "|", alt, "|", url, "|", href);
          },
          checkImage: customCheckImageFn, // 也支持 async 函数
          parseImageSrc: customParseImageSrc // 也支持 async 函数
        },
       //上传图片
        uploadImage: {
          server: "/api/UploadFile",
          // form-data fieldName ，默认值 'wangeditor-uploaded-image'
           fieldName: "file",
   
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 4 * 1024 * 1024, // 4M
   
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,
   
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          // allowedFileTypes: [],
   
          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          // meta: {
          //   token: uchoiceToken.get(),
          // // otherKey: "yyy"
          // // file: ""
          // },
   
          // 将 meta 拼接到 url 参数中，默认 false
          // metaWithUrl: false,
   
          // 自定义增加 http  header
          // headers: {
          //   // Accept: "image/x-json",
          //   // otherKey: "xxx",
          //   Authorization: "Bearer " + uchoiceToken.get(),
          //   // "Content-Type": "multipart/form-data"
          //   Content: {
          //     Type: "application/json"
          //   }
          // },
   
          // 跨域是否传递 cookie ，默认为 false
           withCredentials: true,
   
          // 超时时间，默认为 10 秒
          timeout: 5 * 1000, // 5 秒
          
          //最大字数
          // maxLength: 500
   
          // 上传之前触发
          // onBeforeUpload(file: File) {
          //   // file 选中的文件，格式如 { key: file }
          //   return file;
   
          //   // 可以 return
          //   // 1. return file 或者 new 一个 file ，接下来将上传
          //   // 2. return false ，不上传这个 file
          // },
   
          // 上传进度的回调函数
          onProgress(progress: number) {
            // progress 是 0-100 的数字
            console.log("progress", progress);
          },
   
          // 单个文件上传成功之后
          onSuccess(file: File, res: any) {
            console.log(`${file.name} 上传成功`, res);
          },
   
          // 单个文件上传失败
          onFailed(file: File, res: any) {
            console.log("qz-失败url", "");
   
            console.log(`${file.name} 上传失败`, res);
          },
   
          // 上传错误，或者触发 timeout 超时
          onError(file: File, err: any, res: any) {
            console.log("qz-失败", res);
   
            console.log(`${file.name} 上传出错`, err, res);
          },
          // 自定义插入图片
          // customInsert(res: any, insertFn: InsertFnType) { // TS 语法
          //   // res 即服务端的返回结果
          //   // const result = res;
          //   // console.log("qz", result);
          //   const { url, alt, href } = res;
          //   // 从 res 中找到 url alt href ，然后插图图片
          //   insertFn(url, alt, href);
          // },
   
          // customUpload(file: File, insertFn: InsertFnType) { // TS 语法
          //   // file 即选中的文件
          //   // 自己实现上传，并得到图片 url alt href
          //   // 最后插入图片
          //   console.log("qz---file", file);
   
          //   // const { url, alt, href } = file;
          //   // insertFn(url, alt, href);
          // }
   
          // 用户自定义上传图片
          customUpload(file: any, insertFn: any) {
            console.log("qz-上传地址", "");
   
            const data = new FormData();
            data.append("file", file); // file 即选中的文件 主要就是这个传的参数--查看接口需要带什么参数
            const config = {
              method: "post",
              url: `/api/UploadFile`, //上传图片地址 建议使用模板字符串拼接
              // headers: {
              //   "Content-Type": "multipart/form-data",
              //   Authorization: "Bearer " + uliveToken.get()
              // },//
              data: data
            };
   
            let host=""
            let saveUrl=location.href;
        if(saveUrl.indexOf("3000")>0)
        {
        host="http://127.0.0.1:7000"
        }
        
            fetch(host+'/api/UploadFile', {// 七牛云上传图片域名地址
              method: 'POST',
              body: data,
            //  headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => res.json())
            .then((rs) => {
           
                console.log("qz-用户自定义上传图片", rs);
                // const url = "https:// /" + res.data.data.path; //拼接成可浏览的图片地址
                insertFn(rs.data); //插入图片
              })
              .catch(function (error: any) {
                console.log(error);
              });
          }
        }
      }
  

  }


  

  useEffect(() => {
    return () => {
        if (editor == null) return
        editor.destroy()
        setEditor(null)
    }
}, [editor])






return (
  <>
  <div style={{ border: '1px solid #ccc', zIndex: 100}}>
      <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
          defaultConfig={editorConfig}
          value={props.value}
          onCreated={setEditor}
          onChange={editor => setValue(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}

         
      />
  </div>

</>

     
)

};




  

 const RichText = connect(
  RichTextCom,
    mapProps((props: any, field:any) => {
      
      //window.console.log('CustomIput-props', props);
    //  window.console.log('CustomIput-field', field);
     // const { withCount } = props;
  // console.log("field",field)
    // console.log("select field",field)
      return {
        ...props,
        value: field?.value,

      //  loading: loading,
      //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
      };
    })
  );
  

  
  
export default RichText;