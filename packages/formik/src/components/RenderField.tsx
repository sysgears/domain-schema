import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  meta?: any;
  children?: any[];
  options?: any;
  placeholder?: string;
}

const RenderField = ({ input, label, options, type, placeholder, meta: { touched, error }, children }: Props) => {
  let valid = null;
  if (touched && error) {
    valid = false;
  }

  return (
    <FormGroup {...options}>
      {label && <Label>{label}</Label>}
      <Input {...input} placeholder={placeholder || label || ''} type={type} valid={valid}>
        {children}
      </Input>
      {touched && (error && <FormFeedback>{error}</FormFeedback>)}
    </FormGroup>
  );
};

export default RenderField;
