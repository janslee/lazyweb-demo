
import * as crypto from 'crypto'
export class common{


    //json转字符串a=1
    static jsonToUrlParam=(json:any) =>{
        return new URLSearchParams(json).toString();
    }

static ParseJson2Urlparam=(data:any) =>{
        try {
            var tempArr = [];
            for (var i in data) {
                var key = encodeURIComponent(i);
                var value = encodeURIComponent(data[i]);
                tempArr.push(key + '=' + value);
            }
            var urlParamsStr = tempArr.join('&');
            return urlParamsStr;
        } catch (err) {
            return '';
        }
    }   
    

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

static md5 = (s) => {
   return crypto.createHash('md5').update(String(s)).digest('hex')
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

//多级分类 根据list生成多级分类 children  
 
 static GenTree=(rs:Array<any>,data:Array<any>)=>
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
         common.GenTree(children,data)
        x["routes"]=children
        rs[i]=x
    }
      else
        rs[i]=x
    }

    }

 //判断是否是数组
static   isArray = (v:any)=>{
  return toString.apply(v) === '[object Array]';
  }

     //使用promise封装fetch
     static     post=async (url:string,data:any)=> {
  
      return new Promise((resolve, reject) => {
        fetch(url,{
          method: 'post',
          body: common.jsonToUrlParam(data),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
          .then(res => res.json())
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
    }
   
    static getCookie(key: string): string | number | undefined {
      const name = key + "=";
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return undefined;
    }
  
    /**
     * 设置cookie
     * @param key cookie名称/键名
     * @param value cookie值
     * @param exp cookie到期时间戳
     * 无效 原因未知
     */
    static setCookie(key: string, value: string | number, Days: number=1) {

      var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
      const expires = "expires=" + exp.toUTCString();
     
      return (document.cookie =document.cookie+";"+ key + "=" + value + "; " + expires);
    }
  
    /**
     * 删除cookie
     * @param key cookie名称/键名
     */
    static deleteCookie(key: string) {
      return (document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    }

 }




