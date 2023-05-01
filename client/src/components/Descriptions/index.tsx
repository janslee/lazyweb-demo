


import React, { useEffect, useState } from 'react'
import { Descriptions as  DescriptionsAntd} from 'antd';
 const Descriptions: React.FC = (props: any) => {
  const [items, setItems] = useState<any[]>([{"label":"姓名","value":"张强","span":12},{"label":"性别","value":"男","span":12}]);

  

  useEffect(() => {
    if(props?.items && typeof(props?.items)=="object")
    setItems(props?.items)
  
  }, [props?.items])
  useEffect(() => {
  if(props?.initApi!=null && props?.initApi!="")
  {
  let   url=props?.initApi
  let CurrentUrl=location.href;
  if(CurrentUrl.indexOf("3000")>0)
    {
      url="http://127.0.0.1:7000"+url
    }
  
    fetch(url,{
      method: 'post',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  
  
        .then((res) => res.json())
        .then((rs) => {
          
          if(rs.data)
          {
          let  itemsweb=[]
          if(props.initFun!=null && typeof(props.initFun)=="function")
          {
  
         props.initFun(rs.data)
          //  setItems(itemsweb)
          }
          else
          {
            for(const key in rs.data)
            {
              const value=rs.data[key]
              itemsweb.push({"label":key,"value":value,"span":12})
            }
            setItems(itemsweb)
          }
         //   console.log("获取到的数据",itemsweb)
          }
        })
  }
  else  if(props.initFun!=null && typeof(props.initFun)=="function")
  {
    props.initFun({})
   
  }
}, [])
  
  
  
  return (
  <DescriptionsAntd title={props.title} bordered>
  
   {items && typeof(items)=="object" && (items.map((row) => (
    <DescriptionsAntd.Item label={row.label} span={row.span?row.span:0}>
     {row.value}
     </DescriptionsAntd.Item>
  ))
  )
  }
    </DescriptionsAntd>
   )
};


export default Descriptions;