

import React, { useEffect, useState } from 'react'
import { Liquid  as LiquidAntd} from '@ant-design/charts';


export const ChartLiquid= (props: any) => {
  const [percent, setPercent] = useState(0.25);
  useEffect(() => {
    if(props.value!=null){
      setPercent(props.value)
    }
    }, [props.value]);
  
    useEffect(() => {
      if(props.percent!=null){
        setPercent(props.percent)
      }
      }, [props.percent]);
  
  const config = {
    style: props.height!=null ?{"height":props.height}:{"height":"121px"},
    percent:percent,
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