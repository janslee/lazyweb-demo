

import React, { useEffect, useState } from 'react'
import { AreaMap  as AreaMapAntd} from '@ant-design/charts';


export const ChartAreaMap= (props: any) => {
  const [geodata, setGeodata] = useState({})
  const [data, setData] = useState([
    { name: '黄浦区', count: 30000 ,unit_price:122},
    { name: '徐汇区', count: 40000,unit_price:100 },
    { name: '长宁区', count: 25000 ,unit_price:4},
    { name: '静安区', count: 20000 ,unit_price:2},
    { name: '普陀区', count: 15000,unit_price:300 },
    { name: '虹口区', count: 10000 ,unit_price:150},
    { name: '杨浦区', count: 5000 ,unit_price:170},
    { name: '闵行区', count: 8000 ,unit_price:320},
    { name: '宝山区', count: 1000 ,unit_price:223},
    { name: '嘉定区', count: 2000 ,unit_price:100},
    { name: '浦东新区', count: 10000 ,unit_price:50},
    { name: '金山区', count: 3000 ,unit_price:12},
    { name: '松江区', count: 5000 ,unit_price:77},
    { name: '青浦区', count: 2000 ,unit_price:176},
    { name: '奉贤区', count: 1000 ,unit_price:99},
    { name: '崇明区', count: 800 ,unit_price:67},
  ]);

  useEffect(() => {
  if(props.data && typeof props.data === 'object'){
    setData(props.data)
  }
  }, [props.data]);
  useEffect(() => {

    asyncFetch();
  },[])

  const asyncFetchGeoData = (dataNew:any) => {
    let geourl=props.geourl?props.geourl:'https://geo.datav.aliyun.com/areas_v3/bound/310000_full.json'
    fetch(geourl)
      .then((response) => response.json())
      .then((json) => {
        let features=json.features
        let CityData=features.map((item:any)=>{
        
          let row=item
    
         if(dataNew)
         {
         
          for(const d of dataNew){
            if(d.name===row["properties"]["name"]){
              for (let i in d)
              {
                if(i!="name")
                row["properties"][i]=d[i]
              }
          
              break
            }
          }
         }
           return row
        })
        json["features"]=CityData
        setGeodata(json)
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const asyncFetch = async () => {
    if (props.api) {
      let api = props.api;
      let CurrentUrl = location.href;
      if (CurrentUrl.indexOf("3000") > 0) {
        api = "http://127.0.0.1:7000" + api;
      }
  
      try {
        const response = await fetch(api, { credentials: 'include' });
        const rs = await response.json();
        //console.log("data数据时",rs.data)
        if (rs.data) 
        {
        setData(rs.data);
        asyncFetchGeoData(rs.data)
      }
      } catch (error) {
        console.log('fetch data failed', error);
      }
    }
    else
    {
      asyncFetchGeoData(data)
    }
  };

  
  
  

  const config = {
    map: {
      type: 'mapbox',
      style: 'blank',

      center:  props.center && typeof(props.center)=="object"?props.center:[120.19382669582967, 30.258134],
      zoom: 3,
      pitch: 0,
    },
    source: {
      data: geodata,
      parser: {
        type: 'geojson',
      },
    },
    autoFit: true,
    color: {
      field: props.colorField?props.colorField:'unit_price',
      value: props.color && typeof(props.color)=="object"?props.color:['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'],
      scale: {
        type: 'quantile',
      },
    },
    style: {
      opacity: 1,
      stroke: '#fff',
      lineWidth: 0.6,
      lineOpacity: 1,
    },
    state: {
      active: true,
    },
    label: {
      visible: true,
      field: 'name',
      style: {
        fill: '#000',
        opacity: 0.8,
        fontSize: 10,
        stroke: '#fff',
        strokeWidth: 1.5,
        textAllowOverlap: false,
        padding: [8, 8],
      },
    },
    tooltip: {
      items: props.tooltipItems && typeof(props.tooltipItems)=="object"?props.tooltipItems:['name', {field:'unit_price',alias:"价格"},{field:'count',alias:"数量"}],
    
    },
    zoom: {
      position: 'bottomright',
    },
    legend: {
      position: 'bottomleft',
    },
  };

//console.log("渲染函数",props?.renderItem)
return (



  <div style={{width:props.width?props.width:"500px","height":props.height?props.height:"500px"}}><AreaMapAntd {...config} /></div>
 )
 }


export default ChartAreaMap;