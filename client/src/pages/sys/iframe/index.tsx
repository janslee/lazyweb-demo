import { FC, useState } from 'react';
import ReactDOM from 'react-dom';

const iframe: FC = (props:any) => {


 let h=900




let url=props?.match?.params?.url
  // url="/visual/preview.html?page_id=2"
url=decodeURIComponent(url)
h=window.outerHeight+50

  return (
   
 
         <iframe
          allowFullScreen={true}
          scrolling={'auto'}
          width="100%"
          height={h+"px"}
          frameBorder={0}
      style={{padding:"0",margin:"0"}}
         src={url}/>
   
 
  );
};

export default iframe;
