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
} as MidwayConfig;



