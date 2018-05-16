import * as React from 'react';
import { Form as RSForm } from 'reactstrap';

export interface Props {
  children?: any;
  input?: any;
  name: string;
  handleSubmit: any;
}

const Form = ({ children, input, name, handleSubmit }: Props) => {
  return (
    <RSForm name={name} {...input} onSubmit={handleSubmit}>
      {children}
    </RSForm>
  );
};

export default Form;
