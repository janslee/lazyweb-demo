

import React, { useEffect, useState } from 'react'
import { Column  as ColumnAntd} from '@ant-design/charts';


export const ChartColumn= (props: any) => {
  const [data, setData] = useState([
    {
      "city": "石家庄",
      "type": "水果",
      "value": 14500
    },
    {
      "city": "石家庄",
      "type": "米面",
      "value": 8500
    },
    {
      "city": "石家庄",
      "type": "特产零食",
      "value": 10000
    },
    {
      "city": "石家庄",
      "type": "茶叶",
      "value": 7000
    },
    {
      "city": "深圳",
      "type": "水果",
      "value": 9000
    },
    {
      "city": "深圳",
      "type": "米面",
      "value": 8500
    },
    {
      "city": "深圳",
      "type": "特产零食",
      "value": 11000
    },
    {
      "city": "深圳",
      "type": "茶叶",
      "value": 6000
    },
    {
      "city": "温州",
      "type": "水果",
      "value": 16000
    },
    {
      "city": "温州",
      "type": "米面",
      "value": 5000
    },
    {
      "city": "温州",
      "type": "特产零食",
      "value": 6000
    },
    {
      "city": "温州",
      "type": "茶叶",
      "value": 10000
    },
    {
      "city": "宁波",
      "type": "水果",
      "value": 14000
    },
    {
      "city": "宁波",
      "type": "米面",
      "value": 9000
    },
    {
      "city": "宁波",
      "type": "特产零食",
      "value": 10000
    },
    {
      "city": "宁波",
      "type": "茶叶",
      "value": 9000
    },
    {
      "city": "无锡",
      "type": "水果",
      "value": 14000
    },
    {
      "city": "无锡",
      "type": "米面",
      "value": 9000
    },
    {
      "city": "无锡",
      "type": "特产零食",
      "value": 10000
    },
    {
      "city": "无锡",
      "type": "茶叶",
      "value": 6000
    },
    {
      "city": "杭州",
      "type": "水果",
      "value": 9000
    },
    {
      "city": "杭州",
      "type": "米面",
      "value": 8500
    },
    {
      "city": "杭州",
      "type": "特产零食",
      "value": 10000
    },
    {
      "city": "杭州",
      "type": "茶叶",
      "value": 6000
    },
    {
      "city": "北京",
      "type": "水果",
      "value": 17000
    },
    {
      "city": "北京",
      "type": "米面",
      "value": 6000
    },
    {
      "city": "北京",
      "type": "特产零食",
      "value": 7000
    },
    {
      "city": "北京",
      "type": "茶叶",
      "value": 10000
    },
    {
      "city": "上海",
      "type": "水果",
      "value": 18000
    },
    {
      "city": "上海",
      "type": "米面",
      "value": 11000
    },
    {
      "city": "上海",
      "type": "特产零食",
      "value": 15000
    },
    {
      "city": "上海",
      "type": "茶叶",
      "value": 14000
    }
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
    xField: props.xField?props.xField:'city',
    yField: props.yField?props.yField:'value',
    height: props.height?props.height:400,
    //width: props.width?props.width:700,
    seriesField: props.seriesField?props.seriesField:'type',
    yAxis: {
      label: {
        formatter: props.yAxisLabel?props.yAxisLabel:(v:any) => `${v}`,
      },
    },
      xAxis: {
      label: {
        formatter: props.xAxisLabel?props.xAxisLabel:(v:any) => v+"年",
      },
    },
    /*
    legend: {
      position: 'top',
    },
    */
    smooth: true,
    isGroup: props.isGroup?props.isGroup:false,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    // @TODO 后续会换一种动画方式
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };


//console.log("渲染函数",props?.renderItem)
return (


  <ColumnAntd {...config} />
 )
 }


export default ChartColumn;