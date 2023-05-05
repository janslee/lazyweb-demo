

import React, { useEffect, useRef, useState } from 'react'
import { Gauge  as GaugeAntd} from '@ant-design/charts';


export const Gauge= (props: any) => {
  const [percent, setPercent] = useState(0.5);
  useEffect(() => {
    if(props.value){
      setPercent(props.value)
    }
    }, [props.value]);
  
    useEffect(() => {
      if(props.percent){
        setPercent(props.percent)
      }
      }, [props.percent]);
 const ticks = [0, 1 / 3, 2 / 3, 1];
  const color = ['#F4664A', '#FAAD14', '#30BF78'];
  const graphRef = useRef(null);
  const config = {
    percent: percent,
    innerRadius: 0.75,
    type:  props.type!=null?props.type:'meter',
    // 自定义 meter 总步数 以及 step 占比

    range: {
      ticks: [0, 1],
      color: ['l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      title: {
        formatter: ({ percent }) => {
          if (percent < ticks[1]) {
            return '差';
          }

          if (percent < ticks[2]) {
            return '中';
          }

          return '优';
        },
        style: ({ percent }) => {
          return {
            fontSize: '36px',
            lineHeight: 1,
            color: percent < ticks[1] ? color[0] : percent < ticks[2] ? color[1] : color[2],
          };
        },
      },
      content: {
        offsetY: 36,
        style: {
          fontSize: '24px',
          color: '#4B535E',
        },
        formatter: () => ''+config.percent*100+"%",
      },
    },
    onReady: (plot:any) => {
      graphRef.current = plot;
    },
  };
  useEffect(() => {
    if (graphRef.current) {
      let data = 0;
      const interval = setInterval(() => {
        if (data >= 1.5) {
          clearInterval(interval);
        }

        data += 0.005;
        if( graphRef?.current)
        graphRef?.current.changeData(data > 1 ? data - 1 : data);
      }, 10);
    }
  }, [graphRef]);

  return <GaugeAntd {...config} />;



 }
export default Gauge;