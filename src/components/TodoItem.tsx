import React from "react";

import { Todo } from "../models";

interface TodoItemProps {
  todo: Todo;
  onTodoDelete: (todoId: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onTodoDelete }) => {
  return (
    <li className="todo-list-item">
      <span>{todo.content}</span>
      <button onClick={() => onTodoDelete(todo.id)}>Delete</button>
    </li>
  );
};

export default TodoItem;
