import { Select } from 'antd';

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

export default () => {
  return (
  <>
    <Select
      defaultValue="lucy"
      style={{ width: 120 }}
      onChange={handleChange}
      fieldNames={{ label: 'name', value: 'id',"options":"options" }}
      options={[
        {
          value: 'jack',
          name: 'Jack',
        },
      
      ]}
    />
 
   
   
  </>
  )
}
