

import React, { useEffect, useState } from 'react'
import { Waterfall  as WaterfallAntd} from '@ant-design/charts';


 const ChartWaterfall= (props: any) => {
  const [data, setData] = useState([
    {
      month: '2019',
      value: 23000000,
    },
    {
      month: 'Jan',
      value: 2200000,
    },
    {
      month: 'Feb',
      value: -4600000,
    },
    {
      month: 'Mar',
      value: -9100000,
    },
    {
      month: 'Apr',
      value: 3700000,
    },
    {
      month: 'May',
      value: -2100000,
    },
    {
      month: 'Jun',
      value: 5300000,
    },
    {
      month: 'Jul',
      value: 3100000,
    },
    {
      month: 'Aug',
      value: -1500000,
    },
    {
      month: 'Sep',
      value: 4200000,
    },
    {
      month: 'Oct',
      value: 5300000,
    },
    {
      month: 'Nov',
      value: -1500000,
    },
    {
      month: 'Dec',
      value: 5100000,
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
    padding: 'auto',
    height: props.height?props.height:400,
    appendPadding: [20, 0, 0, 0],
   xField: props.xField?props.xField:'month',
    yField: props.yField?props.yField:'value',
    meta: {
      month: {
        alias: props.xFieldAlias?props.xFieldAlias:'月份',
      },
      value: {
        alias: props.yFieldAlias?props.yFieldAlias:'销售量',
        formatter: props.yFieldFormatter && typeof(props.yFieldFormatter)=="function"?props.yFieldFormatter:(v:any) => (v/10000000).toString()+"亿",
      },
    },

    /** 展示总计 */
    total: {
      label: '总计',
    },
    color: ({ month, value }) => {
      if (month === '2019' || month === '总计') {
        return '#96a6a6';
      }

      return value > 0 ? '#f4664a' : '#30bf78';
    },
    legend: {
      custom: true,
      items: [
        {
          name: 'Increase',
          value: 'increase',
          marker: {
            symbol: 'square',
            style: {
              r: 5,
              fill: '#f4664a',
            },
          },
        },
        {
          name: 'Decrease',
          value: 'decrease',
          marker: {
            symbol: 'square',
            style: {
              r: 5,
              fill: '#30bf78',
            },
          },
        },
        {
          name: 'Total',
          value: 'total',
          marker: {
            symbol: 'square',
            style: {
              r: 5,
              fill: '#96a6a6',
            },
          },
        },
      ],
    },
    label: {
      style: {
        fontSize: 10,
      },
      layout: [
        {
          type: 'interval-adjust-position',
        },
      ],
      background: {
        style: {
          fill: '#f6f6f6',
          stroke: '#e6e6e6',
          strokeOpacity: 0.65,
          radius: 2,
        },
        padding: 1.5,
      },
    },
    waterfallStyle: () => {
      return {
        fillOpacity: 0.85,
      };
    },
  };

//console.log("渲染函数",props?.renderItem)
return (


  <WaterfallAntd {...config} />
 )
 }


export default ChartWaterfall;