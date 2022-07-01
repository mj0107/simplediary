import './App.css';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

// https://jsonplaceholder.typicode.com/posts

function App() {
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json());
    // console.log(res);

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      }
    });

    setData(initData);
  }

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    }
    dataId.current++;
    // 원래 데이터에 newItem을 이어붙여서 새로 setData를 해줌
    setData((data) => [newItem, ...data]);
  }, []);

  const onRemove = useCallback((targetId) => {
    setData(data => data.filter((item) => item.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((item) =>
        item.id === targetId ? { ...item, content: newContent } : item)
    );
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]); // data.length가 변화할때만 callback 수행

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
