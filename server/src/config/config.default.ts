import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1668171435832_3211',
  koa: {
    port: 7000,
  },

mysql :{
    
    host: 'localhost',
    user: 'lazyweb',
    database: 'lazyweb',
    password:"lazyweb",
    prefix:"l_"

// 其他配置
},
jwt: {
  secret: '12343ahs!sA#2', // fs.readFileSync('xxxxx.key')
  expiresIn: '1d', // https://github.com/vercel/ms
},
passport: {
  session: false,
},

cors: {
  origin:"*",
  allowMethods:"GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS",
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
},
oss: {
  // normal oss bucket
  client: {
    accessKeyId: '2SBVTeVOU7bJiJwm',
    accessKeySecret: 'kPgMeJ3ZU0YAFnmPwsbDzXMCiVkx36',
    bucket: 'd51kdtop',
    endpoint: 'oss-cn-shanghai.aliyuncs.com',
    timeout: '60s',
  },
},

} as MidwayConfig;



