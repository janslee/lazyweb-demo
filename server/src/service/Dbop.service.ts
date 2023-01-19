// service
import { Provide, Scope, ScopeEnum ,Init,Inject,Config} from '@midwayjs/decorator';

import {common} from "../lib/common";
import { DBService } from './DB.service';
@Provide()
@Scope(ScopeEnum.Request)
export class DbopService {

    prefix:string="l_";
    Table:string=""
    Where:string=""
    WhereParam:any[]=[]
    Page:number=1
    PageSize:number=20
    Order:string=""
    Fields:string="*"
    pool:string="default"


    @Config('mysql')
    config;


    @Inject()
    dBService: DBService;

  constructor() {


    return 
}

@Init()
async init() {

}
db(poolName="")
{
 this.pool=poolName
 return this
}

table(Table="")
{
  this.Table=Table
 return this
}

name(Table:string="")
{
  this.Table=this.config.prefix+Table
  return this
}


where(Where:string="",WhereParam:any[]=[])
{
  this.Where=common.trim(Where)
  this.WhereParam=WhereParam
  return this
}

page(Page:number|string=1)
{
if(typeof(Page)=="string")
Page=Number(Page)
this.Page=Page
return this
}
pagesize(PageSize:number|string=1)
{
if(typeof(PageSize)=="string")
PageSize=Number(PageSize)
this.PageSize=PageSize
return this
}

limit(PageSize:number|string=1)
{
if(typeof(PageSize)=="string")
PageSize=Number(PageSize)
this.PageSize=PageSize
return this
}

order(Order:string="")
{
this.Order=common.trim(Order)
return this
}
fields(Fields:string="")
{
this.Fields=Fields
return this
}

async select()
{
 let sql=""
 let parmas=this.WhereParam
sql=`select ${this.Fields} from  ${this.Table} `
if(this.Where!="")
sql+=` where  ${this.Where} `

if(this.Order!="")
{
  sql+=` order by ${this.Order} `
}
let start:number=(this.Page-1)*this.PageSize
let limit:string=` limit ${start},${this.PageSize}`
sql+=limit

//console.log("select语句",sql)
 // 获取数据库链接对象
 //var connection =  this.connection;
 let rs=await this.dBService.query(sql,parmas,this.pool)
 return rs
}

async find()
{
 let sql=""
 let parmas=this.WhereParam
sql=`select ${this.Fields} from  ${this.Table} `
if(this.Where!="")
sql+=` where  ${this.Where} `

if(this.Order!="")
{
  sql+=` order by ${this.Order}`
}
let start:number=(this.Page-1)*this.PageSize
let limit:string=` limit ${start},${this.PageSize}`
sql+=limit

//console.log("select语句",sql)
 // 获取数据库链接对象
 //var connection =  this.connection;
 let rs:any=await this.dBService.query(sql,parmas,this.pool)
 //console.log("find结果",rs)
 if(typeof(rs)=="undefined" || rs==null || rs.length==0)
 {
return null
 }
 else
 {
  rs=rs[0]
 }
 return rs
}
    async insert(parmas:object)
{

let fields=[]
let p=[]
for (let key in parmas)
{
    fields.push(key)
    p.push(parmas[key].toString())
  }
  let fieldsstr=fields.join(",")
  let v=",?".repeat(fields.length);
  v=v.substring(1)
  var sql = `insert into ${this.Table} (`+fieldsstr+`) value (`+v+`)`;
//  console.log("insert数据",v)
//console.log("insert语句",sql)
 // 获取数据库链接对象
 let rs:any=await this.dBService.query(sql,p,this.pool)
 let id:number=0
  if(rs!=null && rs?.insertId!=null)
  id=rs?.insertId
//console.log("rs",rs.affectedRows)
return id
}
//查询语句
async query(sql, parmas = null):Promise<any> {
    // 获取数据库链接对象
    let rs=await this.dBService.query(sql,parmas,this.pool)
    return rs
}




async update( parmas = null) {
   let that=this

    // 获取数据库链接对象
   // var connection =  this.connection;
  // 执行SQL语句
  if (parmas==null)
  {
    return null
  }
  let fields:string[]=[]
  let p=[]
  let fieldsstr=""
for (let key in parmas)
{
    fields.push(key)
    p.push(parmas[key].toString())
    if (fieldsstr=="")
    {
        fieldsstr=key+"=?"
    }
    else
    {
        fieldsstr+=","+key+"=?" 
    }
  }
 
  let v=",?".repeat(fields.length);
  v=v.substring(1)

  let sql = `update ${that.Table}   set `+fieldsstr+` `;
  if(that.Where!="")
  {
    sql+=" where "+that.Where
  }
  if(that.WhereParam!=null)
  p=p.concat(that.WhereParam)
  //console.log("update sql",sql)
  

  let rs:any=await this.dBService.query(sql,p,this.pool)
 let num:number=0
  if(rs!=null && rs?.affectedRows!=null)
  num=rs?.affectedRows
//console.log("rs",rs.affectedRows)
return num
// 关闭链接
//  connection.end();
}

    async delete() {
  let that=this
   // 获取数据库链接对象
  // var connection =  this.connection;

       // 执行SQL语句

 let sql = `delete from ${that.Table}   `;
 if(that.Where!="")
 {
   sql+=" where "+that.Where
 }

 let rs:any=await this.dBService.query(sql,that.WhereParam,that.pool)
 let num:number=0
 if(rs!=null && rs?.affectedRows!=null)
 num=rs?.affectedRows
//console.log("rs",rs.affectedRows)
return num

}


async count(field="*")
{
 let sql=""
 let parmas=this.WhereParam
sql=`select count(${field}) as c from  ${this.Table} `
if(this.Where!="")
sql+=` where  ${this.Where} `
//console.log("count语句",sql)
 // 获取数据库链接对象
 //var connection =  this.connection;
 
 let rs=await this.dBService.query(sql,parmas,this.pool)

 if(rs!=null && rs[0]!=null && rs[0]["c"]!=null)
 return rs[0]["c"]
 else
 return 0
}

    async sum(field="id")
{
 let sql=""
 let parmas=this.WhereParam
sql=`select sum(${field}) as c from  ${this.Table} `
if(this.Where!="")
sql+=` where  ${this.Where} `

//console.log("sum语句",sql)
 // 获取数据库链接对象

let rs=await this.dBService.query(sql,parmas,this.pool)
return rs[0]["c"]
     // 关闭链接
   //  connection.end();

}
  
}