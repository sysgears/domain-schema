import * as React from 'react';
import { Form as RSForm } from 'reactstrap';

export interface Props {
  children?: any;
  input?: any;
  name: string;
}

const Form = ({ children, input, name }: Props) => {
  return (
    <RSForm name={name} {...input} >
      {children}
    </RSForm>
  );
};

export default Form;
