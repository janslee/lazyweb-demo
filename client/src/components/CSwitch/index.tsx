import React, { useEffect, useState } from 'react'
import { Switch as AntdSwitch } from 'antd'

import { connect, mapProps } from '@formily/react';
export const Switch3: React.FC = (props: any) => {
  const [value, setValue] = useState<number>(0);
  useEffect(() => {

    if (props.$self.value != null ) {
     
      setValue(parseInt(props.$self.value))
    }
  }, [props.$self.value])
    
  const handleChange = (checked: boolean) => {
   // setValue(checked ? 1 : 0);
    props.$self.value=checked ? 1 : 0;
  }

  return (
    <AntdSwitch {...props} checked={value === 1} onChange={handleChange} />
  );
}


export const Switch = connect(
  Switch3,
    mapProps((props: any, field:any) => {
      
      //window.console.log('CustomIput-props', props);
    //  window.console.log('CustomIput-field', field);
     // const { withCount } = props;
  // console.log("field",field)
    // console.log("select field",field)
      return {
        ...props,
        value: field?.value,
        $self: field,
      //  loading: loading,
      //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
      };
    })
  );
export default Switch;