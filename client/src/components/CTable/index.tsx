
import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, InputNumber, Space, Table, Tooltip,DatePicker, message, Select, Popconfirm } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import qs from 'qs';
import { observable ,autorun} from '@formily/reactive'
import { request } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn'
import moment from 'moment';
import { common } from '@/lib/common';

const { RangePicker } = DatePicker;
interface TableParams {
  pagination?: TablePaginationConfig;
  field?: string;
  order?: string;
  filters?: Record<string, FilterValue>;
}



let columns = [
  { title: 'ID', dataIndex: 'id',width:"5%"},
   { title: '品目', dataIndex: 'catname', sorter: true, width: '10%', 
options:[{"label":"计算机","value":12}],
isSearch:true,
searchType:"select"
   }, 
 { title: '商品名称', dataIndex: 'name',
 isSearch:true,searchType:"string",
  sorter: true, width: '20%', }, 
{ title: '图片', dataIndex: 'img', sorter: true, width: '20%', render:(img:any,recored:any,index:any)=>( React.createElement('img',{"src":img,"height":80},null))}, 
 { title: '品牌', dataIndex: 'brandname', 
 filters: [{ text: '绿联', value: '绿联' },
{ text: '得力品正', value: '得力品正' },]
, width: '20%', },
  { title: '价格', dataIndex: 'price',
 isSearch:true,searchType:"number",
  sorter: true, width: '7%', }, 
     { title: '时间', dataIndex: 'add_time',
 isSearch:true,searchType:"date",
  sorter: true, width: '10%', }, 
];

const getRandomuserParams = (params: TableParams) => ({
  pageSize: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

let searchParam = observable({})


autorun(() => {
  console.log("searchParam",searchParam)
})



export const CTable: React.FC= (props:any) => {
  
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      showQuickJumper: true,
      pageSize: 10,
      total:0,
    },
  });



let url=`/api/Select?table_name=sz_goods`
//console.log("地址",props)

if(props?.api!=null && props?.api!="")
{
  url=props?.api
  
 
  
}
let CurrentUrl=location.href;
if(CurrentUrl.indexOf("3000")>0)
  {
    url="http://127.0.0.1:7000"+url
  }
if(props?.columns!=null && props?.columns!="")
{
 //alert(props?.columns)
 try{
let CustomComumn=eval(props?.columns)
if(CustomComumn!=null)
{
  for(let i in CustomComumn)
  {
    if(CustomComumn[i]!=null && CustomComumn[i]["width"]!=null)
    {
      if(String(CustomComumn[i]["width"]).indexOf("%")<0)
     {

   CustomComumn[i]["width"]=parseInt(CustomComumn[i]["width"])
     }
    }
    if(CustomComumn[i]!=null && CustomComumn[i]["render"]!=null && CustomComumn[i]["render"]!="" && typeof(CustomComumn[i]["render"])=="string")
    {

      let render=CustomComumn[i]["render"].trim()
      render.replace("{{","")
      render.replace("}}","")
      try{
        let re=eval(render)
        CustomComumn[i]["render"]=re
      }
      catch(e)
      {
        console.log("渲染函数转换失败",e)
      }
      console.log("需要处理",CustomComumn[i]["render"])
  //    CustomComumn[i]["render"]=eval(CustomComumn[i]["render"])
    }

    if(CustomComumn[i]!=null && CustomComumn[i]["options"]!=null && CustomComumn[i]["options"]!="" && typeof(CustomComumn[i]["options"])=="string")
    {

      let options=CustomComumn[i]["options"].trim()
      options.replace("{{","")
      options.replace("}}","")
      try{
        let re=eval(options)
        CustomComumn[i]["options"]=re
      }
      catch(e)
      {
        console.log("options转换失败",e)
      }

    }

    if(CustomComumn[i]!=null && CustomComumn[i]["filters"]!=null && CustomComumn[i]["filters"]!="" && typeof(CustomComumn[i]["filters"])=="string")
    {

      let filters=CustomComumn[i]["filters"].trim()
      filters.replace("{{","")
      filters.replace("}}","")
      try{
        let re=eval(filters)
        CustomComumn[i]["filters"]=re
      }
      catch(e)
      {
        console.log("filters转换失败",e)
      }
      console.log("需要处理filters",CustomComumn[i]["filters"])
    }

    if(CustomComumn[i]!=null && CustomComumn[i]["fixed"]!=null && CustomComumn[i]["fixed"]!="" && typeof(CustomComumn[i]["fixed"])=="string")
    {

      let fixed=CustomComumn[i]["fixed"].trim()
    if(fixed=="false")
    {
      CustomComumn[i]["fixed"]==false
      
      console.log("需要处理fixed",CustomComumn[i]["fixed"])
    }
    else
    {
      delete CustomComumn[i]["dataIndex"]
    }

    
     
    }
  }
}
//alert(CustomComumn)
  //if(CustomComumn!=null)

columns=CustomComumn
}
catch (e) {
	//...
  console.log("转换column异常",e)
}
}
const fetchData = () => {
 
  setLoading(true);
  let data=getRandomuserParams(tableParams)
//console.log("请求参数data",tableParams)
data["search"]=searchParam
/*
request.post(url,{
    method: 'post',
    body: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
*/
  request<{
    msg: string;
    code: number;
    success: boolean;
    data: any;
  }>(url, {
    method: 'POST',
data:data
  })
 
      .then((rs:any) => {
     //   console.log("数据",data)
   // message.success(rs?.msg)

    if(common.isArray(rs?.data))
     setData(rs.data);
       setLoading(false);

        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: parseInt(rs?.total),
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
    // console.log("xxx",tableParams.pagination)
      });
  };
/*
  useEffect(() => {
  
    fetchData();
  
  }, [JSON.stringify(tableParams)]);
*/
function Refresh  (msg:any){
  if(msg.act=="refresh")
  {
  
   fetchData()

  }
 

}
  useEffect(() => {
    //刷新
let EventID=props?.$name
if(EventID==null || EventID=="")
{
  EventID="CTable"
}


  props?.$AddListen(EventID,Refresh)

  return () => {
    props?.$RemoveListen(EventID,Refresh)
  }
  
 //fetchData();

},[tableParams])



  const handleTableChange = (

    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<any>,
  ) => {

    setTableParams({
pagination,
      filters,
      ...sorter,
    });
    
  // console.log("改变了",sorter)
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
    else
    {
     // fetchData();
    }
  };


  useEffect(() => {
  fetchData();
    //action on update of list
  }, [tableParams?.pagination?.current,tableParams?.field,tableParams.order,tableParams.filters]);

  function SearchItem(column:any) {
    if(column?.isSearch==null || column?.isSearch!=true)
    return null
   let dataIndex=column?.dataIndex
   const dateFormat = 'YYYY-MM-DD'||undefined;
    switch (column?.searchType) {
      case "string":
        return  <Input onChange={(e)=>{searchParam[column?.dataIndex]=e.target.value}} addonBefore={column?.title} placeholder={column?.title} />;
      case "number":
        return  <><InputNumber style={{width:"150px"}} onChange={(value)=>{searchParam["min:"+column?.dataIndex]=value}} addonBefore={"最小"+column?.title}  />-
        <InputNumber style={{width:"75px"}}  onChange={(value)=>{searchParam["max:"+column?.dataIndex]=value}}   /></>;
      case "date":
        return <><span>{column?.title}:</span>
        
        <RangePicker  
      format={dateFormat}
      locale={locale}
        onChange={([a,b])=>{searchParam[column?.dataIndex]=[moment(moment(a).format('YYYY-MM-DD'),'YYYY-MM-DD').valueOf().toString().substring(0,10),moment(moment(b).format('YYYY-MM-DD'),'YYYY-MM-DD').valueOf().toString().substring(0,10)]}}  allowEmpty={[true,true]} /></>;
     
        case "select":
        return <><span>{column?.title}:</span>
        <Select
      
      style={{ width: '100%' }}
      placeholder="请选择"
    
      onChange={(value: string[]) => {
       // console.log(`selected ${value}`);
    searchParam["select:"+column?.dataIndex]=value
      }
    }
   allowClear={true}
      options={column?.options}
    />
        
        </>;
      default:
        return null;
    }
  }


const listItems = columns.map((column) =>
  <>{SearchItem(column)}</>
);
const search=(e:any)=>{
//console.log("searchParam",searchParam)

//message.success("开始搜索"+JSON.stringify(searchParam))
fetchData()
}

const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
const start = () => {
fetchData()
//props.$SendEmit(props.$name,{"act":"refresh"})
};
const deleteRows = () => {
 // console.log("组件参数",props)
  if(props?.delApi!=null && props?.delApi!="")
  {
   
  }
  else
  {
    message.error("请先配置删除接口")
    return ;
  }
let delApi=props?.delApi
  let CurrentUrl=location.href;
if(CurrentUrl.indexOf("3000")>0)
  {
    delApi="http://127.0.0.1:7000"+delApi
  }
  setLoading(true);
  //console.log("选中的数据",selectedRowKeys)
  // ajax request after empty completing
  setTimeout(() => {
    setSelectedRowKeys([]);
    setLoading(false);
  }, 1000);

  let data={"ids":selectedRowKeys}

    fetch(delApi,{
      method: 'post',
      body: qs.stringify(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  
  
        .then((res) => res.json())
        .then(({ code ,msg}) => {
          
          if(code==0)
          {
           // message.success(msg)
            fetchData()
          }
     
       else
       message.error(msg)
        });

};

const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  console.log('selectedRowKeys changed: ', newSelectedRowKeys);
  setSelectedRowKeys(newSelectedRowKeys);
};
const rowSelection = {
  selectedRowKeys,
  onChange: onSelectChange,
};

const hasSelected = selectedRowKeys.length > 0 && props?.delApi!=null && props?.delApi!="";



const confirm = (e: React.MouseEvent<HTMLElement>) => {
  deleteRows()
  //console.log(e);
  //message.success('Click on Yes');
};

const cancel = (e: React.MouseEvent<HTMLElement>) => {
 // console.log(e);
 // message.error('Click on No');
};
let MulButton=props?.MulButton
const buttons=()=>{
  if (MulButton==null)
  {
    return null
  }

  if(typeof(MulButton)=="string")
  {
    return
  MulButton=MulButton.replace("{{","")
  MulButton=MulButton.replace("}}","")

  try{
    MulButton=eval(MulButton)
  }
  catch(e)
  {
  console.log("MulButton",e)
  }
}

if(typeof(MulButton)=="function" && MulButton!=null)
 return MulButton(selectedRowKeys)
else
 return null
}
  return (
    <>
    <div>
    <Space direction="vertical">
    <Space wrap>
  
    {listItems}
  
      <Tooltip title="搜索">
        <Button type="primary" onClick={search} shape="circle" icon={<SearchOutlined  />} />
      </Tooltip>
      

      
    </Space>

  </Space>
<div style={{width:"100%",height:"10px"}}></div>
    </div>

    <div style={{ marginBottom: 16 ,paddingLeft:10}}>
    <Space wrap>
{
  props?.ShowAddButton==true?
    <Button type="primary" onClick={props?.AddEvent}  loading={loading}>
          新增
        </Button>
        :null
}
        <Button type="primary" onClick={start}  loading={loading}>
          刷新
        </Button>
        <Popconfirm
    title="确定删除选中的数据吗?"

    onConfirm={confirm}
    onCancel={cancel}
    okText="确定"
    cancelText="取消"
  >
      

        {
                (props?.delApi!=null && props?.delApi!="")?(
                <Button type="primary" danger  disabled={!hasSelected} loading={loading}>
                删除
              </Button>
                    ):null
                }
        </Popconfirm>
        {
        buttons()

        }
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `选中了 ${selectedRowKeys.length} 项` : ''}
        </span>
        </Space>
      </div>
    <Table
    rowSelection={rowSelection}
    ellipsis={true}
    //  size={props?.size}
      {...props}
      columns={columns}
      scroll={{ x:1000 }}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
    </>
  );
};

export default CTable;
