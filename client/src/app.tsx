import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser,fetchMenuData } from './services/ant-design-pro/api';
import { BookOutlined, CopyOutlined, DeleteOutlined, LinkOutlined, PlayCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import {
 
  RequestOptionsInit,

} from 'D:/ts/LazyWeb3/client/node_modules/umi-request';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

import * as icons from '@ant-design/icons'
import React from 'react';
import { common } from './lib/common';

let admin:any={}
//拦截器
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  let authHeader:any={}

  console.log("请求",url,options)
   if(admin!=null && admin?.token!=null)
   authHeader = { Authorization: 'Bearer '+admin?.token };
   if(options?.headers!=null)
   authHeader=Object.assign(options?.headers,authHeader) 

   console.log("请求参数",url,authHeader)
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
//写入token
const demoResponseInterceptors = (response: Response, options: RequestOptionsInit) => {
 //response.headers.append('interceptors', 'yes yo');
 if(response.status==401)
 {
  history.push("/user/login");
  return
 }
  if(response.headers.get("token")!=null && response.headers.get("token")!="")
  {
    let token=response.headers.get("token")
   // alert(token)
    if(token!=null)
    {
      if(token=="0")
      {
        history.push("/user/login");
        return
      }
     
      else
      {
        localStorage.setItem("token",token)
       // common.setCookie("token",token)
      }
     
     // console.log("写入token")
    }
   
  }
  return response;
};




export const request: RequestConfig = {
 // errorHandler,
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [demoResponseInterceptors],
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

const IconMap = {
  smile: <icons.SmileOutlined />,
  heart: <icons.HeartOutlined />,
  home: <icons.HomeOutlined />,
  dashboard: <icons.DashboardOutlined />,
  form: <icons.FormOutlined />,
  list: <icons.UnorderedListOutlined />,
table: <icons.TableOutlined />,
profile: <icons.ProfileOutlined />,
CheckCircleOutlined: <icons.CheckCircleOutlined/>,
warning: <icons.WarningOutlined/>,
user: <icons.UserOutlined/>,
highlight:<icons.BarChartOutlined/>,
DownOutlined:<icons.DownOutlined />,
PlayCircleOutlined:<PlayCircleOutlined />,
QuestionOutlined:<QuestionOutlined />,
CopyOutlined:<CopyOutlined />,
DeleteOutlined:<DeleteOutlined />,
};

const CreateIcon=(IconName:string)=>{
return React.createElement(icons[IconName],{},null)
}
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 初始化权限
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
cqa?:string;
}> {
  const fetchUserInfo = async (param:any) => {
    try {
      let token=localStorage.getItem("token")
      if(admin?.token!=null)
      token=admin?.token
      if(token==null && param?.token!=null)
      {
        token=param["token"]
      }
      if(token==null || token=="")
      return {}
      const msg = await queryCurrentUser({"token":token});
      admin=msg.data
    
      return msg.data;
    } catch (error) {
      console.log("获取用户信息错误",error)
  
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
   cqa:"sdsd"
  };
}
const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ icon, routes, ...item }) => ({
    ...item,
   // icon: icon && IconMap[icon as string],
    icon: icon && CreateIcon(icon as string),
    
    children: routes && loopMenuItem(routes),
  }));

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {

    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: {
        userId: initialState?.currentUser?.userid,
      },
      request: async (params, defaultMenuData) => {
        // initialState.currentUser 中包含了所有用户信息
        let menuData:any =null
       if(initialState?.currentUser?.userid!=null)
       {
        menuData = await fetchMenuData();
       }
        return loopMenuItem(menuData); //转换图标icon
    
      },
    },


    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link style={{display:"none"}} to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
