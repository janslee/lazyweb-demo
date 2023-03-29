import { IMiddleware, Inject } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';

import { DBService } from '../service/DB.service';
@Middleware()
export class PowerMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  dBService: DBService;
  
  resolve() {
    return async (ctx: Context, next: NextFunction) => {

    

    const  admin=ctx.state.user;
    if(admin!=null)
    {
   //console.log('当前用户是',admin,"123")
    const role_id=admin.role_id
    const role_departments=admin.role_departments
    if(role_id>1)
    {
   const path=ctx.path
  
   //判断下有没有校验信息
   const body=ctx.request.body!=null?ctx.request.body:{}
   const query=ctx.request.query!=null?ctx.request.query:{}
   let param:any= Object.assign(body, query)
   let act = path.replace("/api/", "");
if(act=="Select" || act=="Find")
act="select"
if(act=="SaveEdit")
act="update"
if(act=="Delete")
act="delete"
 ctx.status = 200;
  let r:any={ success: true,data:[], msg: "权限判断", "code": 0, path: path }
if(param["table_name"]!=null || param["table"]!=null)
{
 
  let table=""
  if(param["table_name"]!=null)
  {
    table=param["table_name"]
    if(param["dbname"])
    {
      table=param["dbname"]+"|"+this.dBService.Prefixs["default"]+table
    }
    else
    {
      table="default|"+this.dBService.Prefixs["default"]+table
    }
  }

  let table_name=table+"|"+act

  let tables:any=await  this.dBService.query("select * from "+this.dBService.Prefixs["default"]+"department_table where department_id in (?) and table_name=?", [role_departments,table_name])

  if(tables==null || tables.length==0)
  {
    r.data=null
    r.code=9
    r.success=true
    r.msg="无权限访问"

  }

}

    if(r.code!=0)
    {
r.param=param
      ctx.body = r;
   
      return
    }
  }
    }

  await next();
    };
  }
  ignore(ctx: Context): boolean {
    // 下面的路由将忽略此中间件
    if (  ctx.path.indexOf("/api/Select")==0 ||  ctx.path.indexOf("/api/SaveEdit")==0 ||  ctx.path.indexOf("/api/Find")==0 ||  ctx.path.indexOf("/api/Delete")==0 )
    return false
    else
    return true
  }
  static getName(): string {
    return 'power';
  }
}
