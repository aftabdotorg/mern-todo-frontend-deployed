import './App.css';
import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import FlipMove from 'react-flip-move';

const API_BASE = `https://merntodobackend.onrender.com`;

function App() {
  const [todos, setTodos] = useState([]); // [initial state, updater functionn]
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetTodos();
  }, []); // [] dependency

  const GetTodos = () => {
    setLoading(true);
    fetch(`${API_BASE}/todos`)
      .then((res) => res.json()) //send response to json
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
      });
  };

  //toggle complete
  const completeTodo = async (id) => {
    const data = await fetch(`${API_BASE}/todos/complete/${id}`).then((res) =>
      res.json()
    );
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + '/todos/delete/' + id, {
      method: 'DELETE',
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + '/todo/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);

    // console.log(data);
    setPopupActive(false);
    setNewTodo('');
  };

  return (
    <div className="App">
      <h1>Welcome, Aftab</h1>
      <h4>your tasks</h4>
      <div className="todos">
        <FlipMove>
          {loading ? (
            <h2
              style={{
                display: 'grid',
                justifyContent: 'center',
                color: 'blueviolet',
                textTransform: 'uppercase',
              }}
            >
              {' '}
              <Spinner /> <br />
              please wait while todos are being fetched, <br />
              This may take time depending upon Api
            </h2>
          ) : todos.length > 0 ? (
            todos.map((todo) => (
              <div
                className={`todo ${todo.complete ? 'is-complete' : ''}`}
                key={todo._id}
                onClick={() => completeTodo(todo._id)}
              >
                <div className="checkbox"></div>
                <div className="text">{todo.text}</div>
                <div
                  className="delete-todo"
                  onClick={() => deleteTodo(todo._id)}
                >
                  x
                </div>
              </div>
            ))
          ) : (
            <p>No Pending Tasks</p>
          )}
        </FlipMove>
      </div>
      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>ADD TASKS</h3>
            <input
              type="text"
              className="add-todo-input"
              // onChange={(e) => setNewTodo(e.target.value)}
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div
              className="button"
              onClick={addTodo}
              // onClick={handleAdd}
            >
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
