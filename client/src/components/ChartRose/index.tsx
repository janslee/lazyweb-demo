

import React, { useEffect, useState } from 'react'
import { Rose  as RoseAntd} from '@ant-design/charts';


 const ChartRose= (props: any) => {
  const [data, setData] = useState( [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
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
 
    data,
    xField: props.xField?props.xField:'type',
    yField: props.yField?props.yField:'value',
    seriesField: props.seriesField?props.seriesField:'type',
    radius: props.radius!=null?props.radius:0.9,
    innerRadius: props.innerRadius!=null?props.innerRadius:0.6,
    height: props.height?props.height:400,
    legend: {
      position: 'bottom',
    },
   
   
  };



//console.log("渲染函数",props?.renderItem)
return (


  <RoseAntd {...config} />
 )
 }


export default ChartRose;