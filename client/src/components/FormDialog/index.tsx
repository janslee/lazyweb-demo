import React, { useEffect, useState } from 'react'
import { FormDialog as FormilFormDialog, FormItem, FormLayout, Input } from '@formily/antd'

import { createSchemaField } from '@formily/react'
import { Button } from 'antd'
import { common } from "../../lib/common"
import { observable, autorun, batch, action } from '@formily/reactive'
import { Card as AntdCard } from 'antd'
import {EventEmitter} from 'events';
//纯粹的自定义
export const FormDialog: React.FC = (props: any) => {

  let width = 800
  if (props?.width != null && props?.width != "") {
    width = parseInt(props?.width)
  }

  const [showDiaplog, setShowDiaplog] = useState(false);
  let dataparam: any = observable({})

  let dparams: any = {}
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
    },
  })

  let schema = {
    type: 'object',
    properties: {
      aaa: {
        type: 'string2',
        title: '自定义的数控cqa',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      bbb: {
        type: 'string',
        title: '输入框2',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },

    },
  }
  if (props?.schema != null) {
    schema = props?.schema
  }
  function ShowSubmit(formProps: any) {

    if (formProps?.html != null) {

      return (formProps?.html)
    }
    else {
      return <div>{formProps.children}</div>
    }
  }
  //let b = <div>{props.children}</div>

  //if (props?.text == null)
  //  props.text = "弹窗"


  //const Context = createContext("")
  let cqa = (form:any) => {
    // console.log(useContext(Context))
    // console.log("我的",props)

    return (


      <FormLayout labelCol={6} wrapperCol={10} wrapperWidth={width - 200}  >
        <SchemaField schema={schema} />

        <FormilFormDialog.Footer>
          <span
            onClick={() => {

            }}
            style={{ marginLeft: 4 }}
          >

          </span>

        </FormilFormDialog.Footer>
      </FormLayout>


    )
  }


  function OpenDialog() {

    let row: any = document.getElementById(props?.ButtonID)?.getAttribute("dialogParam")

    if (row != null)
      row = JSON.parse(row)



    let dialog = FormilFormDialog({ "title": '弹窗表单', "width":width }, cqa)

    dialog
      .forOpen((payload, next) => {
        setTimeout(() => {
          let initialValues = {}
          //判断是否需要初始化
          if (props?.openFunc != null) {
            let openFunc = eval(props?.openFunc)
            initialValues = openFunc(row)

            next({
              initialValues: initialValues
            })
          }
          else if (props?.dialogInitApi != null && props?.dialogInitApi != "") {
            let dialogInitApi = props?.dialogInitApi
            fetch(dialogInitApi, {

              method: 'post',
              body: common.jsonToUrlParam(row),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
              .then((res) => res.json())
              .then(({ results }) => {
                console.log("弹窗初始化结果", results);
                if (results != null && results.data != null)
                  initialValues = results.data
                next({
                  initialValues: initialValues
                })
              });


          }
          else {

            next({
              initialValues: row
            })
          }


        }, 1)
      })
      .forConfirm((payload, next) => {

        /*
        setTimeout(() => {
          console.log(payload)
          next(payload)
        }, 1000)
      */
        if (props?.confirm != null && props?.confirm != "") {
          //alert(props?.confirm)
          try {
            let confirm = eval(props?.confirm)
            confirm(payload)
          }
          catch (e) {
            //...
            console.log("转换confirm出错")
          }
          //dialog.close()
          setShowDiaplog(false)
          next(payload)
        }
        else if (props?.dialogSaveApi != null && props?.dialogSaveApi != "") {
          let dialogSaveApi = props?.dialogSaveApi
          fetch(dialogSaveApi, {

            method: 'post',
            body: common.jsonToUrlParam(payload),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
            .then((res) => res.json())
            .then(({ results }) => {
              console.log("弹窗初始化结果", results);
              if (results != null && results.code == 0)
                next(payload)
            });


        }
        next()
      })
      .forCancel((payload, next) => {
        setTimeout(() => {
          console.log(payload)
          next(payload)
          // dialog.close()
          setShowDiaplog(false)
        }, 1)
      })


    dialog.open()
      .then(() => {

      })
}
 

useEffect(()=>{
  if(props["$AddListen"]!=null)
  {
    console.log("$AddListen",props["$AddListen"])
   props["$AddListen"](props?.ButtonID,(msg:any)=>{
//e.preventDefault()

//e.stopImmediatePropagation();
//dataparam={}
let p = msg

const handler = action.bound(() => {


  for (let i in p) {
    dataparam[i] = p[i]

  }

  document.getElementById(props?.ButtonID)?.setAttribute("dialogParam", JSON.stringify(dataparam));
})
handler()
document.getElementById(props?.ButtonID)?.click();
console.log("传递的参数", p)
    })
  }
 
},[])



  document.addEventListener(props?.ButtonID, (e: any) => {
    //e.preventDefault()

    e.stopImmediatePropagation();
    //dataparam={}
    let p = e?.detail

    const handler = action.bound(() => {


      for (let i in p) {
        dataparam[i] = p[i]

      }

      document.getElementById(props?.ButtonID)?.setAttribute("dialogParam", JSON.stringify(dataparam));
    })
    handler()
    document.getElementById(props?.ButtonID)?.click();
    console.log("传递的参数", p)

    //e.stopPropagation();
    //e.stopImmediatePropagation();
  }, false)



  autorun(() => {

    if (dataparam != null && common.len(dataparam) > 0) {
      console.log("setdataParam", dataparam)

    }
  })


  return (
    <AntdCard
      {...props}>

      <Button id={props?.ButtonID}
        onClick={(e) => {

          OpenDialog()
        }}
      >
        {props?.name}点击打开弹窗{dparams["cqa"]}
      </Button>

    </AntdCard>
  );
};
export default FormDialog;
