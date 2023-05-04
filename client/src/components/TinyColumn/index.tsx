

import React, { useEffect, useState } from 'react'
import { TinyColumn  as TinyColumnAntd} from '@ant-design/charts';


export const TinyColumn= (props: any) => {
  const [data, setData] = useState( [274, 337, 81, 497, 666, 219, 269]);

  useEffect(() => {
  if(props.data && typeof props.data === 'object'){
    setData(props.data)
  }
  }, [props.data]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    if(props.api)
    {
let api=props.api;
      let CurrentUrl=location.href;
      if(CurrentUrl.indexOf("3000")>0)
        {
          api="http://127.0.0.1:7000"+api
        }
    fetch(api,{credentials: 'include'})
      .then((response) => response.json())
      .then((rs) => {
        if(rs.data)
        setData(rs.data)}
      )
      .catch((error) => {
        console.log('fetch data failed', error);
      });
    }
  };
  

  const config = {
    height: props.height?props.height:60,
    width: props.width?props.width:null,
    autoFit: props.autoFit?props.autoFit:false,
    data,
    color:  props.color?props.color:'#a8ddb5',

  };
//console.log("渲染函数",props?.renderItem)
return (
<TinyColumnAntd {...config} />
 )
 }

export default TinyColumn;