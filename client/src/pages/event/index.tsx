import { useEffect, useState } from 'react';

const Page = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("哈哈哈，useEffect 又执行了");
    return () => {
      console.log("看到我就知道执行了清除机制(～￣▽￣)～");
    };
  }, [count]);

  return (
    <div>
      <p>那啥，你点了我 {count} 次 ⏲️⏲️⏲️⏲️</p>
      {console.log("这是 dom 节点渲染了，小样╭(╯^╰)╮")}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        你觉得你点击我之后会发生什么⛏️⛏️⛏️
      </button>
    </div>
  );
};


export default Page;

