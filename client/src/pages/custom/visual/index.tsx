import React, { useEffect, useMemo, useState } from 'react'
import { createForm, onFieldInit } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {common} from "../../../lib/common"

import {
  Form,
  FormItem,
  
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,

  Password,
  PreviewText,
  Radio,
  Reset,
  
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,

  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,

  ArrayTable,

  ArrayCards,
  FormButtonGroup,
  
} from '@formily/antd'



import CustomInput from '../../../components/CustomInput'
import CImage from '../../../components/CImage'
import CButton from '../../../components/CButton'
import  CTable from '../../../components/CTable'
import  FormDialog from '../../../components/FormDialog'
import  Dialog from '../../../components/Dialog'
import  IconSelect from '../../../components/IconSelect'
import  Select  from   '../../../components/CSelect'
import  Switch  from   '../../../components/CSwitch'
import  Editor  from   '../../../components/Editor'
import  CList  from   '../../../components/CList'
import  Custom  from   '../../../components/Custom'
import  Text  from   '../../../components/Text'
import  RichText  from   '../../../components/RichText'
import  DatePicker  from   '../../../components/DatePicker'
import  Upload  from   '../../../components/Upload'
import  Divider  from   '../../../components/Divider'
import  Avatar  from   '../../../components/Avatar'
import  Badge  from   '../../../components/Badge'
import  Carousel  from   '../../../components/Carousel'
import  Descriptions  from   '../../../components/Descriptions'
import  List  from   '../../../components/List'
import  Timeline  from   '../../../components/Timeline'
import  Statistic  from   '../../../components/Statistic'
import  Progress  from   '../../../components/Progress'
import  ChartLine  from   '../../../components/ChartLine'
import  ChartColumn  from   '../../../components/ChartColumn'
import  ChartPie  from   '../../../components/ChartPie'
import  ChartLiquid  from   '../../../components/ChartLiquid'
import  ChartBar  from   '../../../components/ChartBar'
import  ChartRose  from   '../../../components/ChartRose'
import  ChartRadar  from   '../../../components/ChartRadar'
import  ChartWaterfall  from   '../../../components/ChartWaterfall'
import  ChartAreaMap  from   '../../../components/ChartAreaMap'
import  ChartWordCloud  from   '../../../components/ChartWordCloud'
import  TinyArea  from   '../../../components/TinyArea'
import  TinyColumn from   '../../../components/TinyColumn'
import  RingProgress  from   '../../../components/RingProgress'
import  Gauge from '../../../components/Gauge'


import { Card, Slider, Rate,Modal,message,Steps } from 'antd'


import { eventBus } from '../../../lib/Provider'


let AddListen=(hadlename:string,fun:any)=>{
  eventBus.addListener(hadlename,fun)
}

let RemoveListen=(hadlename:string,fun:any)=>{
  eventBus.removeListener(hadlename,fun)
}


let SendEmit=(hadlename:string,msg:any)=>{
  eventBus.emit(hadlename, msg);
}

/*
const ArrayTable: React.FC = (props) => {

    return (
     
     <ArrayTable2  {...props}/>
    
    );
  };
  */



const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
    CustomInput,
    CButton,
    CImage,
    CTable,
    FormDialog,
    Modal,
    Dialog,
    IconSelect,
    Editor,
    CList,
    Custom,
    RichText,
    Divider,
    Steps,
    Avatar,
    Badge,
    Carousel,
    Descriptions,
    List,
    Timeline,
    Statistic,
    Progress,
    ChartLine,
    ChartColumn,
    ChartPie,
    ChartLiquid,
    ChartBar,
    ChartRose,
    ChartRadar,
    ChartWaterfall,
    ChartAreaMap,
    ChartWordCloud,
    TinyArea,
    TinyColumn,
    RingProgress,
    Gauge
  },

scope: {
$AddListen:AddListen,
$SendEmit:SendEmit,
$RemoveListen:RemoveListen,
$message:message,
React:React
}
})



 const PreviewWidgetPage: React.FC<any> =   (props:any) => {
  const [fschema, setFschema] = useState<any>(null)
  const [fprops, setFprops] = useState<any>(null)
  
  const form = useMemo(() => createForm(

{
  effects() {

    onFieldInit('*', (field2:any,form2) => {
   
      field2.componentProps.$name=field2?.path?.entire
    // field2.componentProps.$self=field2  //不能注入自身，否则会导致死循环
     // field2.componentProps.$form=form2
      field2.componentProps.$AddListen=AddListen
      field2.componentProps.$SendEmit=SendEmit
      field2.componentProps.$RemoveListen=RemoveListen
      
      
    })
  },
}

  ), [])

  const { match } = props;
//console.log("match",match)
  const page_id = match?.params?.page_id != '' ?  match?.params?.page_id:"1";
  const menu_id = match?.params?.menu_id !=null && match?.params?.menu_id !="" ?  match?.params?.menu_id:"";

  let params = new URLSearchParams()
  params.append('page_id', page_id)
  params.append('is_show', "1")
  params.append('menu_id', menu_id)
  let json:any=""
  //异步函数再包装一层



  const syncCall = async()=>{
   
  json =await common.post("/api/PageData?page_id="+page_id,params)

  try {
  
    json=eval('(' + json["data"]["json"] + ')');

     const { form: formProps, schema } = json
     setFprops(formProps)
     setFschema(schema)
//console.log("form",form)
//console.log("schema",schema)
  //form.setValues({"aa":"有数据"},'merge')

//初始化api开始
//form.setInitialValues({"ghj":"牛叉"},'merge')
let initApi= formProps?.initApi
//console.log("fprops",fprops)
//console.log("fschema",fschema)

if(initApi!=null && initApi!="")
{
fetch(initApi,{

  method: 'post',
  body: common.jsonToUrlParam({}),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then((res) => res.json())
.then((results) => {
//console.log("初始化结果",results);
if(results!=null && results.data!=null)
form.setInitialValues(results.data,'merge')

});

}



  } catch {
console.log("设计器远程加载代码失败")


  }
}
  

   useEffect(() => {
    syncCall()
  }, [page_id])

//初始化api结束
function submit(values:any)
  {
   let str= fprops?.onAutoSubmit
   if(str!=null && str!="")
   {
   str=str.replace("{{","")
   str=str.replace("}}","")
  
let result = eval(str);
return result(values)
}

//保存api开始
let api= fprops?.saveApi
if(api!=null && api!="")
{
fetch(api,{

  method: 'post',
  body: common.jsonToUrlParam(values),
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then((res) => res.json())
.then((results) => {
//console.log("保存结果",results);
if(results.code==0)
{
  message.success("保存成功")
}
else
{
  message.error("保存失败")
}

});

}
//保存api结束
}

function ShowSubmit(formProps:any)
{
  if((formProps?.onAutoSubmit!=null && formProps?.onAutoSubmit!="") || (formProps?.saveApi!=null && formProps?.saveApi!=""))
  {
    return  (<Submit   block size="middle">
    保存
  </Submit>)
  }
  else
  {
    return <></>
  }
}
//console.log("fschema2",fschema)
  return (
    <div style ={{border:'0px dashed #ccc',backgroundColor:"#fff", margin:'0px', padding:'10px', boxShadow:'0 0 10px #ccc'}}>
    <Form {...fprops} form={form}
  onAutoSubmit={submit}
    >
      <SchemaField schema={fschema} />

 
      <FormButtonGroup.FormItem>
           {ShowSubmit(fprops)}
          </FormButtonGroup.FormItem>
    </Form>
<div id="cus"></div>
    </div>
  )
}

export default  PreviewWidgetPage
