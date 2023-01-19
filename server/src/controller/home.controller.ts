import { Controller, Get,Inject} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import {common} from "../lib/common";
@Controller('/')
export class HomeController {
  @Inject()
  ctx: Context;

  @Get('/')
  async home(): Promise<string> {
 
  this.ctx.redirect('/index.html')
  return 'Hello Midwayjs!';
  }


  @Get('/pwd')
  async pwd(): Promise<string> {

 let password="123abc"
 let salt="FdnO1sJVktOhUgId"
 let pwd = common.pwd(password,salt)
  return pwd;
  }


  @Get('/pwdMD5')
  async pwdMD5(): Promise<string> {

 let password="123abc"
 let salt="893875"
 let pwd = common.pwdmd5(password,salt)
  return pwd+"\n"+"4d105abab3752b138b0890e723aa0a04";
  }



  @Get('/salt')
  async salt(): Promise<string> {

 let salt = common.salt()
  return salt;
  }

  @Get('/unixtime')
  async unix() {

 let unixtime = common.FormatDate()
  return unixtime;
  }


}
