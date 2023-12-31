

import React, { useEffect, useState } from 'react'
import { Line  as LineAntd} from '@ant-design/charts';


export const ChartLine= (props: any) => {
  const [data, setData] = useState([
    {
      "name": "China",
      "year": "2000",
      "gdp": 1211346869605.24
    },
    {
      "name": "China",
      "year": "2001",
      "gdp": 1339395718865.3
    },
    {
      "name": "China",
      "year": "2002",
      "gdp": 1470550015081.55
    },
    {
      "name": "China",
      "year": "2003",
      "gdp": 1660287965662.68
    },
    {
      "name": "China",
      "year": "2004",
      "gdp": 1955347004963.27
    },
    {
      "name": "China",
      "year": "2005",
      "gdp": 2285965892360.54
    },
    {
      "name": "China",
      "year": "2006",
      "gdp": 2752131773355.16
    },
    {
      "name": "China",
      "year": "2007",
      "gdp": 3550342425238.25
    },
    {
      "name": "China",
      "year": "2008",
      "gdp": 4594306848763.08
    },
    {
      "name": "China",
      "year": "2009",
      "gdp": 5101702432883.45
    },
    {
      "name": "China",
      "year": "2010",
      "gdp": 6087164527421.24
    },
    {
      "name": "China",
      "year": "2011",
      "gdp": 7551500425597.77
    },
    {
      "name": "China",
      "year": "2012",
      "gdp": 8532230724141.76
    },
    {
      "name": "China",
      "year": "2013",
      "gdp": 9570405758739.79
    },
    {
      "name": "China",
      "year": "2014",
      "gdp": 10438529153237.6
    },
    {
      "name": "China",
      "year": "2015",
      "gdp": 11015542352468.9
    },
    {
      "name": "China",
      "year": "2016",
      "gdp": 11137945669350.6
    },
    {
      "name": "China",
      "year": "2017",
      "gdp": 12143491448186.1
    },
    {
      "name": "China",
      "year": "2018",
      "gdp": 13608151864637.9
    },
    {
      "name": "United States",
      "year": "2000",
      "gdp": 10252345464000
    },
    {
      "name": "United States",
      "year": "2001",
      "gdp": 10581821399000
    },
    {
      "name": "United States",
      "year": "2002",
      "gdp": 10936419054000
    },
    {
      "name": "United States",
      "year": "2003",
      "gdp": 11458243878000
    },
    {
      "name": "United States",
      "year": "2004",
      "gdp": 12213729147000
    },
    {
      "name": "United States",
      "year": "2005",
      "gdp": 13036640229000
    },
    {
      "name": "United States",
      "year": "2006",
      "gdp": 13814611414000
    },
    {
      "name": "United States",
      "year": "2007",
      "gdp": 14451858650000
    },
    {
      "name": "United States",
      "year": "2008",
      "gdp": 14712844084000
    },
    {
      "name": "United States",
      "year": "2009",
      "gdp": 14448933025000
    },
    {
      "name": "United States",
      "year": "2010",
      "gdp": 14992052727000
    },
    {
      "name": "United States",
      "year": "2011",
      "gdp": 15542581104000
    },
    {
      "name": "United States",
      "year": "2012",
      "gdp": 16197007349000
    },
    {
      "name": "United States",
      "year": "2013",
      "gdp": 16784849190000
    },
    {
      "name": "United States",
      "year": "2014",
      "gdp": 17521746534000
    },
    {
      "name": "United States",
      "year": "2015",
      "gdp": 18219297584000
    },
    {
      "name": "United States",
      "year": "2016",
      "gdp": 18707188235000
    },
    {
      "name": "United States",
      "year": "2017",
      "gdp": 19485393853000
    },
    {
      "name": "United States",
      "year": "2018",
      "gdp": 20544343456936.5
    },
    {
      "name": "United Kingdom",
      "year": "2000",
      "gdp": 1657816613708.58
    },
    {
      "name": "United Kingdom",
      "year": "2001",
      "gdp": 1640246149417.01
    },
    {
      "name": "United Kingdom",
      "year": "2002",
      "gdp": 1784473920863.31
    },
    {
      "name": "United Kingdom",
      "year": "2003",
      "gdp": 2053018775510.2
    },
    {
      "name": "United Kingdom",
      "year": "2004",
      "gdp": 2416931526913.22
    },
    {
      "name": "United Kingdom",
      "year": "2005",
      "gdp": 2538680000000
    },
    {
      "name": "United Kingdom",
      "year": "2006",
      "gdp": 2713749770009.2
    },
    {
      "name": "United Kingdom",
      "year": "2007",
      "gdp": 3100882352941.18
    },
    {
      "name": "United Kingdom",
      "year": "2008",
      "gdp": 2922667279411.76
    },
    {
      "name": "United Kingdom",
      "year": "2009",
      "gdp": 2410909799034.12
    },
    {
      "name": "United Kingdom",
      "year": "2010",
      "gdp": 2475244321361.11
    },
    {
      "name": "United Kingdom",
      "year": "2011",
      "gdp": 2659310054646.23
    },
    {
      "name": "United Kingdom",
      "year": "2012",
      "gdp": 2704887678386.72
    },
    {
      "name": "United Kingdom",
      "year": "2013",
      "gdp": 2786022872706.81
    },
    {
      "name": "United Kingdom",
      "year": "2014",
      "gdp": 3063803240208.01
    },
    {
      "name": "United Kingdom",
      "year": "2015",
      "gdp": 2928591002002.51
    },
    {
      "name": "United Kingdom",
      "year": "2016",
      "gdp": 2694283209613.29
    },
    {
      "name": "United Kingdom",
      "year": "2017",
      "gdp": 2666229179958.01
    },
    {
      "name": "United Kingdom",
      "year": "2018",
      "gdp": 2855296731521.96
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
    xField: props.xField?props.xField:'year',
    yField: props.yField?props.yField:'gdp',
      height: props.height?props.height:400,
    seriesField: props.seriesField?props.seriesField:'name',
    yAxis: {
      label: {
        formatter: props.yAxisLabel?props.yAxisLabel:(v) => `${(v / 10e8).toFixed(1)} B`,
      },
    },
      xAxis: {
      label: {
        formatter: props.xAxisLabel?props.xAxisLabel:(v) => v+"年",
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
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


  <LineAntd {...config} />
 )
 }

export default ChartLine;