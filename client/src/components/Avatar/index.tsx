
import { UserOutlined } from '@ant-design/icons';
import { Avatar as  AvatarAntd} from 'antd';

 const Avatar: React.FC = (props: any) => {
  return (
    <AvatarAntd icon={<UserOutlined />} {...props} src={props.value?props.value:props?.src}/>
     )
};


export default Avatar;