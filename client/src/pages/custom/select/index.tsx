import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AreaMap } from '@ant-design/charts';

const DemoAreaMap = () => {
  const [data, setData] = useState({ type: 'FeatureCollection', features: [] });

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/310000_full.json')
      .then((response) => response.json())
      .then((json) => {
        let features=json.features
        let CityData=features.map((item:any)=>{
        
          let row=item
         
          row["properties"]["unit_price"]=Math.round(Math.random()*10000)
          row["properties"]["count"]=Math.round(Math.random()*100)
          return row
        })
        json["features"]=CityData
        setData(json)
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    map: {
      type: 'mapbox',
      style: 'blank',

      center: [120.19382669582967, 30.258134],
      zoom: 3,
      pitch: 0,
    },
    source: {
      data: data,
      parser: {
        type: 'geojson',
      },
    },
    autoFit: true,
    color: {
      field: 'unit_price',
      value: ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'],
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
      items: ['name', {field:'unit_price',alias:"价格"},{field:'count',alias:"数量"}],
    
    },
    zoom: {
      position: 'bottomright',
    },
    legend: {
      position: 'bottomleft',
    },
  };

  return <div style={{"height":"500px"}}><AreaMap {...config} /></div>;
};


export default DemoAreaMap;
