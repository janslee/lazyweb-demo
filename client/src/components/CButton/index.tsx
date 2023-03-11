
import { Button } from 'antd';

const CButton: React.FC = (props:any) => {

  //console.log("按钮参数",props)
  function ShowSubmit(formProps:any)
{
 
  if(formProps?.html!=null )
  {
    
    return  (formProps?.html)
  }
  else
  {
    return <></>
  }
}


//if(props["text"]==null)
//props["text"]="按钮"
let text=props?.text
if(text==null)
{
  text="按钮"
}
  return (
    <>
     {ShowSubmit(props)}
   <Button type='primary' {...props}>{text}</Button>
   </>
  );
};
export default CButton;
