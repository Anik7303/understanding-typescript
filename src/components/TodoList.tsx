import React from "react";

import { Todo } from "../models";
import { TodoItem } from "./index";
interface TodoListProps {
  todos: Todo[];
  onTodoDelete: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onTodoDelete }) => {
  return (
    <section className="section-todo__list">
      <ul className="list-todo">
        {todos.map((todo) => {
          return (
            <TodoItem key={todo.id} todo={todo} onTodoDelete={onTodoDelete} />
          );
        })}
      </ul>
    </section>
  );
};

export default TodoList;
