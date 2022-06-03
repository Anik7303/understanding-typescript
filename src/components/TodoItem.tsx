import React from "react";
import styled from "styled-components";

import { Todo } from "../models";

const TodoLi = styled.li`
  padding: 1rem;
  font-size: inherit;
  font-family: inherit;
  color: black;
  background-color: lightcyan;
  margin-bottom: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  :last-child {
    margin-bottom: 0;
  }
`;

const Span = styled.span`
  flex: 1;
  font-size: inherit;
  font-family: inherit;
`;

const Button = styled.button`
  font-size: inherit;
  font-family: inherit;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: cyan;
  color: black;
  border: none;
  cursor: pointer;
`;

interface TodoItemProps {
  todo: Todo;
  onTodoDelete: (todoId: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onTodoDelete }) => {
  return (
    <TodoLi>
      <Span>{todo.content}</Span>
      <Button onClick={() => onTodoDelete(todo.id)}>Delete</Button>
    </TodoLi>
  );
};

export default TodoItem;
