import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  meta?: any;
  children?: any[];
  options?: any;
}

const RenderField = ({ input, label, options, type, meta: { touched, error }, children }: Props) => {
  let valid = null;
  if (touched && error) {
    valid = false;
  }

  console.log(input);

  return (
    <FormGroup {...options}>
      {label && <Label>{label}</Label>}
      <Input {...input} placeholder={label} type={type} valid={valid}>
        {children}
      </Input>
      {touched && (error && <FormFeedback>{error}</FormFeedback>)}
    </FormGroup>
  );
};

export default RenderField;
