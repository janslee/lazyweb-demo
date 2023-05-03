

import React, { useEffect, useState } from 'react'
import { Liquid  as LiquidAntd} from '@ant-design/charts';


export const ChartLiquid= (props: any) => {
 
  
  const config = {
    style: props.height!=null ?{"height":props.height}:{"height":"121px"},
    percent: props.percent!=null ?props.percent:0.25,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: {
      length: 128,
    },
  };

//console.log("渲染函数",props?.renderItem)
return (


  <LiquidAntd {...config} />
 )
 }


export default ChartLiquid;