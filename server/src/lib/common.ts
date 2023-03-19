import {SHA1,MD5} from 'crypto-js'
import * as crypto from 'crypto'
export class common{

// TypeScript代码，JavaScript使用请去除类型强制
static ltrim = (str:string, key: string=" ") => {
    return !str.startsWith(key) ? str : str.slice(key.length);
}
 
static rtrim = (str:string, key: string=" ") => {
    return !str.endsWith(key) ? str : str.slice(0, str.length - key.length);
}
 
static trim = (str:string, key: string=" ") => {
    return common.rtrim(common.ltrim(str, key), key);
}
static pwd = (password:string, salt: string="") => {
    return SHA1(password+"|"+salt).toString();
}

static md5 = (s) => {
   return crypto.createHash('md5').update(String(s)).digest('hex')
}
static pwdmd5 = (password:string, salt: string="") => {
//let pwd= common.md5(salt+password).toString();
let pwd= MD5(salt+password).toString();

//pwd = enc.Utf8.parse(pwd);
return pwd
}

static salt = () => {
    var salt=crypto.randomBytes(10).toString('base64');
    return salt
}
static unixtime13 = (d = new Date()):number => {
return d.valueOf()
}
static unixtime10= (d = new Date()):string => {
    let utime:string|number= d.valueOf()
    utime=utime.toString().substring(0,10)
    return utime
    }

static DateTime = (unixtime = 0) => {
       
 let   d = new Date(unixtime);
return d
}
//格式化日期
static FormatDate =( date:Date=new Date())=>{
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return (
      [year, month, day].map(common.formatNumber).join('-') +
      ' ' +
      [hour, minute, second].map(common.formatNumber).join(':')
    )
  }
  
  static formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }

  //获取对象的长度
  static len = (obj: any) => {
   let num=0
   if(obj==null)
   return num
   if(typeof(obj)!="object")
   {
    return num
   }
    for(let k in obj){
        k=k
        num++
      }
      return num
  }

//去重复的函数
static uniqueArray<T>(arr: T[]): T[] {
  return arr.filter((item, index, array) => {
    return array.indexOf(item) === index;
  });
}

//多级分类 根据list生成多级分类 children  
 
 static GenTree=(rs:Array<any>,data:Array<any>,ChildName:string="routes")=>
{
    if(data==null)
      return
    
    if(rs==null || rs.length==0  ){
        for (let x in   data)
        {
            if(data[x]["pid"]==-1)
            {
                rs.push(data[x])
            }
           
        }
    }
      
          
    for(let i in rs)
    {
     let x=rs[i]
    let  children=[]
    let  id=x["id"]
      for(let y in data)
      {
        if(data[y]["pid"]==id)
          children.push(data[y])
        }    
      if (children.length>0)
   {
         common.GenTree(children,data,ChildName)
        x[ChildName]=children
        rs[i]=x
    }
      else
        rs[i]=x
    }

    }


    static GenTreePid0=(rs:Array<any>,data:Array<any>,ChildName:string="routes")=>
{
    if(data==null)
      return
    
    if(rs==null || rs.length==0  ){
        for (let x in   data)
        {
            if(data[x]["pid"]==0)
            {
                rs.push(data[x])
            }
           
        }
    }
      
          
    for(let i in rs)
    {
     let x=rs[i]
    let  children=[]
    let  id=x["id"]
      for(let y in data)
      {
        if(data[y]["pid"]==id)
          children.push(data[y])
        }    
      if (children.length>0)
   {
         common.GenTree(children,data,ChildName)
        x[ChildName]=children
        rs[i]=x
    }
      else
        rs[i]=x
    }

    }


    static  get_file_suffix =(filename:string) =>{
     let pos = filename.lastIndexOf('.')
    let  suffix = ''
      if (pos != -1) {
        suffix = filename.substring(pos)
      }
      return suffix;
    }
static GenUUID=(filename):string=>{
  let ext=common.get_file_suffix(filename)
  if(ext==null  || ext=="")
  ext=".jpg"
return common.unixtime13().toString()+ext
}

 //判断是否是数组
 static   isArray = (v:any)=>{
  return toString.apply(v) === '[object Array]';
  }

  static RandomString(length: number)  {
    let outString: string = '';
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {

      outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));

    }

    return outString;
  }


 }
   