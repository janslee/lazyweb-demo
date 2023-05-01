
import { Breadcrumb, Steps, UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React from 'react';
import { Avatar, Badge as  BadgeAntd} from 'antd';



const page: React.FC = (props:any) => (
  <>
<a target={"_blank"} href={props.href?props.href:"#"}>
  <BadgeAntd  {...props} count={props.value?props.value:props.count} text="" >
    {
      props.text?( <Avatar style={{ backgroundColor:props.backgroundColor?props.backgroundColor:'#87d068' }} shape="square" size="large" >
      {props.text}
    </Avatar>):(null)
    }
</BadgeAntd>
</a>

  </>
);

export default page;