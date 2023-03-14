// src/middleware/jwtcustom.middleware
//自定义jwt鉴权
import { Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';

@Middleware()
export class JwtcustomMiddleware {
  @Inject()
  jwtService: JwtService;

  public static getName(): string {
    return 'jwtcustom';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.headers['authorization']  &&   !ctx.cookies.get('token', { })  ) {
        throw new httpError.UnauthorizedError();
      }
let token=""
let scheme=null
      if(ctx.headers['authorization'] )
      {
      // 从 header 上获取校验信息
      const parts = ctx.get('authorization').trim().split(' ');

      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError();
      }

      scheme=parts[0]
      token=parts[1]

    }
    else
    {
      scheme=ctx.cookies.get('token', { })
      token=scheme
      //console.log("获取到的token",token)
    }


      if (token!=null  && token!="") {

        const d = new Date()
        let t=d.valueOf()
        t=t/1000
       
       // throw new Error("token验证失败");
        try {
          //jwt.verify方法验证token是否有效
          await this.jwtService.verify(token, {
            complete: true,
          });

          let user=  this.jwtService.decode(token)
          const exp= user["exp"]
         
          delete user["exp"]
          delete user["iat"]
          ctx.state.user=user
          ctx.admin=user
          if((exp-t)<3600*3 && (exp-t)>=0)
          {
         const newToken =await  this.jwtService.sign(user);
          //将新token放入Authorization中返回给前端
          ctx.set('token', newToken);
          ctx.cookies.set('token',newToken, { })
          }
        
        } catch (error) {
          //token过期 生成新的token
       // let user=  this.jwtService.decode(token)
        //const exp= user["exp"]
       // delete user["exp"]
      //  delete user["iat"]
        //  const newToken =await  this.jwtService.sign(user);
          //将新token放入Authorization中返回给前端
         // ctx.set('token', newToken);
        // console.log("token过期")
        // throw new httpError.UnauthorizedError();
        ctx.status=200
        ctx.set('token', "0");
        ctx.cookies.set('token',"", { })
        ctx.body='{"success":false,"message":"验证超时，请重新登录","token":"0"}'
        return
        }
        await next();
      }
      else{
        throw new httpError.UnauthorizedError();
      }
    };
  }

  // 配置忽略鉴权的路由地址
  public match(ctx: Context): boolean {
    let ignore = ctx.path.indexOf('/api/admin/login') !== -1;
    if(ignore==false && ctx.path.indexOf('/api/user/login') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/api/login/account') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/api/currentUser') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/unixtime') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/pwdMD5') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/SaveEdit') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/Find') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/Select') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/PageData') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/api/Delete') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/api/Upload') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/api/Find') !== -1)
    ignore=true
    if(ignore==false && ctx.path.indexOf('/api/ManageMenuList') !== -1)
    ignore=true
    
    return !ignore;
  }
}