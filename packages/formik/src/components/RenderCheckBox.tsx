import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  meta?: any;
}

const RenderCheckBox = ({ input, label, type, meta: { touched, error } }: Props) => {
  return (
    <FormGroup check>
      <Label check>
        <Input {...input} placeholder={label} type={type} /> {label}
        {touched && (error && <div className="validation-err">{error}</div>)}
      </Label>
    </FormGroup>
  );
};

export default RenderCheckBox;
