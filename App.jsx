import './App.css';
import {useState} from 'react';
import {useImmer} from 'use-immer';
import {Routes, Route, Link, useParams, useNavigate} from 'react-router-dom';
const Header = ({title, onChangeMode}) => {
  return <header>
      <h1><Link to="/">{title}</Link></h1>
    </header>
}
const Nav = ({topics, onChangeMode}) => {
  const liTag = topics.map((t)=>{
    return <li key={t.id}>
      <Link 
        to={`/read/${t.id}`}
      >
        {t.title}
      </Link>
    </li>
  });
  return <nav>
    <ul>
      {liTag}
    </ul>
  </nav>
}
const Article = ({title, body})=>{
  return <article>
    <h2>{title}</h2>
    {body}
  </article>
}
function Control({onChangeMode}){
  return <ul>
    <li><Link to="/create">Create</Link></li>
    <li><Link to="/update">Update</Link></li>
  </ul>
}
const Create = ({onSave}) => {
  const submitHandler = (evt)=>{
    // 기본 동작 금지
    evt.preventDefault();
    // get title, body
    const title = evt.target.title.value;
    const body = evt.target.body.value;
    // onSave 를 호출한다. 
    onSave(title, body);
  }
  return <form onSubmit={submitHandler}>
    <p><input type="text" name="title" placeholder="title" /></p>
    <p><textarea name="body" placeholder="body"></textarea></p>
    <p><input type="submit" value="Create" /></p>
  </form>
}
const Read = ({topics}) => {
  let { id } = useParams();
  const topic = topics.find(topic => topic.id === Number(id));
  return <article>
    <h2>{topic.title}</h2>
    {topic.body}
  </article>
}
function App() {
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useImmer([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'}
  ]);
  const navigate = useNavigate();
  const saveHandler = (title, body) => {
    setTopics(draft => {
      draft.push({id:nextId, title, body})
    });
    navigate(`/read/${nextId}`);
    setNextId(oldNextId => oldNextId + 1);
  }
  return (
    <div className="App">
      <Header title="웹"/>
      <Nav topics={topics}/>
      <Routes>
        <Route path="/" element={<Article title="Hello" body="Welcome, WEB!" />}></Route>
        <Route path="/read/:id" element={<Read topics={topics}/>}></Route>
        <Route path="/create" element={<Create onSave={saveHandler}/>}></Route>
      </Routes>
      <Control></Control>
    </div>
  );
}

export default App;
