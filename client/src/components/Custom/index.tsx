
import { connect, mapProps } from '@formily/react';
import { useEffect, useState } from 'react';



export const Custom3: React.FC = (props: any) => {
  const [value, setValue] = useState<any>();
  useEffect(() => {

    if (props?.value != null)
      setValue(props?.value)

  }, [props?.value]);

  function renderMain() {
    if (props?.render == null)
      return null
    if (typeof (props?.render) == "function") {
      return props?.render((value))
    }
    else if (typeof (props?.render) == "string") {
      try {
        let f = eval(props?.render)
        return f(value)
      }
      catch (e) {
        console.log("获取渲染失败", e)
      }
    }
  }
     return (
    <div style={{width:props?.width}}>

    {
      renderMain()
    }
</div>
  )
}


export const Custom = connect(
  Custom3,
  mapProps((props: any, field: any) => {

    //window.console.log('CustomIput-props', props);
    //  window.console.log('CustomIput-field', field);
    // const { withCount } = props;
    // console.log("field",field)
    // console.log("select field",field)
    return {
      ...props,
      //  value: field?.value,
      //  loading: loading,
      //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
    };
  })
);


export default Custom;
