import { Inject, Controller, Get, Post, All, Body, Query, App, SetHeader} from '@midwayjs/decorator';
import { Context, Application } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { DBService } from '../service/DB.service';
import { DbopService } from '../service/Dbop.service';
import * as JSON5 from 'json5'
import { create } from 'jsondiffpatch';
import { JwtService } from '@midwayjs/jwt';
import { JwtPassportMiddleware } from '../middleware/jwt.middleware';
//import { JwtcustomMiddleware } from '../middleware/jwtcustom.middleware';

//import { PowerMiddleware } from '../middleware/power.middleware';
import { common } from '../lib/common';
import { Files, Fields } from '@midwayjs/decorator';
import { OSSService } from '@midwayjs/oss';

@Controller('/api')
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

  @All('/getEnv')
  async getEnv(@Body() params: {}, @Query() query: {}) {
    return this.app.getEnv()
  }
  @All('/getConfig')
  async getConfig(@Body() params: {}, @Query() query: {}) {
    let c = this.app.getApplicationContext();
    c.setAttr("aaa", "bb")

    return this.app.getConfig()
  }


  @All('/get_user')
  async getUser(@Body() params: {}, @Query() query: {}) {
    let uid = 12

    const user = await this.userService.getUser({ uid });
    let param = Object.assign(params, query)

    return { "param": param }
    return { success: true, message: 'OK', data: user, "params": params };
  }


  @All('/PageData')
  async PageData(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let where = "id =? "

    let rs = await this.dbopService.name("page").where(where, [param["page_id"]]).find()
  
    if(rs!=null && rs!="")
    {
     
      try{
     let json=JSON5.parse(rs["json"])
    // let schema=json["schema"]
     let page_menu_ids:any=await this.dbopService.name("menu").where("menu_type=?", ['ui']).limit(1000).select()

    
     if(page_menu_ids!=null)
     page_menu_ids=page_menu_ids.map((x:any)=>x["name"])
    
     const  admin=this.ctx.state.user;
    
      if(admin!=null )
      { 
        
      
        const role_id=admin.role_id
        if(role_id>1 && param["is_show"]!=null && param["is_show"]==1 && param["menu_id"]!=null && param["menu_id"]!="")
        {
        
        const role_departments=admin.role_departments
        let department_menu_ids:any=await  this.dBService.query("select * from "+this.dBService.Prefixs["default"]+"department_menu where department_id in (?) ", [role_departments])
        if(department_menu_ids!=null)
        department_menu_ids=department_menu_ids.map((x:any)=>x["menu_id"])

       let power_menu_ids:any=await  this.dbopService.name("menu").where("id in (?)", [department_menu_ids]).select()
       if(param["menu_id"])
       power_menu_ids=common.findRecordsWithChildren(power_menu_ids,param["menu_id"])

       power_menu_ids=power_menu_ids.map((x:any)=>x["name"])
   //   console.log("需要判断权限的ui",page_menu_ids)
       if(page_menu_ids!=null && page_menu_ids.length>0 )
       {
    
        common.fromJsonPower(json,page_menu_ids,power_menu_ids)
       }
   
    //  console.log("处理后的元素",JSON.stringify(json))
      }
      }
  
    // json["schema"]=schema
      rs["json"]=JSON.stringify(json)
    }
    catch(e)
    {
console.log("json权限错误",e.message)
    }
    }
    return { success: true, msg: '获取页面数据成功', code: 0, "data": rs };
  }


  @All('/Find')
  async Find(@Body() params: {}, @Query() query: {}) {
    let param:any = Object.assign(params, query)
    let table="page"
    let dbname=param?.dbname
if(dbname==null || dbname=="")
dbname="default"

    let id=param?.id
    delete param["id"]

    let where = "id =? "
let rs=null
    if(param?.table_name!=null)
    {
    table=param?.table_name
     rs = await this.dbopService.db(dbname).name(table).where(where, [id]).find()
  }
  if(param?.table!=null)
  {
    table=param?.table
    rs = await this.dbopService.db(dbname).table(table).where(where, [id]).find()
  }
    if(rs!=null && table=="admin")
    {
      rs["password"]=""
      delete rs["login_salt"]
    }
    return { success: true, msg: 'OK', code: 0, "data": rs };
  }


  @All('/Select' )
  async Select(@Body() params: {}, @Query() query: {}) {
    let param:any = Object.assign(params, query)
    let table="page"
    if(param?.table_name!=null)
    table=param?.table_name
    if(param?.table!=null)
    table=param?.table
let dbname=param?.dbname
if(dbname==null || dbname=="")
dbname="default"
///api/Select?table_name=department&pageSize=100&param_pid_eq=0
    let where = "id >? "
    let p=["0"]
    for(let i in param)
    {
      if(param[i]!=null && param[i]!="" && i.indexOf("param_")>=0 )
      {
        let ps=i.split("_")
        if(ps.length!=3)
        continue
        let act="="
        switch (ps[2]) {
          case "gt":
            act = ">";
            break; /* 可选的 */
          case "gte":
            act = ">=";
            break;
          case "lt":
            act = "<";
            break;
          case "lte":
            act = "<=";
            break;
          case "eq":
            act = "=";
            break;
          case "neq":
            act = "<>";
            break;
          default: /* 可选的 */
            act = "="
        }
        where+=` and ${ps[1]} ${act}? `
        p.push(param[i])
      }
    }
   

    //console.log("filters",param?.filters)
  if(param?.filters!=null)
  {
    const filters=param?.filters
    for(let i in filters)
    {
      if(filters[i]=="")
      continue
      where+=` and ${i} in (?) `
      p.push(filters[i])
    }
  }

  if(param?.search!=null)
  {
    let search=param?.search

    
    for(let i in search)
    {
      if(search[i]=="")
      continue
     
      if(i.indexOf("min:")>=0)
      {
      where+=` and ${i.replace("min:","")} >=? `
      p.push(search[i])
    }
    else if(i.indexOf("max:")>=0)
    {
      where+=` and ${i.replace("max:","")} <=? `
      p.push(search[i])
    }
    else if((i.indexOf("date")>=0 || i.indexOf("time")>=0) && typeof(search[i])=="object")
    {
      where+=` and ${i}>=? and  ${i}<=? `
      p.push(search[i][0])
      p.push((parseInt(search[i][1])+86400)+"")
    }
    else if(i.indexOf("select:")>=0)
    {
      where+=` and ${i.replace("select:","")} =? `
      p.push(search[i])
    }
    else{
      where+=` and ${i} like ? `
      p.push("%%"+search[i]+"%%")
    }


    }
   // console.log("搜索条件是:",where)
  }

    let pageSize=12
    let page=1
    if(param?.page!=null)
    page=param?.page
    if(param?.pageSize!=null)
     pageSize=param?.pageSize
     let order ="id desc"
     if(param?.field!=null && param?.field!="")
     {
      order =param?.field
      if(param?.order!=null && param?.order!="")
      order+=" "+param?.order
      order=order.replace("end","")
      
     }
    // console.log("where",where)
    // console.log("p",p)
     let rs =null
     let total=0
     if(param?.table_name!=null)
     {
     rs = await this.dbopService.db(dbname).name(table).pagesize(pageSize).page(page).order(order).where(where, p).select()
    total=await this.dbopService.db(dbname).name(table).where(where, p).count("*")
  }

  if(param?.table!=null)
  {
  rs = await this.dbopService.db(dbname).table(table).pagesize(pageSize).page(page).order(order).where(where, p).select()
 total=await this.dbopService.db(dbname).table(table).where(where, p).count("*")
}
let data=[]
if(rs!=null && table=="admin")
{
  for(let i in rs)
  {
    let row=rs[i]
     row["password"]=""
    delete row["login_salt"]
    data.push(row)
  }
 
}
else
data=rs
    return { success: true, msg: '获取数据成功', code: 0, "data": data,total:total };
  }


@All('/ManageMenuList')
async ManageMenuList(@Body() params: {}, @Query() query: {})
{
  let MenuDb:any=await this.dbopService.name("menu").pagesize(1000).page(1).order("sort asc").select()
  MenuDb=MenuDb.map((item:any)=>{
    item["label"]=item["title"]
    item["value"]=item["id"]
    return item
  })
  let WebMenu=[]
  common.GenTree(WebMenu,MenuDb,"children")
                                 
  return { success: true, msg: '加载数据成功', code: 0, "data":WebMenu};
}


@All('/TopMenuList')
async TopMenuList(@Body() params: {}, @Query() query: {})
{
  let MenuDb:any=await this.dbopService.name("menu").where("menu_type=? or menu_type=?",['menu_dir','tab']).pagesize(1000).page(1).order("sort asc").select()
  let  WebMenu=MenuDb.map((item:any)=>{
 
    item["label"]=item["title"]
    item["value"]=item["id"]
    return item
    })
  let WebMenu2=[]
  common.GenTree(WebMenu2,WebMenu,"children")


  WebMenu2.splice(0, 0, { label: "无上级", value: -1 });                  
  return { success: true, msg: '加载数据成功', code: 0, "data":WebMenu2};
}
@All('/ManageTableList')
async ManageTableList(@Body() params: {}, @Query() query: {})
{
 const config= this.app.getConfig()
 let DataBaseConfig= config.mysql
  let sql = `SELECT * FROM information_schema.tables where TABLE_TYPE="BASE TABLE" and table_schema =? limit 300`
  let tablesList = await this.dbopService.db(params["db"]).query(sql, [DataBaseConfig.database])
 
   sql = `SELECT * FROM information_schema.views where table_schema =? limit 300`
  let viewList = await this.dbopService.db(params["db"]).query(sql, [DataBaseConfig.database])
  tablesList=tablesList.concat(viewList)
let data=[]


  for(let i in tablesList)
  {
    const item=tablesList[i]
data.push({"title":"default|"+item["TABLE_NAME"]+"|select","key": item["key"]="default|"+item["TABLE_NAME"]+"|select"})
data.push({"title":"default|"+item["TABLE_NAME"]+"|update","key": item["key"]="default|"+item["TABLE_NAME"]+"|update"})
data.push({"title":"default|"+item["TABLE_NAME"]+"|delete","key": item["key"]="default|"+item["TABLE_NAME"]+"|delete"})
}
  //获取其他库信息
  let dbs:any=await this.dbopService.name("db").where("status=?",[1]).limit(100).select()
 for(let i in dbs)
 {
   sql = `SELECT * FROM information_schema.tables where TABLE_TYPE="BASE TABLE" and table_schema =? limit 300`
  let tablesList2 = await this.dbopService.db(dbs[i]["name"]).query(sql, [dbs[i]["dbname"]])
 
   sql = `SELECT * FROM information_schema.views where table_schema =? limit 300`
  viewList = await this.dbopService.db(dbs[i]["name"]).query(sql, [dbs[i]["dbname"]])
  tablesList2=tablesList2.concat(viewList)



  for(let i in tablesList2)
  {
    const item=tablesList2[i]
data.push({"title":"default|"+item["TABLE_NAME"]+"|select","key": item["key"]="default|"+item["TABLE_NAME"]+"|select"})
data.push({"title":"default|"+item["TABLE_NAME"]+"|update","key": item["key"]="default|"+item["TABLE_NAME"]+"|update"})
data.push({"title":"default|"+item["TABLE_NAME"]+"|delete","key": item["key"]="default|"+item["TABLE_NAME"]+"|delete"})
}


 }

  
  return { success: true, msg: '加载数据成功', code: 0, "data":data};
}

@All('/ManageDepList')
async ManageDepList(@Body() params: {}, @Query() query: {})
{
  let MenuDb:any=await this.dbopService.name("department").pagesize(1000).page(1).order("sort asc").select()
  MenuDb=MenuDb.map((item:any)=>{
    item["label"]=item["department_name"]
    item["value"]=item["id"]
    return item
  })
  let WebMenu=[]
  common.GenTreePid0(WebMenu,MenuDb,"children")
                                 
  return { success: true, msg: '加载数据成功', code: 0, "data":WebMenu};
}


//获取某个订单权限
@All('/GetManageMenu')
async GetManageMenu(@Body() params: {}, @Query() query: {})
{
  let param:any = Object.assign(params, query)


let role_id=param?.id

//let role=await this.dbopService.name("role").where("id>=?",[role_id]).select()

let rs:any=[]
if(role_id>1)
 rs=await this.dbopService.name("role_menu").where("role_id=?",[role_id]).select()
else
rs=await this.dbopService.name("role_menu").where("role_id>=?",[0]).select()

 let menu_ids=[]
if(rs !=null && common.isArray(rs))
{
for(let i in rs)
{
  menu_ids.push(rs[i].menu_id)
}
}
let data={"role_menu":menu_ids}
return { success: true, msg: '加载数据成功', code: 0,data:data };
}



//获取某个部门的权限
@All('/GetDepMenu')
async GetDepMenu(@Body() params: {}, @Query() query: {})
{
  let param:any = Object.assign(params, query)

let department_id=param?.id

//let role=await this.dbopService.name("role").where("id>=?",[role_id]).select()

let rs:any=[]
if(department_id>0)
 rs=await this.dbopService.name("department_menu").where("department_id=?",[department_id]).limit(1000).select()
else
rs=await this.dbopService.name("department_menu").where("department_id>=?",[0]).limit(1000).select()
//console.log("对应",rs)
 let menu_ids=[]
if(rs !=null && common.isArray(rs))
{
for(let i in rs)
{
  if(rs[i].menu_id!=null)
  menu_ids.push(rs[i].menu_id)
}
}
let data={"dep_menus":menu_ids}
return { success: true, msg: '加载数据成功', code: 0,data:data };
}

//获取某个部门的表格权限
@All('/GetDepTablePower')
async GetDepTablePower(@Body() params: {}, @Query() query: {})
{
  let param:any = Object.assign(params, query)

let department_id=param?.id

//let role=await this.dbopService.name("role").where("id>=?",[role_id]).select()

let rs:any=[]
if(department_id>0)
 rs=await this.dbopService.name("department_table").where("department_id=?",[department_id]).limit(1000).select()
else
rs=await this.dbopService.name("department_table").where("department_id>=?",[0]).limit(1000).select()
//console.log("对应",rs)
 let menu_ids=[]
if(rs !=null && common.isArray(rs))
{
for(let i in rs)
{
  if(rs[i].table_name!=null)
  menu_ids.push(rs[i].table_name)
}
}

let data={"dep_tables":menu_ids}
return { success: true, msg: '加载数据成功', code: 0,data:data };
}


//获取某个部门的接口权限
@All('/GetDepApiPower')
async GetDepApiPower(@Body() params: {}, @Query() query: {})
{
  let param:any = Object.assign(params, query)

let department_id=param?.id

//let role=await this.dbopService.name("role").where("id>=?",[role_id]).select()

let rs:any=[]
if(department_id>0)
 rs=await this.dbopService.name("department_api").where("department_id=?",[department_id]).limit(1000).select()
else
rs=await this.dbopService.name("department_api").where("department_id>=?",[0]).limit(1000).select()
//console.log("对应",rs)
 let menu_ids=[]
if(rs !=null && common.isArray(rs))
{
for(let i in rs)
{
  if(rs[i].path!=null)
  menu_ids.push(rs[i].path)
}
}

let data={"dep_apis":menu_ids}
return { success: true, msg: '加载数据成功', code: 0,data:data };
}

//获取某个角色的所有部门
@All('/GetRoleDepartment')
async GetRoleDepartment(@Body() params: {}, @Query() query: {})
{
  let param:any = Object.assign(params, query)
let role_id=param?.id

let data:any={}
if(role_id!=null && role_id>0)
data=await this.dbopService.name("role").where("id>=?",[role_id]).find()
let rs:any=[]
if(role_id>1)
 rs=await this.dbopService.name("role_department").where("role_id=?",[role_id]).select()
else
rs=await this.dbopService.name("role_department").where("role_id>=?",[0]).select()

 let department_ids=[]
if(rs !=null && common.isArray(rs))
{
for(let i in rs)
{
  department_ids.push(rs[i].department_id)
}
}

data["role_department"]=department_ids
return { success: true, msg: '加载数据成功', code: 0,data:data };
}

//保存角色订单权限
@All('/SaveManageMenu')
async SaveManageMenu(@Body() params: {}, @Query() query: {})
{
let admin=this.ctx.state.user;
return { success: true, msg: '加载数据成功', code: 0, "data":admin};
}

  @All('/SaveEdit')
  async SaveEdit(@Body() params: {}, @Query() query: {}) {
    let param:any= Object.assign(params, query)
    let dbname=param?.dbname
if(dbname==null || dbname=="")
dbname="default"
    let where = "id =? "
    let id=param["id"]

    delete param["id"]
    
    let table= param["table"]
    delete param["table"]
let table_name=param["table_name"]
delete param["table_name"]
let rs=null
if(id!=null)
{
if(table!=null && table!="")
     rs = await this.dbopService.db(dbname).table(table).where(where, [id]).update(params)
     if(table_name!=null && table_name!="")
     rs = await this.dbopService.db(dbname).name(table_name).where(where, [id]).update(params) 
    } 
   else
   {
    if(table!=null && table!="")
     rs = await this.dbopService.db(dbname).table(table).insert(params)
     if(table_name!=null && table_name!="")
     rs = await this.dbopService.db(dbname).name(table_name).insert(params) 
   }
   
     return { success: true, msg: '保存数据成功', code: 0, "data": rs };
  }

  @All('/SaveRoleMenu')
  async SaveRoleMenu(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let role_menu=param["role_menu"]
    let role_id=param["id"]
    if(role_menu==null || role_menu=="")
    {
      return { success: true, msg: '没有需要保存的数据', code: 1, "data": {} };
    }
    let role_menu_arr=role_menu.split(",")
    console.log("角色id",role_id,role_menu_arr)
    await this.dbopService.name("role_menu").where("role_id=?", [role_id]).delete()
    for(let i in role_menu_arr)
    {
      let menu_id=role_menu_arr[i]
      await this.dbopService.name("role_menu").insert({role_id:role_id,menu_id:menu_id,add_time:common.unixtime10()})
    }
    
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }

  @All('/SaveDepMenu')
  async SaveDepMenu(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let dep_menus=param["dep_menus"]
    let department_id=param["id"]
    if(dep_menus==null || dep_menus=="")
    {
      return { success: true, msg: '没有需要保存的数据', code: 1, "data": {} };
    }
    let role_menu_arr=dep_menus.split(",")
    //console.log("保存部门id",department_id,role_menu_arr)
    await this.dbopService.name("department_menu").where("department_id=?", [department_id]).delete()
    for(let i in role_menu_arr)
    {
      let menu_id=role_menu_arr[i]
      await this.dbopService.name("department_menu").insert({department_id:department_id,menu_id:menu_id,add_time:common.unixtime10()})
    }
    
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }



  @All('/SaveApiSql')
  async SaveApiSql(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
  
    let id=param["id"]
    
      await this.dbopService.name("api").where("id=?",[id]).update({dbname:param["dbname"],sql_code:param["sql_code"],upd_time:common.unixtime10()})
    
    
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }
  
  @All('/SaveApiJs')
  async SaveApiJs(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
  
    let id=param["id"]
    
      await this.dbopService.name("api").where("id=?",[id]).update({js_code:param["js_code"],upd_time:common.unixtime10()})
    
    
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }


  @All('/SaveDepTablePower')
  async SaveDepTablePower(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let dep_tables=param["dep_tables"]
    let department_id=param["id"]
    await this.dbopService.name("department_table").where("department_id=?", [department_id]).delete()
    if(dep_tables==null || dep_tables=="")
    {
     return { success: true, msg: '已清空', code: 0, "data": {} };
    }
    let role_menu_arr=dep_tables.split(",")
    //console.log("保存部门id",department_id,role_menu_arr)
    
    for(let i in role_menu_arr)
    {
      let table_name=role_menu_arr[i]
      await this.dbopService.name("department_table").insert({department_id:department_id,table_name:table_name,add_time:common.unixtime10()})
    }
    
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }

  @All('/SaveDepApiPower')
  async SaveDepApiPower(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let dep_apis=param["dep_apis"]
    let department_id=param["id"]
    await this.dbopService.name("department_api").where("department_id=?", [department_id]).delete()
    if(dep_apis==null || dep_apis=="")
    {
     return { success: true, msg: '已清空', code: 0, "data": {} };
    }
    let role_menu_arr=dep_apis.split(",")
    //console.log("保存部门id",department_id,role_menu_arr)
    
    for(let i in role_menu_arr)
    {
      let path=role_menu_arr[i]
      await this.dbopService.name("department_api").insert({department_id:department_id,path:path,add_time:common.unixtime10()})
    }
    
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }

  @All('/SaveRoleDepartMent')
  async SaveRoleDepartMent(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let role_menu=param["role_department"]
  
    let role_id=param["id"]
    const name=param["name"]
    if(name==null || name=="")
    {
      return { success: true, msg: '角色名称不能为空', code: 1, "data": {} };
    }
    if(role_id==null || role_id=="")
    {
      role_id=await this.dbopService.name("role").insert({name:name,"add_time":common.unixtime10()})
    }
    else
    {
      await this.dbopService.name("role").where("id=?", [role_id]).update({name:name,upd_time:common.unixtime10()})
    }
    
    
    if(role_menu==null || role_menu=="")
    {
      return { success: true, msg: '保存成功', code: 0, "data": {} };
    }
    let role_menu_arr=role_menu.split(",")
    role_menu_arr=common.uniqueArray(role_menu_arr)
    //console.log("角色id",role_id,role_menu_arr)
    await this.dbopService.name("role_department").where("role_id=?", [role_id]).delete()
    for(let i in role_menu_arr)
    {
      let department_id=role_menu_arr[i]
      await this.dbopService.name("role_department").insert({role_id:role_id,department_id:department_id,add_time:common.unixtime10()})
    }
     return { success: true, msg: '保存数据成功', code: 0, "data": {} };
  }
  

  @All('/Delete')
  async Delete(@Body() params: {}, @Query() query: {}) {
    let param:any = Object.assign(params, query)
    let dbname=param?.dbname
if(dbname==null || dbname=="")
dbname="default"
    let where = "id in (?) "
    let ids=param["ids"]
    let rs =null
    if(param["table"]!=null)
     rs = await this.dbopService.db(dbname).table(param["table"]).where(where, [ids]).delete()
     if(param["table_name"]!=null)
     rs = await this.dbopService.db(dbname).name(param["table_name"]).where(where, [ids]).delete()
    return { success: true, msg: 'OK', code: 0, "data": rs };
  }

  @All('/sql')
  async sql(@Body() params: {}, @Query() query: {}) {
    console.log("dBService是", this.dBService)
    let rs = await this.dBService.query("select * from l_admin")
    return { "rs": rs }
  }


  @All('/sql3')
  async sql3(@Body() params: {}, @Query() query: {}) {
  //  console.log("dBService是", this.dBService)
    let rs = await this.dbopService.db("platform").name("article").select()
    let admin = await this.dbopService.name("admin").select()
    return { "rs": rs ,"admn":admin}
  }


  @All('/TestSql')
  async TestSql(@Body() params: {}, @Query() query: {}) {
  //  console.log("dBService是", this.dBService)
  let param:any= Object.assign(params, query)
  let sql=param["sql_code"]
  let p={}
  if(param?.params!=null && param?.params!="")
  {
    try{
     p=JSON.parse(param["params"])
   // console.log("测试参数",p)
    for(let i in p)
    {
      let v=p[i]
      let reg = new RegExp("\{"+i+"\}", "g");
      sql=sql.replace(reg,v)
    }
  }
  catch(e)
  {
  console.log("转换参数错误")
  }
  }


  let dbname=param?.dbname
  if(dbname==null || dbname=="")
  dbname="default"
  let rs:any=[]
  sql=sql.replace(/[\r\n]/g,"")
  sql=sql.replace(/[\n]/g,"")
let sql_array=sql.split(";")

  for(let i in sql_array)
  {
    if(common.trim(sql_array[i])!="")
    {
    let rs2 = await this.dbopService.db(dbname).query(sql_array[i])
    if(rs2["errno"]!=null && rs2["errno"]>0)
    {
      let r:any={}
      r.success=false
      r.code=1
      r.sql=sql_array[i]
      r.msg=rs2["sqlMessage"]
      return r
    }
    rs.push(rs2)
  }
  }

  if(rs!=null && rs.length==1)
  {
    if(common.len(rs[0])==1 && p["limit"]!=null  && p["limit"]==1)
    rs=rs[0][0]
    else
   rs=rs[0]
    
  }
 

    
    return { "data": rs,code:0,msg:JSON.stringify(rs),success:true}
  }


  @All('/TestJs')
  async TestJs(@Body() params: {}, @Query() query: {}) {
  //  console.log("dBService是", this.dBService)
  let param:any= Object.assign(params, query)
  let js=param["js_code"]
  let p={}
  if(param?.params!=null && param?.params!="")
  {
    try{
    p=JSON.parse(param["params"])
   // console.log("测试参数",p)
    for(let i in p)
    {
      let v=p[i]
      let reg = new RegExp("\{"+i+"\}", "g");
      js=js.replace(reg,v)
    }
  }
  catch(e)
  {
  console.log("转换参数错误")
  }
  }
  let dbname=param?.dbname
  if(dbname==null || dbname=="")
  dbname="default"
  let rs:any=[]

try{
  
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
let fun = new AsyncFunction('dbop',"param", js);
rs=await fun(this.dbopService,p)
}
catch(e)
{
 // console.log("执行js错误",e)
  return { "data": rs,code:1,msg:e.toString(),success:false}
}
//return { "data": rs,code:0,msg:JSON.stringify(rs),success:true}

return rs;  
}

  @All('/TestDb')
  async TestDb(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
   
    const rs =await this.dBService.addPool(param)
   
return rs

  }
 

  @All('/Upload')
  async Upload(@Files() files, @Fields() fields) {

    /*
{
    "files": [
        {
            "filename": "自定义渲染.png",
            "data": "C:\\Users\\36101\\AppData\\Local\\Temp\\midway-upload-files\\upload_1674465300905.0.6497113851801981.0.png",
            "fieldName": "",
            "mimeType": "image/png",
            "_ext": ".png"
        }
    ],
    "fields": {
        "aaa": "222",
        "bbb": "333"
    }
}

    */
let NewFiles=[]   
for(let i in files)
{
  let row=files[i]
  const localFile = row["data"];
  let NewFile="images/"+common.GenUUID(row["filename"])
  await this.ossService.put(NewFile, localFile);
  NewFiles.push(NewFile)
}
//SetHeader('Access-Control-Allow-Credentials', 'true')
SetHeader('Access-Control-Allow-Origin', '*');
SetHeader('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type');
SetHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
    return {
      "data":NewFiles,
      success: true,
     code:0,
     msg:"上传成功"
    }
    
  }


  @All('/sql2')
  async sql2(@Body() params: {}, @Query() query: {}) {
    let where = "id in (?) "
    let rs = await this.dbopService.name("admin").where(where, [[1, 4, 7, 29]]).limit(100).select()
    return { "rs": rs }
  }

  @All('/SaveDbJson')
  async SaveDbJson(@Body() params: {}, @Query() query: {}) {

    const pool = params["pool"] ? params["pool"] : "default"
    const dbname = params["dbname"] ? params["dbname"] : "lazyweb"

    let tableDict = params["tableDict"] ? params["tableDict"] : ""
    let linkDict = params["linkDict"] ? params["linkDict"] : ""
    let rs = { "code": -1, "status": false }
    if (tableDict == "" || linkDict == "")

      return rs
    tableDict = JSON5.parse(tableDict)
    linkDict = JSON5.parse(linkDict)
    let tablesNew = {}
    for (let i in tableDict) {
      let row = tableDict[i]
      //delete row["id"]
      delete row["x"]
      delete row["y"]
    
      for (let j in row["fields"]) {
      //  delete row["fields"][j]["id"]
        delete row["fields"][j]["theme"]
        row["fields"][j]["type"] = row["fields"][j]["type"].toLowerCase()
        let len = row["fields"][j]["len"]
        if (typeof (len) != "undefined" && len != "") {
          row["fields"][j]["type"] += "(" + len + ")"
        }
        delete row["fields"][j]["len"]
        if (row["fields"][j]["dbdefault"] == "null")
          row["fields"][j]["dbdefault"] = null
        if (typeof (row["fields"][j]["dbdefault"]) == "undefined")
          row["fields"][j]["dbdefault"] = ""
        // if(typeof(row["fields"][j]["dbdefault"])=="undefined" || row["fields"][j]["dbdefault"]=="")
        // row["fields"][j]["dbdefault"]=null
      }
      tablesNew[row["id"]]=row
    }
  
  
    let refsNew = {}
    for (let i in linkDict) {
      let row = linkDict[i]
    //  delete row["id"]
      refsNew[row["id"]]=row
    }


    /** 获取表结构row */

    let sql = `SELECT * FROM information_schema.tables where TABLE_TYPE="BASE TABLE" and table_schema =? limit 300`
    let tablesList = await this.dbopService.db(pool).query(sql, [dbname])
    sql = `SELECT * FROM information_schema.COLUMNS WHERE  table_schema =? `
    let COLUMNS = await this.dbopService.db(pool).query(sql, [dbname])

    //获取所有的外键信息
    sql = `SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_COLUMN_NAME is not null and CONSTRAINT_NAME<>'PRIMARY' and constraint_schema=? `
    let foreigns = await this.dbopService.db(pool).query(sql, [dbname])
    let refs = {}
    foreigns.map((item, index, array) => {
      let row = {"id": item["TABLE_NAME"]+"_"+item["COLUMN_NAME"] ,"name":item["COLUMN_NAME"]  }
      let endpoints = []
      endpoints.push({ "id": item["TABLE_NAME"], "relation": "*" , "fieldId": item["COLUMN_NAME"]})
      endpoints.push({ "id": item["REFERENCED_TABLE_NAME"], "relation": "1","fieldId": item["REFERENCED_COLUMN_NAME"] })
      row["endpoints"] = endpoints
      refs[row["id"]]=row
    
    })
    let tables={}

     tablesList.map((item, index, array) => {
      // return array[index]; //用这种方法也可以获取到当前处理的元素
      let row = {"id": item["TABLE_NAME"], "name": item["TABLE_NAME"]  }
      //row["engine"]=item["ENGINE"]
      //row["create_time"]=item["CREATE_TIME"]
      //if(typeof(item["TABLE_COMMENT"])!="undefined" && item["TABLE_COMMENT"]!=null && item["TABLE_COMMENT"]!="")
      if(typeof(item["TABLE_COMMENT"])!="undefined")
      row["note"] = item["TABLE_COMMENT"]
      let columnsCurrentTable = COLUMNS.filter((column_item, index2, array2) => {
        return column_item["TABLE_NAME"] == item["TABLE_NAME"]


      });
      let columns={}
      columnsCurrentTable.map((column_item, index2, array2) => {

        let columnrow = {"id": column_item["COLUMN_NAME"], "name": column_item["COLUMN_NAME"] }
        columnrow["dbdefault"] = column_item["COLUMN_DEFAULT"]
        if (column_item["EXTRA"] == "auto_increment")
          columnrow["increment"] = true
        let COLUMN_TYPE = column_item["COLUMN_TYPE"]
        if (COLUMN_TYPE != null) {
          let type_name = COLUMN_TYPE

          if(type_name.indexOf("unsigned") > 0)
{
  columnrow["unsigned"] = true
}

          if (type_name.indexOf(" ") > 0)
            type_name = COLUMN_TYPE.substring(0, COLUMN_TYPE.indexOf(" "))
          columnrow["type"] = { "type_name": type_name, "args": null }
          columnrow["type"] = type_name
        }
        columnrow["note"] = column_item["COLUMN_COMMENT"]
        if (column_item["COLUMN_KEY"] == "PRI")
          columnrow["pk"] = true


          if (column_item["COLUMN_KEY"] == "UNI")
          columnrow["unique"] = true

        if (column_item["IS_NULLABLE"] != "YES")
          columnrow["not_null"] = true
        else
          columnrow["not_null"] = false
     
        columns[column_item["COLUMN_NAME"]]=columnrow
      });
      row["fields"] = columns
     tables[item["TABLE_NAME"]]=row
   
    });
   // console.log("数据",tables)
    /** 获取表结构结束 */
    
    //比较表结构
   //console.log("原始",tables["l_cqa"])
   //console.log("新的",tablesNew["l_cqa"])
  
    let jsondiffpatch = create({

      arrays: {
        // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
        detectMove: false,
        // default false, the value of items moved is not included in deltas
        includeValueOnMove: false
      },

      cloneDiffValues: false /* default false. if true, values in the obtained delta will be cloned
    (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
    instead of true, a function can be specified here to provide a custom clone(value)
    */
    });

    var TableDiff = jsondiffpatch.diff(tables,tablesNew );

console.log("老",tables["newtable"])
console.log("新",tablesNew["newtable"])
    if (typeof (TableDiff) != "undefined") {
      console.log("表格不同", TableDiff)
   
for(let i in TableDiff)
{
let item=TableDiff[i]
if(typeof(item.length)=="undefined") //修改 
{

if(typeof(item["note"])!="undefined")
{
sql="ALTER TABLE `"+i+"` COMMENT = '"+item["note"][1]+"'"
console.log("修改注释",sql)
await this.dbopService.db(pool).query(sql, [])
}

if(typeof(item["name"])!="undefined")
{
sql="rename table "+item["name"][0]+" to "+item["name"][1]
console.log("修改表名",sql)
await this.dbopService.db(pool).query(sql, [])
}
if(typeof(item["fields"])!="undefined")
{

  for(let j in item["fields"])
  {

    //删除字段
    if(typeof(item["fields"][j].length)!="undefined" && item["fields"][j].length==3) //新增
    {
      let CurentFiled=item["fields"][j][0]
      sql="alter table `"+i+"` drop  `"+CurentFiled["name"]+"`"

console.log("删除字段",sql)
      await this.dbopService.db(pool).query(sql, [])
    }
//添加字段
    if(typeof(item["fields"][j].length)!="undefined" && item["fields"][j].length==1) //新增
    {
      let CurentFiled=item["fields"][j][0]
      sql="alter table `"+i+"` add column  "+CurentFiled["name"]+"  "+CurentFiled["type"]
      if(CurentFiled["not_null"]==true)
sql+=" not null "
if(CurentFiled["increment"]==true)
sql+=" AUTO_INCREMENT "
if(CurentFiled["pk"]==true)
sql+=" PRIMARY KEY "

if(CurentFiled["unsigned"]==true)
sql+=" unsigned "

if(typeof(CurentFiled["dbdefault"])!="undefined" && CurentFiled["dbdefault"]!=null && CurentFiled["dbdefault"]!="")
{
  sql+=" default "+CurentFiled["dbdefault"].toString()+" "
}
if(typeof(CurentFiled["note"])!="undefined" && CurentFiled["note"]!=null && CurentFiled["note"]!="")
{
  sql+=" COMMENT "+CurentFiled["note"].toString()+" "
}

sql+=" COMMENT '"+CurentFiled["note"].toString()+"' "
console.log("新增字段sql",sql)
      await this.dbopService.db(pool).query(sql, [])
    }

    if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["type"])!="undefined")
    {
    sql="alter table `"+i+"` modify column  "+j+"  "+item["fields"][j]["type"][1]
   
if(tablesNew[i]["fields"][j]["unsigned"]==true)
sql+=" unsigned "
   
    if(typeof(tablesNew[i]["fields"][j]["dbdefault"]!="undefined"))
    {
 sql+=" default '"+tablesNew[i]["fields"][j]["dbdefault"]+"'"
    }
    if(typeof(tablesNew[i]["fields"][j]["note"]!="undefined"))
    {
 sql+=" COMMENT '"+tablesNew[i]["fields"][j]["note"]+"'"
    }
    console.log("修改类型",sql)
    await this.dbopService.db(pool).query(sql, [])
  }

  if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["dbdefault"])!="undefined")
    {
    sql="alter table `"+i+"` alter  column  "+j+"  set default '"+item["fields"][j]["dbdefault"][1]+"'"
    console.log("修改默认值",sql)
    await this.dbopService.db(pool).query(sql, [])
  }

  if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["note"])!="undefined")
  {
    sql="alter table `"+i+"` MODIFY column  "+j+"  "+tablesNew[i]["fields"][j]["type"]+"   COMMENT '"+item["fields"][j]["note"][1]+"'"
    if(typeof(tablesNew[i]["fields"][j]["dbdefault"])!="undefined")
    sql+=" default '"+tablesNew[i]["fields"][j]["dbdefault"]+"'"
    console.log("修改注释",sql)
  await this.dbopService.db(pool).query(sql, [])
}
if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["unsigned"])!="undefined")
{
  let unsigned=false
  if(item["fields"][j]["unsigned"].length==1 && item["fields"][j]["unsigned"][0]==true)
  unsigned=true
  if(item["fields"][j]["unsigned"].length==2 && item["fields"][j]["unsigned"][1]==true)
  unsigned=true

  if(unsigned)
  sql="alter table `"+i+"` MODIFY column  "+j+"  "+tablesNew[i]["fields"][j]["type"]+" unsigned  COMMENT '"+tablesNew[i]["fields"][j]["note"]+"'"
  else
  sql="alter table `"+i+"` MODIFY column  "+j+"  "+tablesNew[i]["fields"][j]["type"]+"   COMMENT '"+tablesNew[i]["fields"][j]["note"]+"'"
  if(typeof(tablesNew[i]["fields"][j]["dbdefault"])!="undefined")
  sql+=" default '"+tablesNew[i]["fields"][j]["dbdefault"]+"'"
  console.log("修改unsigned",sql)
await this.dbopService.db(pool).query(sql, [])
}
  if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["not_null"])!="undefined")
  {
  if(item["fields"][j]["not_null"][1]==true)
  sql="alter table `"+i+"` MODIFY column  "+j+"  "+tablesNew[i]["fields"][j]["type"]+"  not null"
  else
  sql="alter table `"+i+"` MODIFY column  "+j+"  "+tablesNew[i]["fields"][j]["type"]+"   null"
 
 
 
  console.log("是否null",sql)
  await this.dbopService.db(pool).query(sql, [])
}

if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["unique"])!="undefined")
{
  if(item["fields"][j]["unique"][0]==true)
sql="alter table `"+i+"` add   UNIQUE("+j+")  "
else
sql="alter table `"+i+"` DROP INDEX   "+j+"  "
console.log("是否unique",sql)
await this.dbopService.db(pool).query(sql, [])
}

  if(typeof(item["fields"][j].length)=="undefined" && typeof(item["fields"][j]["name"])!="undefined")
  {
  sql="alter table `"+i+"` change    "+j+"  "+item["fields"][j]["name"][1]+" "+tablesNew[i]["fields"][j]["type"]
 
  if(tablesNew[i]["fields"][j]["unsigned"]==true)
  sql+=" unsigned "
     

  if(typeof(tablesNew[i]["fields"][j]["dbdefault"]!="undefined"))
  {
sql+=" default '"+tablesNew[i]["fields"][j]["dbdefault"]+"'"
  }
  if(typeof(tablesNew[i]["fields"][j]["note"]!="undefined"))
  {
sql+=" COMMENT '"+tablesNew[i]["fields"][j]["note"]+"'"
  }
 
 
  console.log("修改字段名",sql)
  await this.dbopService.db(pool).query(sql, [])
}

  }

}

}
else //增加 删除
{
if(item.length==3) //删除
{
sql="drop table if exists  "+item[0].name
console.log("删除表",sql,item[0].name)
await this.dbopService.db(pool).query(sql, [])
}
if(item.length==1)
{
let NewTable=item[0]
console.log("新增表",NewTable)
sql="CREATE TABLE `"+NewTable["name"]+"` ("
let fields=NewTable.fields
let index=0
for(let i in fields)
{
if(index!=0)
{
  sql+=","
}
index+=1
sql+="`"+fields[i]["name"]+"` "+fields[i]["type"]+" "
if(fields[i]["unsigned"]==true)
sql+=" unsigned "

if(fields[i]["not_null"]==true)
sql+=" not null "

if(fields[i]["increment"]==true)
sql+=" AUTO_INCREMENT "
if(fields[i]["pk"]==true)
sql+=" PRIMARY KEY "
if(typeof(fields[i]["dbdefault"])!="undefined" && fields[i]["dbdefault"]!=null && fields[i]["dbdefault"]!="")
{

  sql+=" default "+fields[i]["dbdefault"].toString()+" "
}



sql+=" COMMENT '"+fields[i]["note"].toString()+"' "

}
sql+=")"
console.log("sql",sql)
await this.dbopService.db(pool).query(sql, [])
if(typeof(NewTable["note"])!="undefined")
{
sql="ALTER TABLE `"+NewTable["name"]+"` COMMENT = '"+NewTable["note"]+"'"
await this.dbopService.db(pool).query(sql, [])
}
}
}

}
//假如修改了表明


      //操作数据库差异
   // console.log("ref",tables[5])
   //console.log("refnew",tablesNew[0]["endpoints"])

    }

    
 var RefDiff = jsondiffpatch.diff(refs, refsNew);
 if (typeof (RefDiff) != "undefined") {
console.log("ref不同", RefDiff)

for(let i in RefDiff)
{
  console.log("不同",i, RefDiff)
  let CurrentRef= RefDiff[i]
if(CurrentRef.length==3)//删除
{
sql="ALTER TABLE `"+CurrentRef[0]["endpoints"][0]["id"]+"` DROP FOREIGN KEY "+CurrentRef[0]["endpoints"][0]["id"]+"_"+CurrentRef[0]["endpoints"][0]["fieldId"]
console.log("删除外键",sql)
await this.dbopService.db(pool).query(sql, [])
}
if(CurrentRef.length==1)//添加
{
sql="alter table `"+CurrentRef[0]["endpoints"][0]["id"]+"` add constraint "+CurrentRef[0]["endpoints"][0]["id"]+"_"+CurrentRef[0]["endpoints"][0]["fieldId"]+" foreign key ("+CurrentRef[0]["endpoints"][0]["fieldId"]+") references "+CurrentRef[0]["endpoints"][1]["id"]+"("+CurrentRef[0]["endpoints"][1]["fieldId"]+")"
console.log("添加外键",sql)
await this.dbopService.db(pool).query(sql, [])
}
}

}
  //操作数据库差异
  console.log("refs",refs)
  console.log("refsNew",refsNew)
    return rs
  }

  @All('/GetDbJson')   //获取dbml
  async GetDbJson(@Body() params: {}, @Query() query: {}) {
    const pool = params["pool"] ? params["pool"] : "default"
    const dbname = params["dbname"] ? params["dbname"] : "lazyweb"
    let sql = `SELECT * FROM information_schema.tables where TABLE_TYPE="BASE TABLE" and table_schema =? limit 300`
    let tablesList = await this.dbopService.db(pool).query(sql, [dbname])
    sql = `SELECT * FROM information_schema.COLUMNS WHERE  table_schema =? `
    let COLUMNS = await this.dbopService.db(pool).query(sql, [dbname])

    //获取所有的外键信息
    sql = `SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_COLUMN_NAME is not null and CONSTRAINT_NAME<>'PRIMARY' and constraint_schema=? `
    let foreigns = await this.dbopService.db(pool).query(sql, [dbname])
    let refs = []
    refs = foreigns.map((item, index, array) => {
      let row = { "name": item["TABLE_NAME"],"id": item["TABLE_NAME"] }
      let endpoints = []
      endpoints.push({ "fieldNames": [item["COLUMN_NAME"]], "relation": "*", "tableName": item["TABLE_NAME"] })
      endpoints.push({ "fieldNames": [item["REFERENCED_COLUMN_NAME"]], "relation": "1", "tableName": item["REFERENCED_TABLE_NAME"] })
      row["endpoints"] = endpoints
      return row
    })


    let tables = tablesList.map((item, index, array) => {
      // return array[index]; //用这种方法也可以获取到当前处理的元素
      let row = { "name": item["TABLE_NAME"] , "id": item["TABLE_NAME"]}
      row["engine"] = item["ENGINE"]
      row["create_time"] = item["CREATE_TIME"]
      row["note"] = item["TABLE_COMMENT"]
      let columnsCurrentTable = COLUMNS.filter((column_item, index2, array2) => {
        return column_item["TABLE_NAME"] == item["TABLE_NAME"]


      });
     // console.log("哈哈", columnsCurrentTable)
      let columns = columnsCurrentTable.map((column_item, index2, array2) => {

        let columnrow = { "name": column_item["COLUMN_NAME"] }
        columnrow["dbdefault"] = column_item["COLUMN_DEFAULT"]
        if (column_item["EXTRA"] == "auto_increment")
          columnrow["increment"] = true

          if (column_item["COLUMN_KEY"] == "UNI")
          columnrow["unique"] = true

        let COLUMN_TYPE = column_item["COLUMN_TYPE"]
        if (COLUMN_TYPE != null) {
          let type_name = COLUMN_TYPE
if(type_name.indexOf("unsigned") > 0)
{
  columnrow["unsigned"] = true
}


          if (type_name.indexOf(" ") > 0)
            type_name = COLUMN_TYPE.substring(0, COLUMN_TYPE.indexOf(" "))
          columnrow["type"] = { "type_name": type_name, "args": null }
        }
        columnrow["note"] = column_item["COLUMN_COMMENT"]
        if (column_item["COLUMN_KEY"] == "PRI")
          columnrow["pk"] = true

        if (column_item["IS_NULLABLE"] != "YES")
          columnrow["not_null"] = true
        else
          columnrow["not_null"] = false
        return columnrow

      });
      row["fields"] = columns
      return row;
    });

    let data = { "tables": tables, "name": "public", "note": "", "refs": refs, "tableGroups": [] }


    return { "data": data, code: 0, success: true }
  }


  @All('/GetSql')   //获取dbml
  async GetSql(@Body() params: {}, @Query() query: {}) {
    const pool = params["pool"] ? params["pool"] : "default"
    const dbname = params["dbname"] ? params["dbname"] : "lazyweb"
    let sql = `SELECT * FROM information_schema.tables where TABLE_TYPE="BASE TABLE" and table_schema =? `
    let tables = await this.dbopService.db(pool).query(sql, [dbname])

    let dbsql = ""


    for (let i in tables) {
      sql = `SHOW CREATE TABLE  ${[tables[i]["TABLE_NAME"]]} `
      const sqltable = await this.dbopService.db(pool).query(sql, [])
      let dbsqlrow = ""
      if (sqltable != null && sqltable.length > 0) {
        dbsqlrow = sqltable[0]["Create Table"] + ";\n"
        var re = /unsigned/gi;
        dbsqlrow = dbsqlrow.replace(re, "")
        re = /CHARACTER SET utf8mb4/gi;
        dbsqlrow = dbsqlrow.replace(re, "")
        re = /COLLATE utf8mb4_general_c/gi;
        dbsqlrow = dbsqlrow.replace(re, "")
        re = /CHARSET=utf8mb4/gi;
        dbsqlrow = dbsqlrow.replace(re, "")
        re = /DEFAULT  COLLATE=utf8mb4_general_ci/gi;
        dbsqlrow = dbsqlrow.replace(re, "")


        dbsql += dbsqlrow
      }
    }

    return dbsql

    return { "sql": dbsql, code: 0, success: true }
  }

  @Post('/SaveDbml')   //保存dbml
  async SaveDbml(@Body() params: {}, @Query() query: {}) {
    let where = "id in (?) "
    let rs = await this.dbopService.name("admin").where(where, [[1, 4, 7, 29]]).limit(100).select()
    return { "rs": rs }
  }

  @All('/login/account')
  async account(@Body() params: {}) {
    // 这里是 http 的返回，可以直接返回字符串，数字，JSON，Buffer 等
/**
     * params {
   username: 'admin',
  password: '123abc',
   autoLogin: true,
  type: 'account'
 }
*/
let where="username=?"
let admin = await this.dbopService.name("admin").where(where, [params["username"]]).find()

if(admin==null)
{
  
  return {"status":"error","type":"account","currentAuthority":"admin"};
}

let password=common.pwd(params["password"],admin["login_salt"])
//console.log("密码",password)
if(password!=admin["password"])
{
  return {"status":"error","type":"account","currentAuthority":"admin","message":"密码错误"};
}
//更新登录时间
where="username=?"
let t:string=common.unixtime10()
await this.dbopService.name("admin").where(where, [params["username"]]).update({"login_time":t})

//console.log("更新登录的行数",typeof(num),num)
delete admin["password"]
delete admin["login_salt"]
admin["status"]="ok"
admin["currentAuthority"]="admin"
//获取对应的部门
let role_department:any= await this.dbopService.name("role_department").where("role_id=?", [admin["role_id"]]).limit(1000).select()


let departments:any = await this.dbopService.name("department").where("id>?", [0]).limit(1000).select()
let department_id_array=[]
if(role_department!=null)
{
  for(let i in role_department)
  {
 let departments2=common.findRecordsWithChildren(departments,role_department[i]["department_id"])
 if(departments2!=null)

 department_id_array = department_id_array.concat(departments2);
  }

}

let role_departments=[]
for(let i in department_id_array)
{
  if(department_id_array[i]["id"]!=null)
  role_departments.push(department_id_array[i]["id"])
}


role_departments=common.uniqueArray(role_departments)

admin["role_departments"] = role_departments
//console.log("role_department",role_department)
//console.log("当前角色的部门",role_departments)
const token:string=await this.jwt.sign(admin)
admin["token"]=token
this.ctx.cookies.set('token', token, { encrypt: false });
return admin;
}



  @All('/getAccess')
  getAccess(params) {

    return {access: "admin"};
  }

@All('/MenuList')
async MenuList()
{
let menu=[
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'SmileOutlined',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'SmileOutlined',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'DashboardOutlined',
      routes: [
        {
          path: '/dashboard',
          redirect: '/dashboard/analysis',
        },

        
        {
          name: 'analysis',
          icon: 'SmileOutlined',
          path: '/dashboard/analysis/1',
          component: './dashboard/analysis',
        },
        {
          name: 'analysis2',
          icon: 'SmileOutlined',
          path: '/dashboard/analysis/2',
          component: './dashboard/analysis',
        },
        {
          name: 'monitor',
          icon: 'SmileOutlined',
          path: '/dashboard/monitor',
          component: './dashboard/monitor',
        },
        {
          name: 'workplace',
          icon: 'SmileOutlined',
          path: '/dashboard/workplace',
          component: './dashboard/workplace',
        },
      ],
    },
    {
      path: '/form',
      icon: 'FormOutlined',
      name: 'form',
      routes: [
        {
          path: '/form',
          redirect: '/form/basic-form',
        },
        {
          name: 'basic-form',
          icon: 'SmileOutlined',
          path: '/form/basic-form',
          component: './form/basic-form',
        },
        {
          name: 'step-form',
          icon: 'SmileOutlined',
          path: '/form/step-form',
          component: './form/step-form',
        },
        {
          name: 'advanced-form',
          icon: 'SmileOutlined',
          path: '/form/advanced-form',
          component: './form/advanced-form',
        },
      ],
    },
    {
      path: '/list',
      icon: 'TableOutlined',
      name: 'list',
      routes: [
        {
          path: '/list/search',
          name: 'search-list',
          component: './list/search',
          routes: [
            {
              path: '/list/search',
              redirect: '/list/search/articles',
            },
            {
              name: 'articles',
              icon: 'SmileOutlined',
              path: '/list/search/articles',
              component: './list/search/articles',
            },
            {
              name: 'projects',
              icon: 'SmileOutlined',
              path: '/list/search/projects',
              component: './list/search/projects',
            },
            {
              name: 'applications',
              icon: 'SmileOutlined',
              path: '/list/search/applications',
              component: './list/search/applications',
            },
          ],
        },
        {
          path: '/list',
          redirect: '/list/table-list',
        },
        {
          name: 'table-list',
          icon: 'SmileOutlined',
          path: '/list/table-list',
          component: './list/table-list',
        },
        {
          name: 'basic-list',
          icon: 'SmileOutlined',
          path: '/list/basic-list',
          component: './list/basic-list',
        },
        {
          name: 'card-list',
          icon: 'SmileOutlined',
          path: '/list/card-list',
          component: './list/card-list',
        },
      ],
    },
    {
      path: '/profile',
      name: 'profile',
      icon: 'ProfileOutlined',
      routes: [
        {
          path: '/profile',
          redirect: '/profile/basic',
        },
        {
          name: 'basic',
          icon: 'SmileOutlined',
          path: '/profile/basic',
          component: './profile/basic',
        },
        {
          name: 'advanced',
          icon: 'SmileOutlined',
          path: '/profile/advanced',
          component: './profile/advanced',
        },
      ],
    },
    {
      name: 'result',
      icon: 'CheckCircleOutlined',
      path: '/result',
      routes: [
        {
          path: '/result',
          redirect: '/result/success',
        },
        {
          name: 'success',
          icon: 'SmileOutlined',
          path: '/result/success',
          component: './result/success',
        },
        {
          name: 'fail',
          icon: 'SmileOutlined',
          path: '/result/fail',
          component: './result/fail',
        },
      ],
    },
    {
      name: 'exception',
      icon: 'WarningOutlined',
      path: '/exception',
      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'SmileOutlined',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'SmileOutlined',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'SmileOutlined',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      name: 'account',
      icon: 'UserOutlined',
      path: '/account',
      routes: [
        {
          path: '/account',
          redirect: '/account/center',
        },
        {
          name: 'center',
          icon: 'SmileOutlined',
          path: '/account/center',
          component: './account/center',
        },
        {
          name: 'settings',
          icon: 'SmileOutlined',
          path: '/account/settings',
          component: './account/settings',
        },
      ],
    },
    {
      name: 'editor',
      icon: 'BarChartOutlined',
      path: '/editor',
      routes: [
        {
          path: '/editor',
          redirect: '/editor/flow',
        },
        {
          name: 'flow',
          icon: 'SmileOutlined',
          path: '/editor/flow',
          component: './editor/flow',
        },
        {
          name: 'mind',
          icon: 'SmileOutlined',
          path: '/editor/mind',
          component: './editor/mind',
        },
        {
          name: 'koni',
          icon: 'SmileOutlined',
          path: '/editor/koni',
          component: './editor/koni',
        },
      ],
    },
  

    {
      name: 'custom',
      icon: 'UserAddOutlined',
      path: '/custom',
     component: './custom',
  
      routes: [
        {
          name: 'basic',
          icon: 'SmileOutlined',
          path: '/custom/basic',
          component: './custom/basic',
        },
        {
          name: 'layout',
          icon: 'SmileOutlined',
          path: '/custom/layout',
          component: './custom/layout',
        },
        {
          name: 'table',
          icon: 'SmileOutlined',
          path: '/custom/table',
          component: './custom/table',
        },
        {
          name: 'login',
          icon: 'SmileOutlined',
          path: '/custom/login',
          component: './custom/login',
        },
        {
          name: 'reg',
          icon: 'SmileOutlined',
          path: '/custom/reg',
          component: './custom/reg',
        },
        {
          name: 'change',
          icon: 'SmileOutlined',
          path: '/custom/change',
          component: './custom/change',
        },
        {
          name: 'visual',
          icon: 'SmileOutlined',
          path: '/custom/visual/1',
          component: './custom/visual',
        },
        {
          name: 'basictable',
          icon: 'SmileOutlined',
          path: '/custom/basictable',
          component: './custom/basictable',
        },
        {
          name: 'select',
          icon: 'SmileOutlined',
          path: '/custom/select',
          component: './custom/select',
        },
        {
          name: 'editor',
          icon: 'SmileOutlined',
          path: '/custom/editor',
          component: './custom/editor',
        },
      ]
  
    },

    {
      path: '/',
      redirect: '/dashboard/analysis/2',  //默认页无效 客户端有效
    },
    {
      component: '404',
    },
  ];


let admin=this.ctx.state.user;
let role_id=admin.role_id
let MenuDb:any=[]
//console.log("当前的角色",role_id)
let role_departments=admin["role_departments"]

if(role_id>1)
{

 let  menus:any=await this.dbopService.name("department_menu").fields("menu_id").where("department_id in (?)",[role_departments]).pagesize(1000).select()
if (menus==null || menus.length==0)
{
  MenuDb=[]
}
else
{
  //console.log("获取到的菜单",menus)
  const menu_ids = menus.map(record => record.menu_id);

  MenuDb=await this.dbopService.name("menu").fields("name,url,menu_type,title,path,pid,id,component,icon").where("id in ? ",[menu_ids]).order("sort asc").pagesize(1000).select()

}
}
 else
 {
   MenuDb=await this.dbopService.name("menu").fields("name,url,menu_type,title,path,pid,id,component,icon").where("status=?",[1]).order("sort asc").pagesize(1000).select()
 }
 //console.log("MenuDb",MenuDb)
 for(let i in MenuDb)
 {
 // MenuDb[i]["component"]=' ./event'
 //MenuDb[i]["path"]=MenuDb[i]["name"]
if(MenuDb[i]["menu_type"]=="iframe" && MenuDb[i]["pid"]>0)
MenuDb[i]["path"]="/sys/iframe/"+encodeURIComponent(MenuDb[i]["url"])
if(MenuDb[i]["icon"]==null || MenuDb[i]["icon"]=="")
{
delete MenuDb[i]["icon"]
}
if(MenuDb[i]["title"]!=null && MenuDb[i]["title"]!="")
MenuDb[i]["name"]=MenuDb[i]["title"]

if(MenuDb[i]["path"]==null || MenuDb[i]["path"]=="")
{
  if(role_id==1)
MenuDb[i]["path"]=MenuDb[i]["name"]
}
if(MenuDb[i]["path"]!=null )
{
  MenuDb[i]["path"]=MenuDb[i]["path"].toString()+"/"+MenuDb[i]["id"]
}


//+encodeURIComponent(MenuDb[i]["url"])
 ///visual/preview.html?page_id=6
 if(MenuDb[i]["menu_type"]=="tab" && MenuDb[i]["pid"]>0)
 delete MenuDb[i]["component"]
 }
 let WebMenu=[]
//common.GenTree(WebMenu,MenuDb)
let MenuDb2=JSON.parse(JSON.stringify(MenuDb))
for(let i in MenuDb)
{
  let level1=JSON.parse(JSON.stringify(MenuDb[i]))
  if(level1["pid"]==-1)
  {
    let children=[]
    for(let j in MenuDb2)
    {
      if(MenuDb2[j]["pid"]==level1["id"])
      {
        children.push(MenuDb2[j])
      }
    }
    if(children.length>0)
    level1["routes"]=children
            
    WebMenu.push(level1)
  }

}
 menu=menu.concat(WebMenu)
 return menu;
}


  @Get("/currentUser", { middleware: [JwtPassportMiddleware] })
  async currentUser(): Promise<string> {
    // 这里是 http 的返回，可以直接返回字符串，数字，JSON，Buffer 等
 let admin:any={}
 if(this.ctx.state.user!=null)
 {
  admin=this.ctx.state.user;
  delete admin["exp"]
  delete admin["iat"]

  admin["token"]= await this.jwt.sign(admin)
 }

    let data =
    {
      success: true,
      data: {
        name: admin.username,
        avatar: admin.avatar,
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: true,
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    }
    data["data"]=Object.assign(data["data"],admin)
    return JSON.stringify(data);
  }


  getNotices() {
    let data = {
      data: [
        {
          id: '000000001',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '你收到了 14 份新周报',
          datetime: '2017-08-09',
          type: 'notification',
        },
        {
          id: '000000002',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          datetime: '2017-08-08',
          type: 'notification',
        },
        {
          id: '000000003',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
          title: '这种模板可以区分多种通知类型',
          datetime: '2017-08-07',
          read: true,
          type: 'notification',
        },
        {
          id: '000000004',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: '左侧图标用于区分不同的类型',
          datetime: '2017-08-07',
          type: 'notification',
        },
        {
          id: '000000005',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '内容不要超过两行字，超出时自动截断',
          datetime: '2017-08-07',
          type: 'notification',
        },
        {
          id: '000000006',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '曲丽丽 评论了你',
          description: '描述信息描述信息描述信息',
          datetime: '2017-08-07',
          type: 'message',
          clickClose: true,
        },
        {
          id: '000000007',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '朱偏右 回复了你',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: 'message',
          clickClose: true,
        },
        {
          id: '000000008',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '标题',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: 'message',
          clickClose: true,
        },
        {
          id: '000000009',
          title: '任务名称',
          description: '任务需要在 2017-01-12 20:00 前启动',
          extra: '未开始',
          status: 'todo',
          type: 'event',
        },
        {
          id: '000000010',
          title: '第三方紧急代码变更',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '马上到期',
          status: 'urgent',
          type: 'event',
        },
        {
          id: '000000011',
          title: '信息安全考试',
          description: '指派竹尔于 2017-01-09 前完成更新并发布',
          extra: '已耗时 8 天',
          status: 'doing',
          type: 'event',
        },
        {
          id: '000000012',
          title: 'ABCD 版本发布',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '进行中',
          status: 'processing',
          type: 'event',
        },
      ],
    };
    return data;
  }

  @Get("/notices")
  async notices(): Promise<string> {

    let r = this.getNotices()
    return JSON.stringify(r)
  }
  @Get("/fake_analysis_chart_data")
  async fake_analysis_chart_data(): Promise<string> {

    let r = { "data": { "visitData": [{ "x": "2022-11-11", "y": 7 }, { "x": "2022-11-12", "y": 5 }, { "x": "2022-11-13", "y": 4 }, { "x": "2022-11-14", "y": 2 }, { "x": "2022-11-15", "y": 4 }, { "x": "2022-11-16", "y": 7 }, { "x": "2022-11-17", "y": 5 }, { "x": "2022-11-18", "y": 6 }, { "x": "2022-11-19", "y": 5 }, { "x": "2022-11-20", "y": 9 }, { "x": "2022-11-21", "y": 6 }, { "x": "2022-11-22", "y": 3 }, { "x": "2022-11-23", "y": 1 }, { "x": "2022-11-24", "y": 5 }, { "x": "2022-11-25", "y": 3 }, { "x": "2022-11-26", "y": 6 }, { "x": "2022-11-27", "y": 5 }], "visitData2": [{ "x": "2022-11-11", "y": 1 }, { "x": "2022-11-12", "y": 6 }, { "x": "2022-11-13", "y": 4 }, { "x": "2022-11-14", "y": 8 }, { "x": "2022-11-15", "y": 3 }, { "x": "2022-11-16", "y": 7 }, { "x": "2022-11-17", "y": 2 }], "salesData": [{ "x": "1月", "y": 565 }, { "x": "2月", "y": 399 }, { "x": "3月", "y": 1138 }, { "x": "4月", "y": 951 }, { "x": "5月", "y": 682 }, { "x": "6月", "y": 1181 }, { "x": "7月", "y": 1126 }, { "x": "8月", "y": 251 }, { "x": "9月", "y": 371 }, { "x": "10月", "y": 503 }, { "x": "11月", "y": 1122 }, { "x": "12月", "y": 540 }], "searchData": [{ "index": 1, "keyword": "搜索关键词-0", "count": 253, "range": 3, "status": 0 }, { "index": 2, "keyword": "搜索关键词-1", "count": 492, "range": 95, "status": 0 }, { "index": 3, "keyword": "搜索关键词-2", "count": 736, "range": 14, "status": 1 }, { "index": 4, "keyword": "搜索关键词-3", "count": 939, "range": 47, "status": 0 }, { "index": 5, "keyword": "搜索关键词-4", "count": 799, "range": 23, "status": 1 }, { "index": 6, "keyword": "搜索关键词-5", "count": 839, "range": 0, "status": 0 }, { "index": 7, "keyword": "搜索关键词-6", "count": 740, "range": 79, "status": 1 }, { "index": 8, "keyword": "搜索关键词-7", "count": 925, "range": 20, "status": 0 }, { "index": 9, "keyword": "搜索关键词-8", "count": 352, "range": 67, "status": 1 }, { "index": 10, "keyword": "搜索关键词-9", "count": 835, "range": 16, "status": 1 }, { "index": 11, "keyword": "搜索关键词-10", "count": 160, "range": 41, "status": 0 }, { "index": 12, "keyword": "搜索关键词-11", "count": 385, "range": 64, "status": 0 }, { "index": 13, "keyword": "搜索关键词-12", "count": 195, "range": 1, "status": 0 }, { "index": 14, "keyword": "搜索关键词-13", "count": 782, "range": 76, "status": 0 }, { "index": 15, "keyword": "搜索关键词-14", "count": 203, "range": 48, "status": 0 }, { "index": 16, "keyword": "搜索关键词-15", "count": 273, "range": 58, "status": 0 }, { "index": 17, "keyword": "搜索关键词-16", "count": 522, "range": 41, "status": 1 }, { "index": 18, "keyword": "搜索关键词-17", "count": 596, "range": 75, "status": 0 }, { "index": 19, "keyword": "搜索关键词-18", "count": 490, "range": 1, "status": 1 }, { "index": 20, "keyword": "搜索关键词-19", "count": 522, "range": 27, "status": 0 }, { "index": 21, "keyword": "搜索关键词-20", "count": 256, "range": 0, "status": 0 }, { "index": 22, "keyword": "搜索关键词-21", "count": 20, "range": 63, "status": 1 }, { "index": 23, "keyword": "搜索关键词-22", "count": 400, "range": 16, "status": 1 }, { "index": 24, "keyword": "搜索关键词-23", "count": 21, "range": 29, "status": 1 }, { "index": 25, "keyword": "搜索关键词-24", "count": 710, "range": 25, "status": 0 }, { "index": 26, "keyword": "搜索关键词-25", "count": 556, "range": 14, "status": 1 }, { "index": 27, "keyword": "搜索关键词-26", "count": 338, "range": 72, "status": 0 }, { "index": 28, "keyword": "搜索关键词-27", "count": 272, "range": 18, "status": 1 }, { "index": 29, "keyword": "搜索关键词-28", "count": 208, "range": 83, "status": 0 }, { "index": 30, "keyword": "搜索关键词-29", "count": 735, "range": 25, "status": 1 }, { "index": 31, "keyword": "搜索关键词-30", "count": 532, "range": 87, "status": 0 }, { "index": 32, "keyword": "搜索关键词-31", "count": 725, "range": 57, "status": 1 }, { "index": 33, "keyword": "搜索关键词-32", "count": 234, "range": 84, "status": 0 }, { "index": 34, "keyword": "搜索关键词-33", "count": 716, "range": 12, "status": 1 }, { "index": 35, "keyword": "搜索关键词-34", "count": 607, "range": 62, "status": 1 }, { "index": 36, "keyword": "搜索关键词-35", "count": 334, "range": 26, "status": 0 }, { "index": 37, "keyword": "搜索关键词-36", "count": 846, "range": 12, "status": 0 }, { "index": 38, "keyword": "搜索关键词-37", "count": 44, "range": 80, "status": 0 }, { "index": 39, "keyword": "搜索关键词-38", "count": 337, "range": 77, "status": 0 }, { "index": 40, "keyword": "搜索关键词-39", "count": 794, "range": 66, "status": 1 }, { "index": 41, "keyword": "搜索关键词-40", "count": 696, "range": 93, "status": 0 }, { "index": 42, "keyword": "搜索关键词-41", "count": 76, "range": 60, "status": 0 }, { "index": 43, "keyword": "搜索关键词-42", "count": 513, "range": 21, "status": 0 }, { "index": 44, "keyword": "搜索关键词-43", "count": 425, "range": 81, "status": 1 }, { "index": 45, "keyword": "搜索关键词-44", "count": 963, "range": 26, "status": 1 }, { "index": 46, "keyword": "搜索关键词-45", "count": 978, "range": 96, "status": 0 }, { "index": 47, "keyword": "搜索关键词-46", "count": 732, "range": 22, "status": 1 }, { "index": 48, "keyword": "搜索关键词-47", "count": 871, "range": 19, "status": 1 }, { "index": 49, "keyword": "搜索关键词-48", "count": 751, "range": 71, "status": 0 }, { "index": 50, "keyword": "搜索关键词-49", "count": 43, "range": 69, "status": 1 }], "offlineData": [{ "name": "Stores 0", "cvr": 0.3 }, { "name": "Stores 1", "cvr": 0.8 }, { "name": "Stores 2", "cvr": 0.9 }, { "name": "Stores 3", "cvr": 0.4 }, { "name": "Stores 4", "cvr": 0.9 }, { "name": "Stores 5", "cvr": 0.4 }, { "name": "Stores 6", "cvr": 0.7 }, { "name": "Stores 7", "cvr": 0.1 }, { "name": "Stores 8", "cvr": 0.3 }, { "name": "Stores 9", "cvr": 0.2 }], "offlineChartData": [{ "date": "12:18", "type": "客流量", "value": 28 }, { "date": "12:18", "type": "支付笔数", "value": 44 }, { "date": "12:48", "type": "客流量", "value": 92 }, { "date": "12:48", "type": "支付笔数", "value": 32 }, { "date": "13:18", "type": "客流量", "value": 35 }, { "date": "13:18", "type": "支付笔数", "value": 11 }, { "date": "13:48", "type": "客流量", "value": 101 }, { "date": "13:48", "type": "支付笔数", "value": 53 }, { "date": "14:18", "type": "客流量", "value": 102 }, { "date": "14:18", "type": "支付笔数", "value": 72 }, { "date": "14:48", "type": "客流量", "value": 56 }, { "date": "14:48", "type": "支付笔数", "value": 81 }, { "date": "15:18", "type": "客流量", "value": 70 }, { "date": "15:18", "type": "支付笔数", "value": 47 }, { "date": "15:48", "type": "客流量", "value": 99 }, { "date": "15:48", "type": "支付笔数", "value": 39 }, { "date": "16:18", "type": "客流量", "value": 47 }, { "date": "16:18", "type": "支付笔数", "value": 63 }, { "date": "16:48", "type": "客流量", "value": 16 }, { "date": "16:48", "type": "支付笔数", "value": 88 }, { "date": "17:18", "type": "客流量", "value": 34 }, { "date": "17:18", "type": "支付笔数", "value": 95 }, { "date": "17:48", "type": "客流量", "value": 75 }, { "date": "17:48", "type": "支付笔数", "value": 20 }, { "date": "18:18", "type": "客流量", "value": 68 }, { "date": "18:18", "type": "支付笔数", "value": 84 }, { "date": "18:48", "type": "客流量", "value": 51 }, { "date": "18:48", "type": "支付笔数", "value": 17 }, { "date": "19:18", "type": "客流量", "value": 42 }, { "date": "19:18", "type": "支付笔数", "value": 10 }, { "date": "19:48", "type": "客流量", "value": 105 }, { "date": "19:48", "type": "支付笔数", "value": 89 }, { "date": "20:18", "type": "客流量", "value": 61 }, { "date": "20:18", "type": "支付笔数", "value": 44 }, { "date": "20:48", "type": "客流量", "value": 13 }, { "date": "20:48", "type": "支付笔数", "value": 66 }, { "date": "21:18", "type": "客流量", "value": 50 }, { "date": "21:18", "type": "支付笔数", "value": 29 }, { "date": "21:48", "type": "客流量", "value": 44 }, { "date": "21:48", "type": "支付笔数", "value": 88 }], "salesTypeData": [{ "x": "家用电器", "y": 4544 }, { "x": "食用酒水", "y": 3321 }, { "x": "个护健康", "y": 3113 }, { "x": "服饰箱包", "y": 2341 }, { "x": "母婴产品", "y": 1231 }, { "x": "其他", "y": 1231 }], "salesTypeDataOnline": [{ "x": "家用电器", "y": 244 }, { "x": "食用酒水", "y": 321 }, { "x": "个护健康", "y": 311 }, { "x": "服饰箱包", "y": 41 }, { "x": "母婴产品", "y": 121 }, { "x": "其他", "y": 111 }], "salesTypeDataOffline": [{ "x": "家用电器", "y": 99 }, { "x": "食用酒水", "y": 188 }, { "x": "个护健康", "y": 344 }, { "x": "服饰箱包", "y": 255 }, { "x": "其他", "y": 65 }], "radarData": [{ "name": "个人", "label": "引用", "value": 10 }, { "name": "个人", "label": "口碑", "value": 8 }, { "name": "个人", "label": "产量", "value": 4 }, { "name": "个人", "label": "贡献", "value": 5 }, { "name": "个人", "label": "热度", "value": 7 }, { "name": "团队", "label": "引用", "value": 3 }, { "name": "团队", "label": "口碑", "value": 9 }, { "name": "团队", "label": "产量", "value": 6 }, { "name": "团队", "label": "贡献", "value": 3 }, { "name": "团队", "label": "热度", "value": 1 }, { "name": "部门", "label": "引用", "value": 4 }, { "name": "部门", "label": "口碑", "value": 1 }, { "name": "部门", "label": "产量", "value": 6 }, { "name": "部门", "label": "贡献", "value": 5 }, { "name": "部门", "label": "热度", "value": 7 }] } }
    return JSON.stringify(r)
  }
  @Get("/tags")
  async tags(): Promise<string> {

    let r = { "data": { "list": [{ "name": "香港岛", "value": 6, "type": 0 }, { "name": "巴中市", "value": 14, "type": 1 }, { "name": "襄阳市", "value": 39, "type": 1 }, { "name": "贵阳市", "value": 57, "type": 1 }, { "name": "承德市", "value": 44, "type": 1 }, { "name": "新界", "value": 98, "type": 0 }, { "name": "阜阳市", "value": 22, "type": 2 }, { "name": "攀枝花市", "value": 32, "type": 0 }, { "name": "新界", "value": 35, "type": 0 }, { "name": "重庆市", "value": 12, "type": 1 }, { "name": "乌兰察布市", "value": 57, "type": 1 }, { "name": "离岛", "value": 64, "type": 2 }, { "name": "舟山市", "value": 47, "type": 2 }, { "name": "通化市", "value": 45, "type": 1 }, { "name": "上海市", "value": 94, "type": 1 }, { "name": "伊春市", "value": 95, "type": 0 }, { "name": "上海市", "value": 11, "type": 0 }, { "name": "海外", "value": 28, "type": 1 }, { "name": "常州市", "value": 11, "type": 0 }, { "name": "厦门市", "value": 99, "type": 2 }, { "name": "香港岛", "value": 58, "type": 1 }, { "name": "舟山市", "value": 97, "type": 1 }, { "name": "那曲地区", "value": 80, "type": 1 }, { "name": "三亚市", "value": 85, "type": 2 }, { "name": "天津市", "value": 43, "type": 1 }, { "name": "锦州市", "value": 11, "type": 1 }, { "name": "澳门半岛", "value": 20, "type": 2 }, { "name": "平顶山市", "value": 80, "type": 0 }, { "name": "固原市", "value": 67, "type": 1 }, { "name": "海东市", "value": 50, "type": 2 }, { "name": "上海市", "value": 61, "type": 1 }, { "name": "银川市", "value": 9, "type": 1 }, { "name": "岳阳市", "value": 4, "type": 0 }, { "name": "忻州市", "value": 40, "type": 2 }, { "name": "温州市", "value": 91, "type": 0 }, { "name": "嘉义市", "value": 56, "type": 2 }, { "name": "新余市", "value": 36, "type": 0 }, { "name": "泉州市", "value": 70, "type": 0 }, { "name": "晋城市", "value": 92, "type": 1 }, { "name": "佛山市", "value": 87, "type": 1 }, { "name": "秦皇岛市", "value": 86, "type": 2 }, { "name": "莆田市", "value": 47, "type": 1 }, { "name": "盐城市", "value": 56, "type": 1 }, { "name": "桂林市", "value": 38, "type": 0 }, { "name": "汕头市", "value": 20, "type": 2 }, { "name": "河池市", "value": 88, "type": 1 }, { "name": "七台河市", "value": 36, "type": 1 }, { "name": "固原市", "value": 49, "type": 1 }, { "name": "龙岩市", "value": 4, "type": 1 }, { "name": "白城市", "value": 47, "type": 1 }, { "name": "普洱市", "value": 28, "type": 1 }, { "name": "陇南市", "value": 23, "type": 1 }, { "name": "宝鸡市", "value": 16, "type": 2 }, { "name": "东莞市", "value": 76, "type": 2 }, { "name": "黔东南苗族侗族自治州", "value": 51, "type": 2 }, { "name": "大同市", "value": 79, "type": 1 }, { "name": "宜春市", "value": 32, "type": 2 }, { "name": "承德市", "value": 85, "type": 0 }, { "name": "衡阳市", "value": 26, "type": 0 }, { "name": "天津市", "value": 40, "type": 0 }, { "name": "赤峰市", "value": 54, "type": 1 }, { "name": "上海市", "value": 5, "type": 1 }, { "name": "松原市", "value": 23, "type": 1 }, { "name": "长治市", "value": 82, "type": 2 }, { "name": "石嘴山市", "value": 62, "type": 1 }, { "name": "保定市", "value": 60, "type": 1 }, { "name": "澳门半岛", "value": 99, "type": 0 }, { "name": "宁波市", "value": 68, "type": 2 }, { "name": "巢湖市", "value": 49, "type": 2 }, { "name": "山南地区", "value": 55, "type": 1 }, { "name": "三沙市", "value": 22, "type": 2 }, { "name": "赣州市", "value": 30, "type": 0 }, { "name": "长春市", "value": 98, "type": 0 }, { "name": "南昌市", "value": 92, "type": 1 }, { "name": "滨州市", "value": 60, "type": 0 }, { "name": "海西蒙古族藏族自治州", "value": 44, "type": 1 }, { "name": "保定市", "value": 78, "type": 1 }, { "name": "重庆市", "value": 70, "type": 1 }, { "name": "三亚市", "value": 77, "type": 2 }, { "name": "乌兰察布市", "value": 34, "type": 2 }, { "name": "新北市", "value": 69, "type": 2 }, { "name": "阿克苏地区", "value": 94, "type": 1 }, { "name": "朝阳市", "value": 56, "type": 0 }, { "name": "扬州市", "value": 82, "type": 2 }, { "name": "海南藏族自治州", "value": 47, "type": 0 }, { "name": "商丘市", "value": 15, "type": 2 }, { "name": "焦作市", "value": 96, "type": 1 }, { "name": "天津市", "value": 47, "type": 1 }, { "name": "孝感市", "value": 77, "type": 1 }, { "name": "吉林市", "value": 96, "type": 1 }, { "name": "兴安盟", "value": 27, "type": 0 }, { "name": "贺州市", "value": 92, "type": 1 }, { "name": "德宏傣族景颇族自治州", "value": 56, "type": 2 }, { "name": "大连市", "value": 100, "type": 0 }, { "name": "内江市", "value": 15, "type": 1 }, { "name": "香港岛", "value": 84, "type": 1 }, { "name": "盐城市", "value": 88, "type": 1 }, { "name": "周口市", "value": 79, "type": 0 }, { "name": "九龙", "value": 95, "type": 1 }, { "name": "晋中市", "value": 70, "type": 2 }] } }
    return JSON.stringify(r)
  }
  @Get("/project/notice")
  async projectnotice(): Promise<string> {

    let r = { "data": [{ "id": "xxx1", "title": "Alipay", "logo": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png", "description": "那是一种内在的东西，他们到达不了，也无法触及的", "updatedAt": "2022-11-11T14:48:25.771Z", "member": "科学搬砖组", "href": "", "memberLink": "" }, { "id": "xxx2", "title": "Angular", "logo": "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png", "description": "希望是一个好东西，也许是最好的，好东西是不会消亡的", "updatedAt": "2017-07-24T00:00:00.000Z", "member": "全组都是吴彦祖", "href": "", "memberLink": "" }, { "id": "xxx3", "title": "Ant Design", "logo": "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png", "description": "城镇中有那么多的酒馆，她却偏偏走进了我的酒馆", "updatedAt": "2022-11-11T14:48:25.771Z", "member": "中二少女团", "href": "", "memberLink": "" }, { "id": "xxx4", "title": "Ant Design Pro", "logo": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png", "description": "那时候我只会想自己想要什么，从不想自己拥有什么", "updatedAt": "2017-07-23T00:00:00.000Z", "member": "程序员日常", "href": "", "memberLink": "" }, { "id": "xxx5", "title": "Bootstrap", "logo": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png", "description": "凛冬将至", "updatedAt": "2017-07-23T00:00:00.000Z", "member": "高逼格设计天团", "href": "", "memberLink": "" }, { "id": "xxx6", "title": "React", "logo": "https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png", "description": "生命就像一盒巧克力，结果往往出人意料", "updatedAt": "2017-07-23T00:00:00.000Z", "member": "骗你来学计算机", "href": "", "memberLink": "" }] }
    return JSON.stringify(r)
  }
  @Get("/activities")
  async activities(): Promise<string> {

    let r = { "data": [{ "id": "trend-1", "updatedAt": "2022-11-11T14:48:25.781Z", "user": { "name": "曲丽丽", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" }, "group": { "name": "高逼格设计天团", "link": "http://github.com/" }, "project": { "name": "六月迭代", "link": "http://github.com/" }, "template": "在 @{group} 新建项目 @{project}" }, { "id": "trend-2", "updatedAt": "2022-11-11T14:48:25.781Z", "user": { "name": "付小小", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png" }, "group": { "name": "高逼格设计天团", "link": "http://github.com/" }, "project": { "name": "六月迭代", "link": "http://github.com/" }, "template": "在 @{group} 新建项目 @{project}" }, { "id": "trend-3", "updatedAt": "2022-11-11T14:48:25.781Z", "user": { "name": "林东东", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png" }, "group": { "name": "中二少女团", "link": "http://github.com/" }, "project": { "name": "六月迭代", "link": "http://github.com/" }, "template": "在 @{group} 新建项目 @{project}" }, { "id": "trend-4", "updatedAt": "2022-11-11T14:48:25.781Z", "user": { "name": "周星星", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png" }, "project": { "name": "5 月日常迭代", "link": "http://github.com/" }, "template": "将 @{project} 更新至已发布状态" }, { "id": "trend-5", "updatedAt": "2022-11-11T14:48:25.781Z", "user": { "name": "朱偏右", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png" }, "project": { "name": "工程效能", "link": "http://github.com/" }, "comment": { "name": "留言", "link": "http://github.com/" }, "template": "在 @{project} 发布了 @{comment}" }, { "id": "trend-6", "updatedAt": "2022-11-11T14:48:25.781Z", "user": { "name": "乐哥", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png" }, "group": { "name": "程序员日常", "link": "http://github.com/" }, "project": { "name": "品牌迭代", "link": "http://github.com/" }, "template": "在 @{group} 新建项目 @{project}" }] }
    return JSON.stringify(r)
  }
  @Get("/fake_workplace_chart_data")
  async fake_workplace_chart_data(): Promise<string> {

    let r = { "data": { "visitData": [{ "x": "2022-11-11", "y": 7 }, { "x": "2022-11-12", "y": 5 }, { "x": "2022-11-13", "y": 4 }, { "x": "2022-11-14", "y": 2 }, { "x": "2022-11-15", "y": 4 }, { "x": "2022-11-16", "y": 7 }, { "x": "2022-11-17", "y": 5 }, { "x": "2022-11-18", "y": 6 }, { "x": "2022-11-19", "y": 5 }, { "x": "2022-11-20", "y": 9 }, { "x": "2022-11-21", "y": 6 }, { "x": "2022-11-22", "y": 3 }, { "x": "2022-11-23", "y": 1 }, { "x": "2022-11-24", "y": 5 }, { "x": "2022-11-25", "y": 3 }, { "x": "2022-11-26", "y": 6 }, { "x": "2022-11-27", "y": 5 }], "visitData2": [{ "x": "2022-11-11", "y": 1 }, { "x": "2022-11-12", "y": 6 }, { "x": "2022-11-13", "y": 4 }, { "x": "2022-11-14", "y": 8 }, { "x": "2022-11-15", "y": 3 }, { "x": "2022-11-16", "y": 7 }, { "x": "2022-11-17", "y": 2 }], "salesData": [{ "x": "1月", "y": 853 }, { "x": "2月", "y": 722 }, { "x": "3月", "y": 340 }, { "x": "4月", "y": 1194 }, { "x": "5月", "y": 955 }, { "x": "6月", "y": 988 }, { "x": "7月", "y": 867 }, { "x": "8月", "y": 634 }, { "x": "9月", "y": 464 }, { "x": "10月", "y": 1188 }, { "x": "11月", "y": 930 }, { "x": "12月", "y": 669 }], "searchData": [{ "index": 1, "keyword": "搜索关键词-0", "count": 299, "range": 66, "status": 0 }, { "index": 2, "keyword": "搜索关键词-1", "count": 202, "range": 9, "status": 0 }, { "index": 3, "keyword": "搜索关键词-2", "count": 483, "range": 62, "status": 0 }, { "index": 4, "keyword": "搜索关键词-3", "count": 79, "range": 80, "status": 1 }, { "index": 5, "keyword": "搜索关键词-4", "count": 919, "range": 86, "status": 1 }, { "index": 6, "keyword": "搜索关键词-5", "count": 735, "range": 12, "status": 0 }, { "index": 7, "keyword": "搜索关键词-6", "count": 439, "range": 87, "status": 0 }, { "index": 8, "keyword": "搜索关键词-7", "count": 387, "range": 80, "status": 0 }, { "index": 9, "keyword": "搜索关键词-8", "count": 180, "range": 63, "status": 1 }, { "index": 10, "keyword": "搜索关键词-9", "count": 760, "range": 34, "status": 1 }, { "index": 11, "keyword": "搜索关键词-10", "count": 915, "range": 75, "status": 0 }, { "index": 12, "keyword": "搜索关键词-11", "count": 959, "range": 58, "status": 1 }, { "index": 13, "keyword": "搜索关键词-12", "count": 758, "range": 9, "status": 1 }, { "index": 14, "keyword": "搜索关键词-13", "count": 394, "range": 0, "status": 0 }, { "index": 15, "keyword": "搜索关键词-14", "count": 771, "range": 32, "status": 1 }, { "index": 16, "keyword": "搜索关键词-15", "count": 421, "range": 52, "status": 1 }, { "index": 17, "keyword": "搜索关键词-16", "count": 585, "range": 83, "status": 0 }, { "index": 18, "keyword": "搜索关键词-17", "count": 467, "range": 61, "status": 1 }, { "index": 19, "keyword": "搜索关键词-18", "count": 685, "range": 93, "status": 0 }, { "index": 20, "keyword": "搜索关键词-19", "count": 963, "range": 63, "status": 1 }, { "index": 21, "keyword": "搜索关键词-20", "count": 91, "range": 22, "status": 0 }, { "index": 22, "keyword": "搜索关键词-21", "count": 438, "range": 50, "status": 0 }, { "index": 23, "keyword": "搜索关键词-22", "count": 103, "range": 85, "status": 0 }, { "index": 24, "keyword": "搜索关键词-23", "count": 589, "range": 44, "status": 0 }, { "index": 25, "keyword": "搜索关键词-24", "count": 784, "range": 38, "status": 1 }, { "index": 26, "keyword": "搜索关键词-25", "count": 163, "range": 0, "status": 1 }, { "index": 27, "keyword": "搜索关键词-26", "count": 240, "range": 50, "status": 1 }, { "index": 28, "keyword": "搜索关键词-27", "count": 394, "range": 16, "status": 1 }, { "index": 29, "keyword": "搜索关键词-28", "count": 97, "range": 51, "status": 0 }, { "index": 30, "keyword": "搜索关键词-29", "count": 955, "range": 25, "status": 0 }, { "index": 31, "keyword": "搜索关键词-30", "count": 400, "range": 75, "status": 1 }, { "index": 32, "keyword": "搜索关键词-31", "count": 711, "range": 2, "status": 0 }, { "index": 33, "keyword": "搜索关键词-32", "count": 771, "range": 20, "status": 0 }, { "index": 34, "keyword": "搜索关键词-33", "count": 212, "range": 55, "status": 0 }, { "index": 35, "keyword": "搜索关键词-34", "count": 922, "range": 3, "status": 0 }, { "index": 36, "keyword": "搜索关键词-35", "count": 827, "range": 68, "status": 1 }, { "index": 37, "keyword": "搜索关键词-36", "count": 239, "range": 64, "status": 1 }, { "index": 38, "keyword": "搜索关键词-37", "count": 75, "range": 55, "status": 0 }, { "index": 39, "keyword": "搜索关键词-38", "count": 939, "range": 1, "status": 1 }, { "index": 40, "keyword": "搜索关键词-39", "count": 905, "range": 36, "status": 0 }, { "index": 41, "keyword": "搜索关键词-40", "count": 736, "range": 3, "status": 1 }, { "index": 42, "keyword": "搜索关键词-41", "count": 564, "range": 84, "status": 0 }, { "index": 43, "keyword": "搜索关键词-42", "count": 312, "range": 22, "status": 0 }, { "index": 44, "keyword": "搜索关键词-43", "count": 251, "range": 7, "status": 1 }, { "index": 45, "keyword": "搜索关键词-44", "count": 828, "range": 86, "status": 0 }, { "index": 46, "keyword": "搜索关键词-45", "count": 295, "range": 41, "status": 1 }, { "index": 47, "keyword": "搜索关键词-46", "count": 950, "range": 73, "status": 1 }, { "index": 48, "keyword": "搜索关键词-47", "count": 739, "range": 24, "status": 0 }, { "index": 49, "keyword": "搜索关键词-48", "count": 238, "range": 50, "status": 1 }, { "index": 50, "keyword": "搜索关键词-49", "count": 879, "range": 78, "status": 0 }], "offlineData": [{ "name": "Stores 0", "cvr": 0.6 }, { "name": "Stores 1", "cvr": 0.8 }, { "name": "Stores 2", "cvr": 0.2 }, { "name": "Stores 3", "cvr": 0.2 }, { "name": "Stores 4", "cvr": 0.5 }, { "name": "Stores 5", "cvr": 0.2 }, { "name": "Stores 6", "cvr": 0.9 }, { "name": "Stores 7", "cvr": 0.9 }, { "name": "Stores 8", "cvr": 0.2 }, { "name": "Stores 9", "cvr": 0.7 }], "offlineChartData": [{ "x": 1668169096447, "y1": 54, "y2": 43 }, { "x": 1668170896447, "y1": 56, "y2": 17 }, { "x": 1668172696447, "y1": 39, "y2": 27 }, { "x": 1668174496447, "y1": 102, "y2": 19 }, { "x": 1668176296447, "y1": 52, "y2": 21 }, { "x": 1668178096447, "y1": 16, "y2": 26 }, { "x": 1668179896447, "y1": 96, "y2": 59 }, { "x": 1668181696447, "y1": 76, "y2": 65 }, { "x": 1668183496447, "y1": 77, "y2": 39 }, { "x": 1668185296447, "y1": 29, "y2": 67 }, { "x": 1668187096447, "y1": 57, "y2": 59 }, { "x": 1668188896447, "y1": 61, "y2": 59 }, { "x": 1668190696447, "y1": 48, "y2": 109 }, { "x": 1668192496447, "y1": 92, "y2": 37 }, { "x": 1668194296447, "y1": 76, "y2": 73 }, { "x": 1668196096447, "y1": 62, "y2": 108 }, { "x": 1668197896447, "y1": 76, "y2": 69 }, { "x": 1668199696447, "y1": 24, "y2": 69 }, { "x": 1668201496447, "y1": 88, "y2": 73 }, { "x": 1668203296447, "y1": 54, "y2": 59 }], "salesTypeData": [{ "x": "家用电器", "y": 4544 }, { "x": "食用酒水", "y": 3321 }, { "x": "个护健康", "y": 3113 }, { "x": "服饰箱包", "y": 2341 }, { "x": "母婴产品", "y": 1231 }, { "x": "其他", "y": 1231 }], "salesTypeDataOnline": [{ "x": "家用电器", "y": 244 }, { "x": "食用酒水", "y": 321 }, { "x": "个护健康", "y": 311 }, { "x": "服饰箱包", "y": 41 }, { "x": "母婴产品", "y": 121 }, { "x": "其他", "y": 111 }], "salesTypeDataOffline": [{ "x": "家用电器", "y": 99 }, { "x": "食用酒水", "y": 188 }, { "x": "个护健康", "y": 344 }, { "x": "服饰箱包", "y": 255 }, { "x": "其他", "y": 65 }], "radarData": [{ "name": "个人", "label": "引用", "value": 10 }, { "name": "个人", "label": "口碑", "value": 8 }, { "name": "个人", "label": "产量", "value": 4 }, { "name": "个人", "label": "贡献", "value": 5 }, { "name": "个人", "label": "热度", "value": 7 }, { "name": "团队", "label": "引用", "value": 3 }, { "name": "团队", "label": "口碑", "value": 9 }, { "name": "团队", "label": "产量", "value": 6 }, { "name": "团队", "label": "贡献", "value": 3 }, { "name": "团队", "label": "热度", "value": 1 }, { "name": "部门", "label": "引用", "value": 4 }, { "name": "部门", "label": "口碑", "value": 1 }, { "name": "部门", "label": "产量", "value": 6 }, { "name": "部门", "label": "贡献", "value": 5 }, { "name": "部门", "label": "热度", "value": 7 }] } }
    return JSON.stringify(r)
  }

  @All("/fake_list")
  async fake_list(): Promise<string> {

    let r = { "data": { "list": [{ "id": "fake-list-0", "owner": "付小小", "title": "Alipay", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png", "cover": "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png", "status": "active", "percent": 97, "logo": "https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png", "href": "https://ant.design", "updatedAt": 1668178212037, "createdAt": 1668178212047, "subDescription": "那是一种内在的东西， 他们到达不了，也无法触及的", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 195233, "newUser": 1526, "star": 167, "like": 130, "message": 11, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{ "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽", "id": "member1" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君", "id": "member2" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜", "id": "member3" }] }, { "id": "fake-list-1", "owner": "曲丽丽", "title": "Angular", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png", "cover": "https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png", "status": "exception", "percent": 98, "logo": "https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png", "href": "https://ant.design", "updatedAt": 1668171012053, "createdAt": 1668171012053, "subDescription": "希望是一个好东西，也许是最好的，好东西是不会消亡的", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 124744, "newUser": 1399, "star": 193, "like": 150, "message": 19, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{ "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽", "id": "member1" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君", "id": "member2" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜", "id": "member3" }] }, { "id": "fake-list-2", "owner": "林东东", "title": "Ant Design", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png", "cover": "https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png", "status": "normal", "percent": 79, "logo": "https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png", "href": "https://ant.design", "updatedAt": 1668163812053, "createdAt": 1668163812053, "subDescription": "生命就像一盒巧克力，结果往往出人意料", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 155458, "newUser": 1431, "star": 113, "like": 116, "message": 15, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{ "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽", "id": "member1" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君", "id": "member2" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜", "id": "member3" }] }, { "id": "fake-list-3", "owner": "周星星", "title": "Ant Design Pro", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png", "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png", "status": "active", "percent": 61, "logo": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png", "href": "https://ant.design", "updatedAt": 1668156612053, "createdAt": 1668156612053, "subDescription": "城镇中有那么多的酒馆，她却偏偏走进了我的酒馆", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 189451, "newUser": 1454, "star": 189, "like": 192, "message": 18, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{ "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽", "id": "member1" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君", "id": "member2" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜", "id": "member3" }] }, { "id": "fake-list-4", "owner": "吴加好", "title": "Bootstrap", "avatar": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png", "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png", "status": "exception", "percent": 99, "logo": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png", "href": "https://ant.design", "updatedAt": 1668149412053, "createdAt": 1668149412053, "subDescription": "那时候我只会想自己想要什么，从不想自己拥有什么", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 128905, "newUser": 1871, "star": 180, "like": 175, "message": 16, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{ "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽", "id": "member1" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君", "id": "member2" }, { "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜", "id": "member3" }] }] } }
    return JSON.stringify(r)
  }


  @Post('/passport/jwt', { middleware: [JwtPassportMiddleware] })
  async jwtPassport() {
    console.log('jwt user: ', this.ctx.state.user);
    return this.ctx.state.user;
  }

  //生成token
  @Post('/jwt')
  async genJwt() {
    return {
      token: await this.jwt.sign({ msg: 'Hello Midway' }),
    };
  }

  @All('/login/outLogin')
  async outLogin() {
    this.ctx.cookies.set('token',"", { })
    return {
      success:true,
      data:{},
      message:"退出成功"
    };
  }

  @All('/rule')
  async rule() {
   return {"data":[{"key":99,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 99","owner":"曲丽丽","desc":"这是一段描述","callNo":736,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":20},{"key":98,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 98","owner":"曲丽丽","desc":"这是一段描述","callNo":171,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":64},{"key":97,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 97","owner":"曲丽丽","desc":"这是一段描述","callNo":527,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":79},{"key":96,"disabled":true,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 96","owner":"曲丽丽","desc":"这是一段描述","callNo":756,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":73},{"key":95,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 95","owner":"曲丽丽","desc":"这是一段描述","callNo":923,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":53},{"key":94,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 94","owner":"曲丽丽","desc":"这是一段描述","callNo":296,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":38},{"key":93,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 93","owner":"曲丽丽","desc":"这是一段描述","callNo":705,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":13},{"key":92,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 92","owner":"曲丽丽","desc":"这是一段描述","callNo":559,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":100},{"key":91,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 91","owner":"曲丽丽","desc":"这是一段描述","callNo":195,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":97},{"key":90,"disabled":true,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 90","owner":"曲丽丽","desc":"这是一段描述","callNo":700,"status":"3","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":55},{"key":89,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 89","owner":"曲丽丽","desc":"这是一段描述","callNo":990,"status":"3","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":71},{"key":88,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 88","owner":"曲丽丽","desc":"这是一段描述","callNo":443,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":40},{"key":87,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 87","owner":"曲丽丽","desc":"这是一段描述","callNo":687,"status":"3","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":39},{"key":86,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 86","owner":"曲丽丽","desc":"这是一段描述","callNo":312,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":52},{"key":85,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 85","owner":"曲丽丽","desc":"这是一段描述","callNo":529,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":44},{"key":84,"disabled":true,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 84","owner":"曲丽丽","desc":"这是一段描述","callNo":504,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":9},{"key":83,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 83","owner":"曲丽丽","desc":"这是一段描述","callNo":426,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":34},{"key":82,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 82","owner":"曲丽丽","desc":"这是一段描述","callNo":987,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":79},{"key":81,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 81","owner":"曲丽丽","desc":"这是一段描述","callNo":554,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":98},{"key":80,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 80","owner":"曲丽丽","desc":"这是一段描述","callNo":300,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":46}],"total":100,"success":true,"pageSize":20,"current":1}
  }

  @All('/CopyPage')
  async CopyPage(@Body() params: {}, @Query() query: {}) {
    let param = Object.assign(params, query)
    let page_id = param["id"] != null ? param["id"] : 0
    if(page_id<=0)
    {
      return {"code":1,success:false,"msg":"参数错误"}
    }
let page=await   this.dbopService.name("page").where("id=?", [page_id]).find()
if(page!=null)
{
delete page["id"]
page["name"]=page["name"]+"-副本"
page["add_time"]=common.unixtime10()
await   this.dbopService.name("page").insert(page)
}
 return {"code":0,success:true,"msg":"复制成功"}
}

@All('/CopyApi')
async CopyApi(@Body() params: {}, @Query() query: {}) {
  let param = Object.assign(params, query)
  let page_id = param["id"] != null ? param["id"] : 0
  if(page_id<=0)
  {
    return {"code":1,success:false,"msg":"参数错误"}
  }
let page=await   this.dbopService.name("api").where("id=?", [page_id]).find()
if(page!=null)
{
delete page["id"]
page["title"]=page["title"]+"-副本"
page["path"]=page["path"]+"2"
page["upd_time"]=common.unixtime10()

await   this.dbopService.name("api").insert(page)
}
return {"code":0,success:true,"msg":"复制成功"}
}


  @All('/list')
  async list(@Body() params: {}) {
//let page=params["page"]!=null?params["page"]:1
//let pagesize=params["pagesize"]!=null?params["pagesize"]:15

   return {"data":[{"key":99,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 99","owner":"曲丽丽","desc":"这是一段描述","callNo":736,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":20},{"key":98,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 98","owner":"曲丽丽","desc":"这是一段描述","callNo":171,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":64},{"key":97,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 97","owner":"曲丽丽","desc":"这是一段描述","callNo":527,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":79},{"key":96,"disabled":true,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 96","owner":"曲丽丽","desc":"这是一段描述","callNo":756,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":73},{"key":95,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 95","owner":"曲丽丽","desc":"这是一段描述","callNo":923,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":53},{"key":94,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 94","owner":"曲丽丽","desc":"这是一段描述","callNo":296,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":38},{"key":93,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 93","owner":"曲丽丽","desc":"这是一段描述","callNo":705,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":13},{"key":92,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 92","owner":"曲丽丽","desc":"这是一段描述","callNo":559,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":100},{"key":91,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 91","owner":"曲丽丽","desc":"这是一段描述","callNo":195,"status":"0","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":97},{"key":90,"disabled":true,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 90","owner":"曲丽丽","desc":"这是一段描述","callNo":700,"status":"3","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":55},{"key":89,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 89","owner":"曲丽丽","desc":"这是一段描述","callNo":990,"status":"3","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":71},{"key":88,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 88","owner":"曲丽丽","desc":"这是一段描述","callNo":443,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":40},{"key":87,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 87","owner":"曲丽丽","desc":"这是一段描述","callNo":687,"status":"3","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":39},{"key":86,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 86","owner":"曲丽丽","desc":"这是一段描述","callNo":312,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":52},{"key":85,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 85","owner":"曲丽丽","desc":"这是一段描述","callNo":529,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":44},{"key":84,"disabled":true,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 84","owner":"曲丽丽","desc":"这是一段描述","callNo":504,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":9},{"key":83,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 83","owner":"曲丽丽","desc":"这是一段描述","callNo":426,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":34},{"key":82,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 82","owner":"曲丽丽","desc":"这是一段描述","callNo":987,"status":"1","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":79},{"key":81,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png","name":"TradeCode 81","owner":"曲丽丽","desc":"这是一段描述","callNo":554,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":98},{"key":80,"disabled":false,"href":"https://ant.design","avatar":"https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png","name":"TradeCode 80","owner":"曲丽丽","desc":"这是一段描述","callNo":300,"status":"2","updatedAt":"2022-12-11T12:15:03.693Z","createdAt":"2022-12-11T12:15:03.693Z","progress":46}],"total":100,"success":true,"pageSize":20,"current":1}
  
  }


  @All('/SaveAdmin')
  async SaveAdmin(@Body() params: {}, @Query() query: {}) {
    let param:any = Object.assign(params, query)
    let result=null
    if(param?.password!=null && param?.password!="") 
    {
      param["login_salt"]=common.RandomString(8)
      param.password=common.pwd(param.password,param["login_salt"])
    }
    else
    delete  param["password"]
    //console.log("提交的信息为",param)
    if (param?.id) {
    let  id=param.id
      delete param["id"]
     result = await await this.dbopService.name("admin").where("id=?", [id]).update(params)
    }
    else
    {
      result = await await this.dbopService.name("admin").insert(params)
    }
 return {
      success:true,
      code:0,
      data:result,
      msg:"保存成功"
    };
  }
//获取所有的表格视图字段
@All('/DBList')
async DBList(@Body() params: {}, @Query() query: {})
{

    let config= this.app.getConfig()
    
    let DataBaseConfig= config.mysql
   return DataBaseConfig

    /*
  let sql = `SELECT * FROM information_schema.tables where TABLE_TYPE="BASE TABLE" and table_schema =? limit 300`
  let tablesList = await this.dbopService.query(sql, [config.database])
  sql = `SELECT * FROM information_schema.COLUMNS WHERE  table_schema =? `
  let COLUMNS = await this.dbopService.db(pool).query(sql, [dbname])

  //获取所有的外键信息
  sql = `SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_COLUMN_NAME is not null and CONSTRAINT_NAME<>'PRIMARY' and constraint_schema=? `
  let foreigns = await this.dbopService.db(pool).query(sql, [dbname])
  let refs = []
  refs = foreigns.map((item, index, array) => {
    let row = { "name": item["TABLE_NAME"],"id": item["TABLE_NAME"] }
    let endpoints = []
    endpoints.push({ "fieldNames": [item["COLUMN_NAME"]], "relation": "*", "tableName": item["TABLE_NAME"] })
    endpoints.push({ "fieldNames": [item["REFERENCED_COLUMN_NAME"]], "relation": "1", "tableName": item["REFERENCED_TABLE_NAME"] })
    row["endpoints"] = endpoints
    return row
  })


  let tables = tablesList.map((item, index, array) => {
    // return array[index]; //用这种方法也可以获取到当前处理的元素
    let row = { "name": item["TABLE_NAME"] , "id": item["TABLE_NAME"]}
    row["engine"] = item["ENGINE"]
    row["create_time"] = item["CREATE_TIME"]
    row["note"] = item["TABLE_COMMENT"]
    let columnsCurrentTable = COLUMNS.filter((column_item, index2, array2) => {
      return column_item["TABLE_NAME"] == item["TABLE_NAME"]


    });
   // console.log("哈哈", columnsCurrentTable)
    let columns = columnsCurrentTable.map((column_item, index2, array2) => {

      let columnrow = { "name": column_item["COLUMN_NAME"] }
      columnrow["dbdefault"] = column_item["COLUMN_DEFAULT"]
      if (column_item["EXTRA"] == "auto_increment")
        columnrow["increment"] = true

        if (column_item["COLUMN_KEY"] == "UNI")
        columnrow["unique"] = true

      let COLUMN_TYPE = column_item["COLUMN_TYPE"]
      if (COLUMN_TYPE != null) {
        let type_name = COLUMN_TYPE
if(type_name.indexOf("unsigned") > 0)
{
columnrow["unsigned"] = true
}


        if (type_name.indexOf(" ") > 0)
          type_name = COLUMN_TYPE.substring(0, COLUMN_TYPE.indexOf(" "))
        columnrow["type"] = { "type_name": type_name, "args": null }
      }
      columnrow["note"] = column_item["COLUMN_COMMENT"]
      if (column_item["COLUMN_KEY"] == "PRI")
        columnrow["pk"] = true

      if (column_item["IS_NULLABLE"] != "YES")
        columnrow["not_null"] = true
      else
        columnrow["not_null"] = false
      return columnrow

    });
    row["fields"] = columns
    return row;
  });

  let data = { "tables": tables, "name": "public", "note": "", "refs": refs, "tableGroups": [] }



  return { success: true, msg: '加载数据成功', code: 0, "data":data};
  */
}
//获取某个角色的数据权限
@All('/GetRoleManageTableFields')
async GetRoleManageTableFields(@Body() params: {}, @Query() query: {})
{
let param:any = Object.assign(params, query)

let role_id=param?.id

//let role=await this.dbopService.name("role").where("id>=?",[role_id]).select()

let rs:any=[]
if(role_id>1)
 rs=await this.dbopService.name("role_menu").where("role_id=?",[role_id]).select()
else
rs=await this.dbopService.name("role_menu").where("role_id>=?",[0]).select()

 let menu_ids=[]
if(rs !=null && common.isArray(rs))
{
for(let i in rs)
{
  menu_ids.push(rs[i].menu_id)
}
}
let data={"role_menu":menu_ids}
return { success: true, msg: '加载数据成功', code: 0,data:data };
}

@All('/DatabaseList')
async DatabaseList(@Body() params: {}, @Query() query: {}) {
let rs:any=await this.dbopService.name("db").where("status>?",[0]).select()

rs.splice(0, 0, {name:"default",title:"默认数据库"});
return { success: true, msg: '加载数据成功', code: 0,data:rs };
}


@All('/*')
async common(@Body() params: {}, @Query() query: {}) {

return { success: true, msg: '加载数据成功2', code: 0,path:this.ctx.path};
}

}
