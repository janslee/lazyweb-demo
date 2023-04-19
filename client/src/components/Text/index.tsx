

import React from 'react';
import cls from 'classnames'
import './styles.less'


  
   const Text: React.FC  = (props:any) => {
    let tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode
   // props["dangerouslySetInnerHTML"]={_html:props.content}
    //let props2={"dangerouslySetInnerHTML":{"__html":'<div>123</div>'},...props}
   //props2["dangerouslySetInnerHTML"]={__html:'<div>123</div>'}
   let props2=JSON.parse(JSON.stringify(props))
   if(props2?.href!=null && props2?.href!="")
  {

    props2.target="_blank"
    props2.rel="noopener noreferrer"
    let last=props2.href.substring(props2.href.length-1,props2.href.length)
   
    if(last=="=")
    {    
    props2.href+=props2.content
  
   } 
   if(props2?.prefix!=null)
   {
    props2.content=props2.prefix+ props2.content
   }
   if(props2?.suffix!=null)
   {
    props2.content= props2.content+props2.suffix
   }
  }
  console.log("props2",props2)
    return React.createElement(
      tagName,
      {
       ...props2,
      
        className: cls(props.className, 'dn-text'),
        'data-content-editable': 'x-component-props.content',
    
      },
     props2.content
    )
  }
export default Text;
