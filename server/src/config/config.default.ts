import { MidwayConfig } from '@midwayjs/core';
import { uploadWhiteList } from '@midwayjs/upload';
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
upload: {
  // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
  mode: 'file',
  // fileSize: string, 最大上传文件大小，默认为 10mb
  fileSize: '10mb',
  // whitelist: string[]，文件扩展名白名单
  whitelist: uploadWhiteList.concat([".txt",".xlsx",".xls",".pdf"]),
  // tmpdir: string，上传的文件临时存储路径
 // tmpdir: join(tmpdir(), 'midway-upload-files'),
  // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
  cleanTimeout: 5 * 60 * 1000,
  // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
  base64: false,
  // 仅在匹配路径到 /api/upload 的时候去解析 body 中的文件信息
  match: /\/api\/upload/,
},
} as MidwayConfig;



