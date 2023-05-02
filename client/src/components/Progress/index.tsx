

import React, { useEffect, useState } from 'react'
import { Progress as  ProgressAntd} from 'antd';


export const Progress= (props: any) => {



  //console.log("渲染函数",props?.renderItem)
  return (
  
    <ProgressAntd
    status='active'
    type={props.type?props.type:"circle"}
    strokeLinecap={props.strokeLinecap?props.strokeLinecap:"round"}
    
    strokeColor={{
      '0%': props.fromColor?props.fromColor:'#108ee9',
      '100%': props.toColor?props.toColor:'#87d068',
    }}
    percent={props.percent?props.percent:90}
    
  />
   )
   }

export default Progress;