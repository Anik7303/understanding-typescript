import React, { useState } from "react";

import "./App.css";
import { TodoForm, TodoList } from "./components";
import { Todo } from "./models";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (value: string): void => {
    setTodos((prevTodos): Todo[] => {
      const newTodo = { id: Math.random().toString(), content: value };
      return [...prevTodos, newTodo];
    });
  };

  const deleteTodo = (todoId: string): void => {
    setTodos((prevTodos): Todo[] =>
      prevTodos.filter((todo) => todo.id !== todoId)
    );
  };

  return (
    <>
      <h1>Todos</h1>
      <TodoForm onSubmit={addTodo} />
      <TodoList todos={todos} onTodoDelete={deleteTodo} />
    </>
  );
};

export default App;
