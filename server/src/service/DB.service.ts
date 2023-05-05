// service
import { Provide, Scope, ScopeEnum, Config, Init, App } from '@midwayjs/decorator';
import { Application } from '@midwayjs/koa';
import * as mysql from "mysql2"
import { common } from "../lib/common";
@Provide()
@Scope(ScopeEnum.Singleton)
export class DBService {
  connection = null;
  prefix: string = "l_";
  Table: string = ""
  table_name: string = ""
  Where: string = ""
  WhereParam: any[] = []
  Page: number = 1
  PageSize: number = 20
  Order: string = ""
  Fields: string = "*"
  Pools: Record<string, mysql.Pool> = {}
  pool: string = "default"
  Prefixs: Record<string, string> = {}
  // 建立链接
  @Config('mysql')
  config;


  @App()
  app: Application;


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
    this.Pools["default"] = pool;
    this.Prefixs["default"] = this.config.prefix

    const DbList: any = await this.query(`select * from ${this.config.prefix}db where status=1`)

    if (DbList != null) {
      DbList.forEach(element => {
        try {
          const pool2 = mysql.createPool({
            host: element["host"],
            user: element["username"],
            password: element["password"],
            database: element["dbname"]
          });
          if (pool2 != null) {
            this.Pools[element["name"]] = pool2;
            this.Prefixs[element["name"]] = element["prefix"]
          }

        }
        catch (e) {
          console.log("连接数据库失败", element["dbname"], element["name"])
        }


      });
    }

    //初始化参数
    const ConfigList: any = await this.query(`select * from ${this.config.prefix}config `)
    const config = this.app.getConfig()
    const ossconfig = config["oss"]["clients"]["default"]
    if (ConfigList != null) {

      ConfigList.forEach(element => {
        const type = element["type"]
        if (type == "oss") {
          ossconfig[element["name"]] = element["value"]
          this.app.addConfigObject({ "oss": {"clients":{"default":ossconfig}}})
        }
        else
        {
let CurrentConfig=config[type]?config[type]:{}
CurrentConfig[element["name"]]=element["value"]
this.app.addConfigObject({ [type]: CurrentConfig})
        }
          
      });
    }
    await new Promise(resolve => {


      resolve("")
    });
  }

  async addPool(element: any) {
    let r = {
      "data": {},
      success: true,
      code: 0,
      msg: "连接数据库成功7"
    }

    let pool2 = null
    try {
      pool2 = mysql.createPool({
        host: element["host"],
        user: element["username"],
        password: element["password"],
        database: element["dbname"]
      });
      if (pool2 != null) {
        this.Pools[element["name"]] = pool2;
        this.Prefixs[element["name"]] = element["prefix"]
      }

    }
    catch (e) {
      r.msg = "连接数据库失败5" + e.toString()
      r.code = 1
      console.log("连接数据库失败5", element["dbname"], element["name"], e.toString())
    }

    try {
      await new Promise<mysql.PoolConnection>((resolve, reject) => {
        pool2.getConnection((err, conn) => {
          if (err) {

            reject(err);
          } else {
            r.msg = "连接数据库成功"
            r.code = 0
            resolve(conn);
          }
        });
      });

      console.log('Connected to database!');
      // return connection;
    } catch (error) {
      console.error('Error connecting to database:', error);
      r.msg = "连接数据库失败" + error.toString()
      r.code = 1
      //throw error;
    }

    return r
  }

  table(Table = "") {
    this.Table = Table
    return this
  }

  name(Table: string = "") {
    this.table_name = Table

    return this
  }


  where(Where: string = "", WhereParam: any[] = []) {
    this.Where = common.trim(Where)
    this.WhereParam = WhereParam
    return this
  }

  page(Page: number | string = 1) {
    if (typeof (Page) == "string")
      Page = Number(Page)
    this.Page = Page
    return this
  }
  pagesize(PageSize: number | string = 1) {
    if (typeof (PageSize) == "string")
      PageSize = Number(PageSize)
    this.PageSize = PageSize
    return this
  }
  order(Order: string = "") {
    this.Order = common.trim(Order)
    return this
  }
  fields(Fields: string = "") {
    this.Fields = Fields
    return this
  }

  select() {
    let sql = ""
    let parmas = this.WhereParam
    sql = `select ${this.Fields} from  ${this.Table} `
    if (this.Where != "")
      sql += ` where  ${this.Where} `

    if (this.Order != "") {
      sql += ` order by ${this.Order}`
    }
    let start: number = (this.Page - 1) * this.PageSize
    let limit: string = ` limit ${start},${this.PageSize}`
    sql += limit
    console.log("select语句", sql)
    // 获取数据库链接对象
    //var connection =  this.connection;
    const that = this
    return new Promise(function (reject, resolve) {

      // 执行SQL语句
      that.Pools[that.pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, parmas, function (error, results, fields) {
            if (error) {
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


  insert(parmas: object) {

    let fields = []
    let p = []
    for (let key in parmas) {
      fields.push(key)
      p.push(parmas[key].toString())
    }
    let fieldsstr = fields.join(",")
    let v = ",?".repeat(fields.length);
    v = v.substring(1)
    var sql = `insert into ${this.Table} (` + fieldsstr + `) value (` + v + `)`;
    //  console.log("insert数据",v)
    //console.log("insert语句",sql)
    // 获取数据库链接对象

    let that = this
    return new Promise(function (reject, resolve) {
      // 执行SQL语句
      that.Pools[that.pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, p, function (error, results, fields) {
            if (error) {
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
  query(sql, parmas = null, pool = "default") {
    // 获取数据库链接对象
    const that = this
    return new Promise((resolve, reject) => {
      that.Pools[pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, parmas, function (error, results, fields) {
            if (error) {
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




  update(parmas = null) {
    let that = this
    // 获取数据库链接对象
    // var connection =  this.connection;
    return new Promise(function (reject, resolve) {
      // 执行SQL语句
      if (parmas == null) {
        reject(null)
      }
      let fields: string[] = []
      let p = []
      let fieldsstr = ""
      for (let key in parmas) {
        fields.push(key)
        p.push(parmas[key].toString())
        if (fieldsstr == "") {
          fieldsstr = key + "=?"
        }
        else {
          fieldsstr += "," + key + "=?"
        }
      }

      let v = ",?".repeat(fields.length);
      v = v.substring(1)

      let sql = `update ${that.Table}   set ` + fieldsstr + ` `;
      if (that.Where != "") {
        sql += " where " + that.Where
      }
      if (that.WhereParam != null)
        p = p.concat(that.WhereParam)
      console.log("update sql", sql)

      that.Pools[that.pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, p, function (error, results, fields) {
            if (error) {
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
    let that = this
    // 获取数据库链接对象
    // var connection =  this.connection;
    return new Promise(function (reject, resolve) {
      // 执行SQL语句

      let sql = `delete from ${that.Table}   `;
      if (that.Where != "") {
        sql += " where " + that.Where
      }

      console.log("update sql", sql)
      that.Pools[that.pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, that.WhereParam, function (error, results, fields) {
            if (error) {
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


  count(field = "*") {
    let sql = ""
    let parmas = this.WhereParam
    sql = `select count(${field}) as c from  ${this.Table} `
    if (this.Where != "")
      sql += ` where  ${this.Where} `
    let that = this


    console.log("count语句", sql)
    // 获取数据库链接对象
    //var connection =  this.connection;
    return new Promise(function (reject, resolve) {
      // 执行SQL语句
      that.Pools[that.pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, parmas, function (error, results, fields) {
            if (error) {
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
  sum(field = "id") {
    let sql = ""
    let parmas = this.WhereParam
    sql = `select sum(${field}) as c from  ${this.Table} `
    if (this.Where != "")
      sql += ` where  ${this.Where} `



    console.log("sum语句", sql)
    // 获取数据库链接对象
    const that = this
    return new Promise(function (reject, resolve) {
      // 执行SQL语句
      that.Pools[that.pool].getConnection(function (err, connection) {

        if (err) {
          console.log("建立连接失败");
          reject({ "code": -1, "msg": "建立连接失败" });
        }
        else {

          // 执行SQL语句
          connection.query(sql, parmas, function (error, results, fields) {
            if (error) {
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