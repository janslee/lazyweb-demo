import React from 'react';
import { MobileTwoTone, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';
import { queryProvince, queryCity } from '../service';

import styles from './BaseView.less';

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};




// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => 
{
  const [avatar2,setAvatar2]=React.useState(avatar);
function onChange(info:any) {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
   // console.log("上传成功",info)
   // message.success("上传成功");
    setAvatar2(info.file.response.data);
    //form.setFieldsValue({avatar:info.file.response.data});
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}
return(
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar2} alt="avatar" />
    </div>
    <Upload showUploadList={false} name="file" onChange={onChange} action={"/api/UploadAvatar"}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);
}

const BaseView: React.FC = () => {
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  const handleFinish = async (values:any) => {
    console.log('更新基本信息成功',values);
    const api="/api/SaveAdmin";
    fetch(api,{

      method: 'post',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then(({ results }) => {
    console.log("保存结果",results);
    
    message.success('更新基本信息成功');
    });

  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
               
              }}
              hideRequiredMark
              onValuesChange={(changeValues) => console.log("数据变化",changeValues)}
            >
<ProFormText
style={{display:"none"}}
                width="md"
                name="id"
                label="ID"
              
               readonly={true}
                rules={[
                  {
                   
                    required: true,
                   
                  },
                ]}
              />
<ProFormText
                width="md"
                name="username"
                label="账户"
               readonly={true}
                rules={[
                  {
                   
                    required: true,
                    message: '请输入您的账户!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
            
          <ProFormText
                width="md"
                name="realname"
                label="姓名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的姓名!',
                  },
                ]}
              />
              

              <ProFormText
                width="md"
                name="address"
                label="地址"
                rules={[
                  {
                    required: true,
                    message: '请输入您的街道地址!',
                  },
                ]}
              />
                 <ProFormText
                width="md"
                name="mobile"
                label="手机"
                rules={[
                  {
                    required: true,
                    message: '请输入您的街道手机!',
                  },
                ]}
              />



            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
