
import { Divider as  DividerAntd} from 'antd';

 const Divider: React.FC = (props: any) => {
  return (
    <DividerAntd orientation="center" orientationMargin={50} {...props}>
    {props.title}
    </DividerAntd>
     )
};


export default Divider;