import React from 'react';
import { List, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';



const SecurityView: React.FC = () => {
  

  
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const handleFinish = async (values:any) => {

    const api="/api/SaveAdmin";
    fetch(api,{

      method: 'post',
      body: JSON.stringify({password:values.password,id:currentUser.id}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then(({ results }) => {
    console.log("保存结果",results);
    
    message.success('修改密码成功');
    });

  };
  return (
    <>
   <div >
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新密码',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={currentUser}
              hideRequiredMark
              onValuesChange={(changeValues) => console.log("数据变化",changeValues)}
            >

            
          <ProFormText.Password
                width="md"
                name="oldpassword"
              
                label="老密码"
                rules={[
                  {
                    required: true,
                    message: '请输入您的老密码!',
                  },
                ]}
              />
                       
          <ProFormText.Password
                width="md"
                name="password"
                label="新密码"
                rules={[
                  {
                    required: true,
                    message: '请输入您的新密码!',
                  },
                ]}
              /> 


            </ProForm>
          </div>
    </>
  );
};

export default SecurityView;
