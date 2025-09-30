import { useState } from 'react';
import './App.css';

function App() {
  let [title, setTitle] = useState(['남자 코트 추천', '강남 우동 맛집', '파이썬 독학']);
  let [like, setLike] = useState([0, 0, 0]);


  return (
    <div className="App">
      <div className="black-nav">
        <h4>블로그임</h4>
      </div>
      <div className='list'>
        <h4>
          {title[0]}
          <span
            onClick={() => {
              let copy = [...like];
              copy[0] = copy[0] + 1;
              setLike(copy);
            }
          }
          >
            👍
          </span>
          {like[0]}
        
          </h4>
        <p>2월 17일 발행</p>
      </div>
      <div className='list'>
        <h4>
          {title[1]}
          <span
            onClick={() => {
              let copy = [...like];
              copy[1] = copy[1] + 1;
              setLike(copy);
            }
          }
          >
            👍
          </span>
          {like[1]}
          </h4>
        <p>2월 17일 발행</p>
      </div>
      <div className='list'>
        <h4>
          {title[2]}
          <span
            onClick={() => {
              let copy = [...like];
              copy[2] = copy[2] + 1;
              setLike(copy);
            }
          }
          >
            👍
          </span>
          {like[2]}
          </h4>
        <p>2월 17일 발행</p>
      </div>

    </div>
  );
}

export default App;