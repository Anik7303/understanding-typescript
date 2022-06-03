import React from "react";
import styled from "styled-components";

import { Todo } from "../models";
import { TodoItem } from "./index";

const TodoUl = styled.ul`
  list-style: none;
  padding: 1rem;
  box-shadow: 0px 2px 10px 4px rgba(224, 255, 248, 0.5);
`;
interface TodoListProps {
  todos: Todo[];
  onTodoDelete: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onTodoDelete }) => {
  return (
    <TodoUl>
      {todos.map((todo) => {
        return (
          <TodoItem key={todo.id} todo={todo} onTodoDelete={onTodoDelete} />
        );
      })}
    </TodoUl>
  );
};

export default TodoList;
