import React, { useEffect, useState } from 'react'
import { Select as FormilySelect } from 'antd'

import { common } from '../../lib/common'
import { connect, mapProps, useField } from '@formily/react';
import { Field } from '@formily/core';
import 'moment/locale/zh-cn'
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN'
moment.locale('zh-cn')
import { DatePicker as FormilyDatePicker } from '@formily/antd'
const dateFormat = 'YYYY-MM-DD'||undefined;

 const DatePicker: React.FC= (props:any) => {
  const field = useField<Field>()
 function changehandle(date:any, dateString:any) {
  //console.log("date",moment(date).unix())
  field.value=moment(date).unix()
   // console.log("xxx",date, dateString);
}
  return (
    
    <FormilyDatePicker {...props} 
  value={ props.value?moment.unix(parseInt(props?.value)):null}
    format={dateFormat} 
    locale={locale}
    onChange={changehandle}
    />
  )
 }
  
export default DatePicker;