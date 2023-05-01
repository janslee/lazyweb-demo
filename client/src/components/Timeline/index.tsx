

import React, { useEffect, useState } from 'react'
import { Timeline as  TimelineAntd} from 'antd';


const Timeline= (props: any) => {
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([{"label":"2020-1-1","content":"内容1"},{"label":"标题2","content":"内容2"}]);


  useEffect(() => {
    if(props?.api)
    {
      fetch(props.api)
      .then(res => res.json())
      .then(res => {
        setInitLoading(false);
        if(res && res.data)
        setData(res.data);
      
      });
    }

  }, [props?.api]);

useEffect(() => {
  if(props?.data  && typeof(props?.data)=="object"){
    setData(props?.data);
  }

}, [props?.data])


//console.log("渲染函数",props?.renderItem)
return (


   <TimelineAntd mode="left" >
    {data.map((item,index)=>{
   return <TimelineAntd.Item label={item.label}>{item.content}</TimelineAntd.Item>
    }
    )}
 </TimelineAntd>
 )
 }


export default Timeline;