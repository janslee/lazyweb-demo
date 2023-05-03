

import React, { useEffect, useState } from 'react'
import { Radar  as RadarAntd} from '@ant-design/charts';


 const ChartRadar= (props: any) => {
  const [data, setData] = useState([
    {
      name: 'G2',
      star: 10371,
    },
    {
      name: 'G6',
      star: 7380,
    },
    {
      name: 'F2',
      star: 7414,
    },
    {
      name: 'L7',
      star: 2140,
    },
    {
      name: 'X6',
      star: 660,
    },
    {
      name: 'AVA',
      star: 885,
    },
    {
      name: 'G2Plot',
      star: 1626,
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
    data: data,
    xField: props.xField?props.xField:'name',
    yField: props.yField?props.yField:'star',
   
    appendPadding: [0, 10, 0, 10],
    meta: {
      star: {
        alias: props.alias?props.alias:'star 数量',
        min: 0,
        nice: true,
        formatter: (v) => Number(v).toFixed(0),
      },
    },
    xAxis: {
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: props.alternateColor?props.alternateColor:'#eeeeee',
      },
    },
    // 开启辅助点
    point: {
      size: 2,
    },
    area: {},
  };



//console.log("渲染函数",props?.renderItem)
return (


  <RadarAntd {...config} />
 )
 }


export default ChartRadar;