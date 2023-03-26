import { IMiddleware, Inject } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { common } from '../lib/common';
import { DBService } from '../service/DB.service';
@Middleware()
export class UapiMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  dBService: DBService;
  
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
   const path=ctx.path
  
   //判断下有没有校验信息
   const body=ctx.request.body!=null?ctx.request.body:{}
   const query=ctx.request.query!=null?ctx.request.query:{}
   let param:any= Object.assign(body, query)
   const funName = path.replace("/uapi/", "");

      ctx.status = 200;
      let r:any={ success: true,data:[], msg: "用户api", "code": 0, path: path, "funName": funName }
    let api:any=await  this.dBService.query("select * from "+this.dBService.Prefixs["default"]+"api where path=?", [funName])
    if(api && api.length>0){
    let sql=api[0].sql_code;
    sql=sql.replace(/[\r\n]/g,"")
    sql=sql.replace(/[\n]/g,"")
   // console.log("sql数组",sql)
    let dbname=api[0].dbname
    try{
    
      for(let i in param)
      {
        let v=param[i]
        let reg = new RegExp("\{"+i+"\}", "g");
        sql=sql.replace(reg,v)
      }
    
    if(sql){
      
      
      if(dbname==null || dbname=="")
      dbname="default"
      let rs:any=[]
    
    let sql_array=sql.split(";")
   
      for(let i in sql_array)
      {
        if(common.trim(sql_array[i])!="")
        {
        
        let rs2=await  this.dBService.query(sql_array[i],[],dbname)
        rs.push(rs2)
      }
      }
      if(rs!=null && rs.length==1)
      {
        if(common.len(rs[0])==1 && param["limit"]!=null  && param["limit"]==1)
        r.data=rs[0][0]
        else
        r.data=rs[0]
        
      }
     
      else
      r.data=rs
     
    }

    }
    catch(e)
    {

    }
  }
r.param=param
      ctx.body = r;
      return

    
    };
  }
  ignore(ctx: Context): boolean {
    // 下面的路由将忽略此中间件
    if (  ctx.path.indexOf("/uapi/")!=0 )
    return true
  }
  static getName(): string {
    return 'report';
  }
}
