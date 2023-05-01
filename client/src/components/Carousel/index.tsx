
import React from 'react';

import { Carousel as  CarouselAntd} from 'antd';


export const Carousel= (props: any) => {
  /*
  useEffect(() => {
  
    if(props?.value){
      props.onChange(props?.value)
    }
  
  }, [props?.value])
  */
  const contentStyle: React.CSSProperties = {
    height: props.height?props.height:'160px',
    color: props.color?props.color:'#fff',
    lineHeight: props.height?props.height:'160px',
    width:"100%",
    textAlign: 'center',
    background: props.background?props.background:'#364d79',
  };
  let items=props.items?props.items:[{"text":"1","image":"","href":""},{"text":"2","image":"","href":""}]
  
  return (
  <CarouselAntd effect="fade" {...props}>
  
  {items && typeof(items)=="object" && (items.map((row:any) => (
        <div>
         <a href={row.href?row.href:"#"} >
          {row.image?<img src={row.image} style={contentStyle}/>:<h3 style={contentStyle}>{row.text}</h3>}
        
          </a>
          </div>
  ))
  )
  }
  
    </CarouselAntd>
   )
   }


export default Carousel;