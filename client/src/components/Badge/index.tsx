
import React from 'react';
import { Avatar, Badge as  BadgeAntd} from 'antd';



const Badge: React.FC = (props:any) => (
  <>
<a target={props.href?"_blank":"_self"} href={props.href?props.href:"javascript:void(0)"}>
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


export default Badge;