import { Inject, Controller,  All, Body, Query, App} from '@midwayjs/decorator';
import { Context, Application } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { DBService } from '../service/DB.service';
import { DbopService } from '../service/Dbop.service';
//import * as JSON5 from 'json5'
//import { create } from 'jsondiffpatch';
import { JwtService } from '@midwayjs/jwt';
//import { JwtPassportMiddleware } from '../middleware/jwt.middleware';
import { common } from '../lib/common';
//import { Files, Fields } from '@midwayjs/decorator';
import { OSSService } from '@midwayjs/oss';

@Controller('/uapi')
export class APIController {


  @Inject()
  jwt: JwtService;

  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  ossService: OSSService;

  @Inject()
  dBService: DBService;

  @Inject()
  dbopService: DbopService;

  @App()
  app: Application;



@All('/*')
async common(@Body() params: {}, @Query() query: {}) {
const path=this.ctx.path

let param:any= Object.assign(params, query)
   const funName = path.replace("/uapi/", "");
let r:any={ success: true,param:param,data:[], msg: "用户api", "code": 0, path: path, "funName": funName }
   
    let api:any=await  this.dBService.query("select * from "+this.dBService.Prefixs["default"]+"api where path=?", [funName])
    if(api && api.length>0){
//执行js开始
    let js=api[0].js_code;
    let sql=api[0].sql_code;

   if(js!=null && js!="")
   {
      let rs:any=[]
    
    try{
      
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    let fun = new AsyncFunction('dbop',"param", js);
    rs=await fun(this.dbopService,param)
    }
    catch(e)
    {
     // console.log("执行js错误",e)
      return { "data": rs,code:1,msg:e.toString(),success:false}
    }
    //return { "data": rs,code:0,msg:JSON.stringify(rs),success:true}
    
    return rs;  
    }
//执行sql开始
else if(sql!=null && sql!="")
{
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
        if(rs2["errno"]!=null && rs2["errno"]>0)
        {
          r.success=false
          rs.code=1
          r.msg=rs2["sqlMessage"]
          return r
        }
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

//sql执行结束
}

  }

return r
}

}
