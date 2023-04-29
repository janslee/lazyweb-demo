
import { Breadcrumb, Steps, UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import React from 'react';


const page= (props: any) => {
  const items = [{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }];
  return <Steps items={items}  current={1}/>;
 }

export default page;