
import { connect, mapProps } from '@formily/react';
import { useEffect, useState } from 'react';


  
export const CList2: React.FC = (props:any) => {
  const [data, setData] = useState<any[]>();
  

  useEffect(() => {

 console.log("props?.data",props?.data)
  if(props?.data)
  {
    let datap=[]
    if(props?.data!=null && typeof(props?.data)=="string" && props?.data!="")
    {
  
    let data_str=props?.data.replace("{{","").replace("}}","")
        try{
           datap=eval(data_str)
        }
        catch(e)
        {
          console.log("data转换失败",e)
        }
        setData(datap)
      }
     
      if(typeof(props?.data)=="object")
    setData(props?.data)
  
  }
  else
  {
    setData([])
  }
  /*
  let tem:any[]=[]
  //获取拖拽的循环体
  React.Children.map(props.children, child => {
  let b:any=child.props.children
  
  for(let b2 in b)
  {
   let c=b[b2]
   if(c!=null)
   {
     if(c.props!=null && c.props.children!=null)
     {
  
       if(c.props.children[0]!=null)
       tem=c.props.children
     }
   }
  
  }
  
  }
  
  )
  
  console.log("拖拽模板原始",tem)
  tem=tem.map((item, index, array) => {
  return {"name":item["props"]["name"],"title":item["props"]["schema"]["title"],"x-component":item["props"]["schema"]["x-component"]}
  })
  
  console.log("拖拽模板",tem)
  */
  
  

  if(props?.initFun )
  {
  
    if(props?.initFun!=null && typeof(props?.initFun)=="string" && props?.initFun!="")
    {
  
    let data_str=props?.initFun.replace("{{","").replace("}}","")
        try{
        const fun=  eval(data_str)
        fun()
        }
        catch(e)
        {
          console.log("initfun转换失败",e)
        }
        
      }
      if(props?.initFun!=null && typeof(props?.initFun)=="function")
      props?.initFun()
  
  }




  }, [props?.data]);
    


  useEffect(() => {

  }, [data]);

  function renderLoopMain(item:any)
  {
    if(props?.loopRender==null)
    return null
    if(typeof(props?.loopRender)=="function")
    {
      return props?.loopRender(item)
    }
    else if(typeof(props?.loopRender)=="string")
    {
      try{
      let f=eval(props?.loopRender)
      return f(item)
    }
    catch(e)
    {
      console.log("循环体渲染失败",e)
    }
    }
  }
  
    return (
     <>
     <div style={{width:1200,clear:"both"}}>
            {props?.title}
    </div>
      {
     
     data && data.map((item, index, array) => (
     <>
     {
    renderLoopMain(item)
     }
  
  
        </>
      ))
      }
     
     </>
     
    )
  }


   const CList = connect(
    CList2,
    mapProps((props: any, field: any) => {
  
      //window.console.log('CustomIput-props', props);
      //  window.console.log('CustomIput-field', field);
      // const { withCount } = props;
      // console.log("field",field)
      // console.log("select field",field)
      return {
        ...props,
      data: field.data,
        //  loading: loading,
        //  showCount: withCount, // schema中有一个自定义的属性withCount，input本身没有该属性，需要通过mapProps做映射处理
      };
    })
  );
  

export default CList;
