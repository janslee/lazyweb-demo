import {  App, IMiddleware, Inject } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context ,Application} from '@midwayjs/koa';

import { DBService } from '../service/DB.service';
@Middleware()
export class PowerMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  dBService: DBService;
  

  @App()
  app: Application;



  resolve() {
    return async (ctx: Context, next: NextFunction) => {

      //ctx.request.body.cqa="测试了权限"

    const  admin=ctx.state.user;
    const path=ctx.path
    let act = path.replace("/api/", "");
    if(act=="Select" || act=="Find")
    act="select"
    if(act=="SaveEdit")
    act="update"
    if(act=="Delete")
    act="delete"
   //判断下有没有校验信息
   const body=ctx.request.body!=null?ctx.request.body:{}
   const query=ctx.request.query!=null?ctx.request.query:{}
   let param:any= Object.assign(body, query)
   
     
  let table=""
  if(param["table_name"]!=null)
  {
    table=param["table_name"]
    if(param["dbname"])
    {
      table=param["dbname"]+"|"+table
    }
    else
    {
      table="default|"+this.dBService.Prefixs["default"]+table
    }
  }
//获取字段信息
let columns=[]
if( act!="delete")
{
  const [table_schema,table_name]=table.split("|")

  const config= this.app.getConfig()
  let DataBaseConfig= config.mysql
  let dbname=DataBaseConfig.database
  if(table_schema!="default")
  {
    let dbrow:any=await this.dBService.query("select * from "+this.dBService.Prefixs["default"]+" where name=?",[table_schema])
    if(dbrow!=null && dbrow.length>0)
    {dbname=dbname[0]
      dbname=dbrow["dbname"]
    }
  }
  let sql = `SELECT * FROM information_schema.COLUMNS WHERE  table_schema =? and table_name=? `
let COLUMNS:any = await this.dBService.query(sql, [dbname,table_name],table_schema)

columns=COLUMNS.map((item, index, array) => {
  return item["COLUMN_NAME"];
})
}

    if(admin!=null)
    {

 if(table!="default|"+this.dBService.Prefixs["default"]+"admin" && columns.indexOf("admin_id")>=0)
{
 if(act=="update" && !param["id"])
 {
param["admin_id"]=admin.id
 }
 if(act=="select" )
 {
  ctx.request.body["where"]=" admin_id="+admin.id+" "
 }

}

if(table!="default|"+this.dBService.Prefixs["default"]+"admin" && columns.indexOf("department_id")>=0)
{
 if(act=="update" && !param["id"])
 {
param["department_id"]=admin.department_id
 }

 if(act=="select" )
 {
  if(admin.role_departments!=null && admin.role_departments.length>0)
  ctx.request.body["where"]=" (admin_id="+admin.id+" or department_id in ("+admin.role_departments.join(",")+")) "
 }

}

   //console.log('当前用户是',admin,"123")
    const role_id=admin.role_id
    const role_departments=admin.role_departments
    if(role_id>1)
    {
  
  

 ctx.status = 200;
  let r:any={ success: true,data:[], msg: "权限判断", "code": 0, path: path }

  if(param["table_name"]!=null || param["table"]!=null)
{



//判断此表格是否加了了鉴权
let table_power:any=await  this.dBService.query("select * from "+this.dBService.Prefixs["default"]+"table_power where table_name=?", [table])
if(table_power!=null && table_power.length>0)
{

let fields=body?.fields!=null && body?.fields!=""?body?.fields:"*"
const fields_array=fields.split(",")
let department_table:any=await  this.dBService.query("select * from "+this.dBService.Prefixs["default"]+"department_table where table_name=? and department_id in (?)", [table,role_departments])
if(department_table!=null && department_table.length>0)
{

  department_table=department_table[0]
  let select_columns=department_table.select_columns
 const select_columns_array=select_columns.split(",")
  let update_columns=department_table.update_columns
  const update_columns_array=update_columns.split(",")
  let is_delete=department_table.is_delete
if(act=="select" )
{
  if(fields=="*")
  fields=select_columns
else{
let new_fields=fields_array.filter((item:any)=>select_columns_array.indexOf(item)>=0)
fields=new_fields.join(",")
}
ctx.request.body.fields=fields
}

if(act=="update" )
{
  let body2={}
for(let i in body)
{
  if(update_columns_array.indexOf(i)>=0 || i=="id")
  body2[i]=body[i]
}
ctx.request.body=body2
}

if(act=="delete" )
{
if(is_delete==0)
{
  r.data=null
  r.code=8
  r.success=true
  r.msg="无删除权限"
  
}
}
}
else
{
  r.data=null
  r.code=8
  r.success=true
  r.msg="无权限"
  
}



}




}

    if(r.code!=0)
    {
r.param=param
      ctx.body = r;
   
      return
    }
  }
  else
  {
    if(act=="select" )
    {
     ctx.request.body["where"]=""
    }
  }
    }

  await next();
    };
  }
  ignore(ctx: Context): boolean {
    // 下面的路由将忽略此中间件
    if (  ctx.path.indexOf("/api/Select")==0 ||  ctx.path.indexOf("/api/SaveEdit")==0 ||  ctx.path.indexOf("/api/Find")==0 ||  ctx.path.indexOf("/api/Delete")==0 ||  ctx.path.indexOf("/api/test")==0 )
    return false
    else
    return true
  }
  static getName(): string {
    return 'power';
  }
}
