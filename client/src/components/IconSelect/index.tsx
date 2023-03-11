
import React from 'react'



import Icon from '@ant-design/icons'
import * as icons from '@ant-design/icons'
import { Select } from 'antd'
const { Option } = Select

export interface iconSelectProps {
  placeholder?: string
}

 const iconSelect: React.FC<any> = (props:any) => {
  // const iconList = Object.keys(icons)
// 里面有一些是方法,要筛选一遍,否则页面会报错　　
  const iconList = Object.keys(icons).filter((item) => typeof icons[item] === 'object')
//console.log("图标",iconList)
  return (
    <Select 
    {...props}
      placeholder={props?.placeholder} 
      showSearch 
      allowClear 
      style={{ width: '100%' }}
     
    >
      {iconList.map(item => {
        return <Option  value={item} key={item}>
          <Icon component={icons[item]} style={{marginRight: '8px'}} />
          {item}
        </Option>
      })}
    </Select>
  )
}
export default iconSelect;
