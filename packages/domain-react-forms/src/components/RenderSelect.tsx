import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  meta?: any;
  children?: any;
}

const RenderSelect = ({ input, label, type, children, meta: { touched, error } }: Props) => {
  let className = '';
  if (touched && error) {
    className = 'invalid-select';
  }

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <div>
        <Input className={className} {...input} type={type}>
          {children}
        </Input>
        {touched && (error && <div className="validation-err">{error}</div>)}
      </div>
    </FormGroup>
  );
};

export default RenderSelect;
