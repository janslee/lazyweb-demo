import { UploadOutlined } from '@ant-design/icons';
import { Field } from '@formily/core';
import {  useField } from '@formily/react';

import { Button, message, Upload as UploadAntd, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react';


const Upload: React.FC= (props:any) => {
  const field = useField<Field>()
  const [defaultFileList, setDefaultFileList] = useState<UploadFile[]>([

  ]);


  useEffect(() => {
  
    if (props?.value && props?.value!="null" ) {
     let values=props?.value.split("|")
      let defaultFileListNew=[]
      defaultFileListNew=values.map((item:any,index:number)=>{
        if(item)
        {
        const urlObj = new URL(item);
        const pathArr = urlObj.pathname.split("/");
        const filename = pathArr[pathArr.length - 1];
        return {
          uid:index,
          name: filename,
          status: 'done',
          url: item,
        }
      }
      })

      setDefaultFileList(defaultFileListNew)
    }
  }, [props?.value])


  useEffect(() => {
    let urls:any=[]
    defaultFileList.map((item:any)=>{
      let url=""
      if(item?.url)
      url=item.url
      else   if(item?.response && item?.response?.url)
       url=item.response.url
   
      urls.push(url)
    })
   
    field.value=urls.join("|")

  }, [defaultFileList])
 function  changehandle(info:any) {
  //console.log("fileList", info.fileList);
 // console.log("file", info.file);

  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 上传成功`);
    let urls:any=[]
    info.fileList.map((item:any)=>{
      let url=""
      if(item?.url)
      url=item.url
      else   if(item?.response && item?.response?.url)
       url=item.response.url
   
      urls.push(url)
    })
   
    field.value=urls.join("|")
   // console.log("field数据", field)

  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
  setDefaultFileList(info.fileList);
 
  }
  return (
    
    <UploadAntd {...props} 
    showUploadList={true}
   onChange={changehandle}
 fileList={defaultFileList}
    >
    <Button icon={<UploadOutlined />}>点击上传</Button>
    </UploadAntd>
  )
}



export default Upload;