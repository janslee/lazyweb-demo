/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canReadFoo: true,
    canUpdateFoo: () => true,
    canDeleteFoo: (data:any) => data?.status < 1, // 按业务需求自己任意定义鉴权函数
  };
}
