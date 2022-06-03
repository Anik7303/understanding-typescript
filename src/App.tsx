import React, { useState } from "react";
import styled from "styled-components";

import "./App.css";
import { TodoForm, TodoList } from "./components";
import { Todo } from "./models";

const Wrapper = styled.div`
  max-width: 70rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: inherit;
  text-align: center;
`;

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
    <Wrapper>
      <Title>Todos</Title>
      <TodoForm onSubmit={addTodo} />
      <TodoList todos={todos} onTodoDelete={deleteTodo} />
    </Wrapper>
  );
};

export default App;
