

import React, { useEffect, useState } from 'react'
import { TinyArea  as TinyAreaAntd} from '@ant-design/charts';


export const TinyArea= (props: any) => {
  const [data, setData] = useState( [
    264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
  ]);

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
    smooth: true,
    areaStyle: {
      fill: props.color?props.color:'#d6e3fd',
    },
  };

//console.log("渲染函数",props?.renderItem)
return (


  <TinyAreaAntd {...config} />
 )
 }

export default TinyArea;