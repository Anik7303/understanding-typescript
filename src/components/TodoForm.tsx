import React, { FormEvent, FormEventHandler, useEffect, useRef } from "react";
import styled from "styled-components";

const borderRadius = "4px";

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const FormInput = styled.input`
  padding: 1rem;
  font-size: 1.6rem;
  color: black;
  background: lightcyan;
  border: none;
  border-radius: 0;
  border-top-left-radius: ${borderRadius};
  border-bottom-left-radius: ${borderRadius};
`;

const Button = styled.button`
  font-family: inherit;
  font-size: 1.6rem;
  color: black;
  background: cyan;
  padding: 1rem;
  border: none;
  border-radius: 0;
  border-top-right-radius: ${borderRadius};
  border-bottom-right-radius: ${borderRadius};
  cursor: pointer;
`;

interface TodoFormProps {
  onSubmit: (value: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const todoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoRef.current) {
      todoRef.current.autofocus = true;
    }
  }, [todoRef]);

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
    <Form onSubmit={handleSubmit}>
      <FormInput ref={todoRef} type="text" placeholder="Todo Text" />
      <Button type="submit">Add</Button>
    </Form>
  );
};

export default TodoForm;
