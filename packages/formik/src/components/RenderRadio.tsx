import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';

const RenderRadio = ({ input, options, meta: { touched, error } }: RenderComponentProps) => {
  return (
    <FormGroup tag="fieldset" {...options} value="Term 1 ...">
      {input.label && <legend>{input.label}</legend>}
      {input.values.map(radio => {
        return radio.value ? (
          <FormGroup key={radio.value} check>
            <Label check>
              <Input {...input} value={radio.value} checked={radio.value === input.value} /> {radio.label}
            </Label>
          </FormGroup>
        ) : (
          <FormGroup key={radio} check>
            <Label check>
              <Input {...input} value={radio} checked={radio === input.value} /> {radio}
            </Label>
          </FormGroup>
        );
      })}
      {touched && (error && <div className="validation-err">{error}</div>)}
    </FormGroup>
  );
};

export default RenderRadio;
