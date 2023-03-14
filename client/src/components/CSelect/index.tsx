import React, { useEffect, useState } from 'react'
import { Select as FormilySelect } from 'antd'

import { common } from '../../lib/common'
import { connect, mapProps } from '@formily/react';
 const Select2: React.FC = (props: any) => {
  const [options, setOptions] = useState<any[]>();
let fieldNames:any={ label: "label", value: "value", options: "options" }
  if (props?.fieldNames != null ) {
   // fieldNames = props?.fieldNames
  }
  useEffect(() => {
    if (props?.options != null ) {
      setOptions(props?.options)
    }
    if (props?.initApi != null && props?.initApi != "") {
      let initApi = props?.initApi
     // alert(initApi)
      fetch(initApi, {
        method: 'post',
        body: common.jsonToUrlParam({}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then((res) => res.json())
        .then(({ data, code }) => {
      // console.log("select获取到的数据", data);

          if (data != null && code == 0) {
        
            let options2=[];
            let fieldNames2= props?.fieldNames
           for (let i in data) {
            let row={}
            row["value"]=data[i][fieldNames2["value"]]
            row["label"]= data[i][fieldNames2["label"]]
           
           options2.push(row)
            }
            setOptions(options2)
           // console.log("options",options)
          //  console.log("fieldNames",fieldNames)


          }

        });


    }

   

  }, [])

  return (
    <>

      <FormilySelect  {...props} 
      fieldNames={fieldNames} 
         filterOption={false}
      options={options}></FormilySelect>

     
    </>
  );
};


export const Select = connect(
  Select2,
    mapProps((props: any, field:any) => {
    
      //window.console.log('CustomIput-props', props);
    //  window.console.log('CustomIput-field', field);
     // const { withCount } = props;
    
     console.log("select field",field)
      return {
        ...props,
        options: field?.dataSource,
      //  loading: loading,
      //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
      };
    })
  );
  
export default Select;