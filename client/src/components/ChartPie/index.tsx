

import React, { useEffect, useState } from 'react'
import { Pie  as PieAntd} from '@ant-design/charts';


export const ChartPie= (props: any) => {
  const [data, setData] = useState([
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
    appendPadding: 10,
    data,
    angleField: props.angleField?props.angleField:'value',
    colorField: props.colorField?props.colorField:'type',
    radius: 1,
    innerRadius: props.innerRadius?props.innerRadius:0.6,
    height: props.height?props.height:400,
    label: {
      type: 'inner',
      offset: '-50%',
      content: props.labelContent ?props.labelContent:'{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: null,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: props.title?props.title:'饼图演示',
      },
    },
  };



//console.log("渲染函数",props?.renderItem)
return (


  <PieAntd {...config} />
 )
 }


export default ChartPie;