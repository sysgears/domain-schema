import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  meta?: any;
  children?: any[];
}

const RenderField = ({ input, label, type, meta: { touched, error }, children }: Props) => {
  let valid = null;
  if (touched && error) {
    valid = false;
  }

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <div>
        <Input {...input} placeholder={label} type={type} valid={valid}>
          {children}
        </Input>
        {touched && (error && <FormFeedback>{error}</FormFeedback>)}
      </div>
    </FormGroup>
  );
};

export default RenderField;
