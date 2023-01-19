import React,{ useEffect, useState }  from 'react';
import {Line} from '@ant-design/charts';
import { useModel } from 'umi';
import { Button, Space } from 'antd';
const Page: React.FC = () => {
  const message = useModel('demo');
const  {initialState,loading,refresh,setInitialState}= useModel('@@initialState');

  const [ name, setName ] = useState('angle');
  const [ count, setCount ] = useState(1);

  const addCount=()=>{
    setCount(count+1)
  }


  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '2000', value: 13 },
  ];
  const config = {
    data,
    height: 400,
    //width:500,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };


useEffect(()=>{
console.log("初始化参数",initialState?.currentUser)

return ()=>{
console.log("更新完数据才执行")
}

  },[name,count])


  return <div style={{width:"100%"}}><div>{message}</div>
  <Line {...config} />
  
  <div>
  <Space wrap>
  <p>我是message页面,name是：{name}</p>
  <p>我是message页面,count是：{count}</p>
  <Button type="danger" onClick={() => setName('jane')}>点击我改变name</Button>
  <br />
  <Button type="primary" onClick={addCount}>点击我改变count</Button>
  {initialState?.currentUser?.name}
  </Space>
</div>

  
  </div>;

};
export default Page;
//import '~antd/lib/style/themes/default.less';