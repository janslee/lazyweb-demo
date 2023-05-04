

import React, { useEffect, useState } from 'react'
import { RingProgress  as RingProgressAntd} from '@ant-design/charts';


export const RingProgress= (props: any) => {
  const [percent, setPercent] = useState(0.7);

  useEffect(() => {
  if(props.value){
    setPercent(props.value)
  }
  }, [props.value]);

  useEffect(() => {
    if(props.percent){
      setPercent(props.percent)
    }
    }, [props.percent]);
  


  const config = {
    height: props.height?props.height:100,
    width: props.width?props.width:100,
    autoFit: props.autoFit?props.autoFit:false,
    percent: percent,
    color: [ props.colorF?props.colorF:'#F4664A', props.colorB?props.colorB:'#E8EDF3'],
    innerRadius:  props.innerRadius?props.innerRadius:0.7,
    radius: 0.98,
    statistic: {
      title: {
        style: {
          color: '#363636',
          fontSize: '12px',
          lineHeight: '14px',
        },
        formatter: () => props.title?props.title:'进度',
      },
    },
  };
//console.log("渲染函数",props?.renderItem)
return (


  <RingProgressAntd {...config} />
 )
 }

export default RingProgress;