import React, { FormEvent, FormEventHandler, useRef } from "react";

interface TodoFormProps {
  onSubmit: (value: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const todoRef = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = (event: FormEvent): void => {
    event.preventDefault();
    if (todoRef && todoRef.current) {
      if (todoRef.current.value.length > 0) {
        onSubmit(todoRef.current.value);
        todoRef.current.value = "";
        return;
      }
      alert("Please add some todo text");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={todoRef}
        type="text"
        name="input-todo"
        placeholder="Todo Text"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TodoForm;
