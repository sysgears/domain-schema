import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

export interface Props {
  input?: any;
  label?: string;
  type?: string;
  values?: any[];
  meta?: any;
  options?: any;
}

const RenderRadio = ({ input, label, options, values, type, meta: { touched, error } }: Props) => {
  return (
    <FormGroup tag="fieldset" {...options} value="Term 1 ...">
      {label && <legend>{label}</legend>}
      {values.map(radio => {
        return radio.value ? (
          <FormGroup key={radio.value} check>
            <Label check>
              <Input {...input} type={type} value={radio.value} checked={radio.value === input.value} /> {radio.label}
            </Label>
          </FormGroup>
        ) : (
          <FormGroup key={radio} check>
            <Label check>
              <Input {...input} type={type} value={radio} checked={radio === input.value} /> {radio}
            </Label>
          </FormGroup>
        );
      })}
      {touched && (error && <div className="validation-err">{error}</div>)}
    </FormGroup>
  );
};

export default RenderRadio;
