

import { useEffect, useState } from "react"
import { common } from "../../lib/common"
import { Card as AntdCard, Modal, Button, message } from 'antd'
import { connect, mapProps } from "@formily/react"
import { request } from "umi"
export const Dialog2 = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false)
  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)



  useEffect(() => {

//console.log("弹窗参数",props)
    if (props?.$name!= null && props?.$name!="") {
      // console.log("$AddListen",props["$AddListen"])
      props.$AddListen(props?.$name, (msg:any) => {
        //e.preventDefault()
       
        //e.stopImmediatePropagation();
        //dataparam={}
        let dialogPrefix=props?.dialogPrefix
        if(dialogPrefix==null)
        dialogPrefix="row|"
       
        let row = msg
        openModal()
      
        let initialValues = {}
        //判断是否需要初始化
        if (props?.openFunc != null) {
          let openFunc = eval(props?.openFunc)
          initialValues = openFunc(row)

        }
        else if (props?.dialogInitApi != null && props?.dialogInitApi != "" && msg!=null) {
          let dialogInitApi = props?.dialogInitApi
    

          request<{
            msg: string;
            code: number;
            success: boolean;
            data: any;
          }>(dialogInitApi, {
            method: 'POST',
        data:row
          })

           
          .then((rs:any) => {
             // console.log("自定义弹窗弹窗初始化结果", data);
            let code=rs?.code
            let data=rs?.data
              if (data != null && code==0)
              {
                initialValues =data
                
                let row={}
                for(let i in initialValues)
                {
                  if( i!="pwd" && i.indexOf("salt")<0  && i.indexOf("pwd")<0)
                  row[dialogPrefix+i]=initialValues[i]
                  else
                  row[dialogPrefix+i]=""
                }
               // console.log("参数1",props)
              
                let oldvalues=props?.$form?.values
              
    
                props?.$form.setValues({...oldvalues,...row})
                props?.$form.validate("*")
              }

            });


        }
        else
        {
         
          if(row!=null)
          {
          let data={}
          for(let i in row)
          {
            data[dialogPrefix+i]=row[i]
          }
          
         // console.log("测试",props?.$form)
        if(props?.$form!=null)
        {
          let oldvalues=props?.$form.values
          props?.$form.setValues({...oldvalues,...data})
          props?.$form.validate("*")
        }
          
        }
        }
      }
      )
    }
  }, [])

function confirm()
{
  props?.$form.validate("*")
  let valid=props?.$form.valid
  if(!valid)
  {
    message.error("请检查输入的数据")
    return 
  }
const valuse=props?.$form.values
//console.log("哈哈",valuse)
let dialogPrefix=props?.dialogPrefix
if(dialogPrefix==null)
dialogPrefix="row|"
let row={}
for(let i in valuse)
{
  if(i.indexOf(dialogPrefix)>=0)
  {
    row[i.replace(dialogPrefix,"")]=valuse[i]
  }
}
//console.log("提交的数据",row)



if (props?.dialogSaveApi != null && props?.dialogSaveApi != "") {
  let dialogSaveApi = props?.dialogSaveApi

  fetch(dialogSaveApi, {

    method: 'post',
    body: common.jsonToUrlParam(row),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then((res) => res.json())
    .then((results) => {
     // console.log("弹窗保存结果", results);
      if (results != null && results.code == 0)
     {
   
      ExeConfirm(row)
     message.success(results.msg)
     }
    });


}else if (props?.confirm != null && props?.confirm != ""  ) {
  ExeConfirm(row)
  }
  closeModal()
}


function ExeConfirm(row:any)
{

   //alert(props?.confirm)
   if(typeof(props?.confirm)=="string")
   {
   try {
     let confirm2 = eval(props?.confirm)
     confirm2(row)
   }
   catch (e) {
     //...
     console.log("转换confirm出错",e)
   }
   //dialog.close()
 }
 if(typeof(props?.confirm)=="function")
 {

 try {
   let confirm2 = props?.confirm
 
   confirm2(row)
 }
 catch (e) {
   //...
   console.log("执行confirm出错",e)
 }
 //dialog.close()
}
}


function ExeCode(code:any)
{

  let valid=props?.$form.valid

if(!valid)
{
  message.error("请检查输入的数据")
  return false
}
const valuse=props?.$form.values
console.log("valuse",valuse)
let dialogPrefix=props?.dialogPrefix
if(dialogPrefix==null)
dialogPrefix="row|"
let row={}
for(let i in valuse)
{
  if(i.indexOf(dialogPrefix)>=0)
  {
    row[i.replace(dialogPrefix,"")]=valuse[i]
  }
}


   if(typeof(code)=="string")
   {
   try {
     let confirm2 = eval(code)
  
     confirm2(row)
   }
   catch (e) {
     //...
     console.log("转换code出错",e)
   }
   //dialog.close()
 }
 if(typeof(code)=="function")
 {

 try {

   code(row)
 }
 catch (e) {
   //...
   console.log("执行code出错",e)
 }
 //dialog.close()
}
return
}
function cancel()
{
  if (props?.cancelFun != null && props?.cancelFun != ""  ) {
    ExeCode(props?.cancelFun)
    }
  closeModal()
}
function thirdFun()
{
  if (props?.thirdFun != null && props?.thirdFun != ""  ) {
    ExeCode(props?.thirdFun)
    }

}


let cancelText="取消"
if(props?.cancelText!=null && props?.cancelText!="")
{
  cancelText=props?.cancelText
}

let okText="确定"
if(props?.okText!=null && props?.okText!="")
{
  okText=props?.okText
}
let thirdText="按钮"
if(props?.thirdText!=null && props?.thirdText!="")
{
  thirdText=props?.thirdText
}
const ThirdBtnDisplay=props?.showThirdBtn!=null && props?.showThirdBtn==true?"inline-block":"none"


  return (
    <>
    
    <Modal
      bodyStyle={{ padding: 10 }}
      centered={true}
      mask={true}
      {...props}
 
     
      
       // transitionName=""
      //  maskTransitionName=""
      open={modalVisible}

        destroyOnClose={true}
        onOk={() => {
          confirm()
         
        }}

        onCancel={() => {
         
          cancel()
         }}

         footer={[
          <Button  style={{display:ThirdBtnDisplay}} key='continue' onClick={thirdFun}>{thirdText}</Button>,
             <Button key='cancel' onClick={cancel} >{cancelText}</Button>,
             <Button key='confirm' type="primary" onClick={confirm}>{okText}</Button>
           ]}
      >
        {props.children}
      </Modal>

      
    </>
  )
}



export const Dialog = connect(
  Dialog2,
    mapProps((props: any, field:any) => {
      
      //window.console.log('CustomIput-props', props);
    //  window.console.log('CustomIput-field', field);
     // const { withCount } = props;
  // console.log("field",field)
    // console.log("select field",field)
      return {
        ...props,
        value: field?.value,
        $self: field,
        $form: field?.form,
      //  loading: loading,
      //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
      };
    })
  );

export default Dialog;
