

import React, { useEffect, useState } from 'react'
import { Card, Statistic as  StatisticAntd} from 'antd';

const Statistic= (props: any) => {
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any>("999");



useEffect(() => {
  if(props?.value)
setValue(props?.value);


}, [props?.value])

useEffect(() => {

  if(props?.data)
  setValue(props?.data);
  
  
  }, [props?.data])
//console.log("渲染函数",props?.renderItem)
return (


  <Card>
  <StatisticAntd
   {...props}

    value={value}

  />
</Card>
 )
 }


export default Statistic;