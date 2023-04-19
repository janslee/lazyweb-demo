import React from 'react'
import {
  FormItem,
  Input,
  Editable,
  Select,
  DatePicker,
  ArrayItems,
  FormButtonGroup,
  Submit,
  Space,
} from '@formily/antd'
import { createForm } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    DatePicker,
    Editable,
    Space,
    Input,
    Select,
    ArrayItems,
  },
})

const form = createForm()

export default () => {
  return (
    <FormProvider form={form}>
      <SchemaField>
       
        <SchemaField.Array
          name="array"
          title="对象数组"
          x-decorator="FormItem"
          x-component="ArrayItems"
        >
          <SchemaField.Object>
            <SchemaField.Void x-component="Space">
              <SchemaField.Void
                x-decorator="FormItem"
                x-component="ArrayItems.SortHandle"
              />
              <SchemaField.String
                x-decorator="FormItem"
                required
                title="日期"
                name="date"
                x-component="DatePicker.RangePicker"
                x-component-props={{
                  style: {
                    width: 160,
                  },
                }}
              />
              <SchemaField.String
                x-decorator="FormItem"
                required
                title="输入框"
                name="input"
                x-component="Input"
              />
              <SchemaField.String
                x-decorator="FormItem"
                required
                title="选择框"
                name="select"
                enum={[
                  { label: '选项1', value: 1 },
                  { label: '选项2', value: 2 },
                ]}
                x-component="Select"
                x-component-props={{
                  style: {
                    width: 160,
                  },
                }}
              />
        
              <SchemaField.Void
                x-decorator="FormItem"
                x-component="ArrayItems.Remove"
              />
              <SchemaField.Void
                x-decorator="FormItem"
                x-component="ArrayItems.Copy"
              />
            </SchemaField.Void>
          </SchemaField.Object>
          <SchemaField.Void
            x-component="ArrayItems.Addition"
            title="添加条目"
          />
        </SchemaField.Array>
       
      </SchemaField>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}