import React from 'react'
import { createForm } from '@formily/core'
import { FormProvider, FormConsumer, Field } from '@formily/react'
import {  message,notification } from 'antd';
import {
  FormItem,
  FormLayout,
  Input,
  FormButtonGroup,
  Submit,
} from '@formily/antd'

const form = createForm()
function SaveData(data:any)
{
console.log("数据是",data)
//alert("获取数据成功"+JSON.stringify(data))
//notification
message.warning("获取数据成功"+JSON.stringify(data))
notification.success({"message":"获取数据成功"+JSON.stringify(data)})
}
export default () => {
  return (
    <FormProvider form={form}>
      <FormLayout layout="vertical">
        <Field
          name="cqa"
          title="输入框"
          required
          initialValue="初始化"
          decorator={[FormItem]}
          component={[Input]}
        />
      </FormLayout>
      <FormConsumer>
        {() => (
          <div
            style={{
              marginBottom: 20,
              padding: 5,
              border: '1px dashed #666',
            }}
          >
            实时响应：{form.values.cqa}
          </div>
        )}
      </FormConsumer>
      <FormButtonGroup>
        <Submit onSubmit={SaveData}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}