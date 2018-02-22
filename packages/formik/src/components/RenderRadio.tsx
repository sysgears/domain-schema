import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  values?: any[];
  meta?: any;
}

const RenderRadio = ({ input, label, values, type, meta: { touched, error } }: Props) => {
  return (
    <FormGroup tag="fieldset">
      {label && <legend>{label}</legend>}
      {values.map(radio => {
        return radio.value ? (
          <FormGroup key={radio.value} check>
            <Label check>
              <Input {...input} type={type} value={radio.value} /> {radio.label}
            </Label>
          </FormGroup>
        ) : (
          <FormGroup key={radio} check>
            <Label check>
              <Input {...input} type={type} value={radio} /> {radio}
            </Label>
          </FormGroup>
        );
      })}
      {touched && (error && <div className="validation-err">{error}</div>)}
    </FormGroup>
  );
};

export default RenderRadio;
