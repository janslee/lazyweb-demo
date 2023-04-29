import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React from 'react';
import { Divider as  DividerAntd} from 'antd';

const page= (props: any) => {
  
  return (
    <DividerAntd orientation="center" orientationMargin={50} {...props}>
    {props.title}
    </DividerAntd>
     )
 }

export default page;