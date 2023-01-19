// service
import { Provide, Scope, ScopeEnum ,Config,Init} from '@midwayjs/decorator';
import * as mysql from "mysql2"
import {common} from "../lib/common";
@Provide()
@Scope(ScopeEnum.Singleton)
export class DBService {
    connection=null;
    prefix:string="l_";
    Table:string=""
    Where:string=""
    WhereParam:any[]=[]
    Page:number=1
    PageSize:number=20
    Order:string=""
    Fields:string="*"
    Pools: Record<string, mysql.Pool> ={}
    pool:string="default"

// 建立链接
@Config('mysql')
config;


  constructor() {


    return 
  //  connection.connect();
  //  this.connection = connection 
}

@Init()
async init() {
//console.log("参数是",this.config)
  var pool = mysql.createPool({
    host: this.config.host,
    user: this.config.user,
    password: this.config.password,
    database: this.config.database
});
this.Pools["default"]=pool;


const DbList:any=await this.query(`select * from ${this.config.prefix}db where status=1`)

if(DbList!=null)
 {
    DbList.forEach(element => {
      const pool2 = mysql.createPool({
        host: element["host"],
        user: element["username"],
        password: element["password"],
        database:element["dbname"]
    });
  
    this.Pools[element["name"]]=pool2;
     });
 }
 
  await new Promise(resolve => {
 

resolve("")
  });
}


table(Table="")
{
  this.Table=Table
 return this
}

name(Table:string="")
{
  this.Table=this.prefix+Table
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

select()
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
console.log("select语句",sql)
 // 获取数据库链接对象
 //var connection =  this.connection;
 const that=this
 return new Promise(function (reject, resolve) {
  
     // 执行SQL语句
     that.Pools[that.pool].getConnection(function(err, connection) {

      if(err){
        console.log("建立连接失败");
        reject({"code":-1,"msg":"建立连接失败"});
      }
      else{
       
        // 执行SQL语句
        connection.query(sql, parmas, function (error, results, fields) {
            if (error) 
            {
              resolve(
                error
            );
            }
            connection.release();
            resolve(
              results
          );
            //reject(results);
        });
        // 关闭链接
      //  connection.end();
      }
    
   
})

     
     // 关闭链接
   //  connection.end();
 })
}


insert(parmas:object)
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

let that=this
 return new Promise(function (reject, resolve) {
     // 执行SQL语句
     that.Pools[that.pool].getConnection(function(err, connection) {

      if(err){
        console.log("建立连接失败");
        reject({"code":-1,"msg":"建立连接失败"});
      }
      else{
       
        // 执行SQL语句
        connection.query(sql, p, function (error, results, fields) {
            if (error) 
            {
              reject(
                error
            );
            }
            connection.release();
            reject(
              results
          );
            //reject(results);
        });
        // 关闭链接
      //  connection.end();
      }
    
   
})
     // 关闭链接
   //  connection.end();
 })
}
//查询语句
  query(sql, parmas = null,pool="default") {
    // 获取数据库链接对象
    const that=this
    return new Promise((resolve, reject) => {
        that.Pools[pool].getConnection(function(err, connection) {

      if(err){
        console.log("建立连接失败");
        reject({"code":-1,"msg":"建立连接失败"});
      }
      else{
       
        // 执行SQL语句
        connection.query(sql, parmas, function (error, results, fields) {
            if (error) 
            {
              resolve(
                error
            );
            }
            connection.release();
            resolve(
              results
          );
            //reject(results);
        });
        // 关闭链接
      //  connection.end();
      }
    
   
})
})


}




update( parmas = null) {
   let that=this
    // 获取数据库链接对象
   // var connection =  this.connection;
    return new Promise(function (reject, resolve) {
        // 执行SQL语句
  if (parmas==null)
  {
    reject(null)
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
  console.log("update sql",sql)
  
  that.Pools[that.pool].getConnection(function(err, connection) {

    if(err){
      console.log("建立连接失败");
      reject({"code":-1,"msg":"建立连接失败"});
    }
    else{
     
      // 执行SQL语句
      connection.query(sql, p, function (error, results, fields) {
          if (error) 
          {
            reject(
              error
          );
          }
          connection.release();
          reject(
            results
        );
          //reject(results);
      });
      // 关闭链接
    //  connection.end();
    }
  
 
})
        // 关闭链接
      //  connection.end();
    })
}

delete() {
  let that=this
   // 获取数据库链接对象
  // var connection =  this.connection;
   return new Promise(function (reject, resolve) {
       // 执行SQL语句

 let sql = `delete from ${that.Table}   `;
 if(that.Where!="")
 {
   sql+=" where "+that.Where
 }

 console.log("update sql",sql)
 that.Pools[that.pool].getConnection(function(err, connection) {

  if(err){
    console.log("建立连接失败");
    reject({"code":-1,"msg":"建立连接失败"});
  }
  else{
   
    // 执行SQL语句
    connection.query(sql, that.WhereParam, function (error, results, fields) {
        if (error) 
        {
          reject(
            error
        );
        }
        connection.release();
        reject(
          results
      );
        //reject(results);
    });
    // 关闭链接
  //  connection.end();
  }


})
       // 关闭链接
     //  connection.end();
   })
}


count(field="*")
{
 let sql=""
 let parmas=this.WhereParam
sql=`select count(${field}) as c from  ${this.Table} `
if(this.Where!="")
sql+=` where  ${this.Where} `
let that=this


console.log("count语句",sql)
 // 获取数据库链接对象
 //var connection =  this.connection;
 return new Promise(function (reject, resolve) {
     // 执行SQL语句
     that.Pools[that.pool].getConnection(function(err, connection) {

      if(err){
        console.log("建立连接失败");
        reject({"code":-1,"msg":"建立连接失败"});
      }
      else{
       
        // 执行SQL语句
        connection.query(sql, parmas, function (error, results, fields) {
            if (error) 
            {
              reject(
                error
            );
            }
            connection.release();
            reject(
              results[0]["c"]
          );
            //reject(results);
        });
        // 关闭链接
      //  connection.end();
      }
    
   
})
     // 关闭链接
   //  connection.end();
 })
}
sum(field="id")
{
 let sql=""
 let parmas=this.WhereParam
sql=`select sum(${field}) as c from  ${this.Table} `
if(this.Where!="")
sql+=` where  ${this.Where} `



console.log("sum语句",sql)
 // 获取数据库链接对象
const that=this
 return new Promise(function (reject, resolve) {
     // 执行SQL语句
     that.Pools[that.pool].getConnection(function(err, connection) {

      if(err){
        console.log("建立连接失败");
        reject({"code":-1,"msg":"建立连接失败"});
      }
      else{
       
        // 执行SQL语句
        connection.query(sql, parmas, function (error, results, fields) {
            if (error) 
            {
              reject(
                error
            );
            }
            connection.release();
            reject(
              results[0]["c"]
          );
            //reject(results);
        });
        // 关闭链接
      //  connection.end();
      }
    
   
})
     // 关闭链接
   //  connection.end();
 })
}
  
}