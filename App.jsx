import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {useImmer} from 'use-immer';
const Header = ({title, onChangeMode}) => {
  return <header>
      <h1><a href="index.html" onClick={(evt)=>{
        evt.preventDefault();
        onChangeMode('WELCOME');
      }}>{title}</a></h1>
    </header>
}
const Nav = ({topics, onChangeMode}) => {
  const liTag = topics.map((t)=>{
    return <li key={t.id}>
      <a 
        href={`/read/${t.id}`}
        onClick={evt=>{
          evt.preventDefault();
          onChangeMode('READ', t.id);
        }}  
      >
        {t.title}
      </a>
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
  const createClickHandler = (evt)=>{
    evt.preventDefault();
    onChangeMode('CREATE');
  }
  const updateClickHandler = (evt)=>{
    evt.preventDefault();
    onChangeMode('UPDATE');
  }
  return <ul>
    <li><a href="/create" onClick={createClickHandler}>Create</a></li>
    <li><a href="/update" onClick={updateClickHandler}>Update</a></li>
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
function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useImmer([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'}
  ]);
  const changeModeHandler = (mode, id)=>{      
    setMode(mode);
    if(id !== undefined){
      setId(id);
    }
  }
  const saveHandler = (title, body) => {
    setTopics(draft => {
      draft.push({id:nextId, title, body})
    });
    setMode('READ');
    setId(nextId);
    setNextId(oldNextId => oldNextId + 1);
  }
  let content = null;
  if(mode === 'WELCOME'){
    content = <Article title="Hello" body="Welcome, WEB!" />;
  } else if(mode === 'READ'){
    const selected  = topics.find(t=>t.id === id);
    content = <Article title={selected.title} body={selected.body} />
  } else if(mode === 'CREATE'){
    content = <Create onSave={saveHandler}/>
  } else if(mode === 'UPDATE'){
    content = <div>Update</div>
  }
  return (
    <div className="App">
      <Header title="웹" onChangeMode={changeModeHandler} />
      <Nav topics={topics} onChangeMode={changeModeHandler} />
      {content}
      <Control onChangeMode={changeModeHandler}></Control>
    </div>
  );
}

export default App;
