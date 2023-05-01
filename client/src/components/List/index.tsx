

import React, { useEffect, useState } from 'react'
import { List as  ListAntd} from 'antd';

const loadmorelistcss = {
  "min-height": "350px"
}
export const List= (props: any) => {
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([{"img":"https://randomuser.me/api/portraits/women/17.jpg","title":"标题1","content":"内容1"},{"img":"https://randomuser.me/api/portraits/women/12.jpg","title":"标题2","content":"内容2"}]);


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

let actions=[<a key="list-loadmore-edit">编辑</a>, <a key="list-loadmore-more">更多</a>]
actions=[]
//console.log("渲染函数",props?.renderItem)
return (

 <ListAntd
 {...props}
 style={loadmorelistcss}
 loading={initLoading}

 dataSource={data}
 renderItem={
  props?.renderItem && typeof props?.renderItem=="function"?props?.renderItem:()=>{return <span>渲染内容<br/></span>}
 }
 header={props?.header && typeof props?.header=="object"?props?.header:null}
 footer={props?.footer && typeof props?.footer=="object"?props?.footer:null}
/>
 
 )
 }

export default List;