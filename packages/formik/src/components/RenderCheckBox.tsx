import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  meta?: any;
  options?: any;
}

const RenderCheckBox = ({ input, options, meta: { touched, error } }: Props) => {
  return (
    <FormGroup check {...options}>
      <Label check>
        <Input {...input} /> {input.label}
        {touched && (error && <div className="validation-err">{error}</div>)}
      </Label>
    </FormGroup>
  );
};

export default RenderCheckBox;
