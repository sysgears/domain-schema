import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';

const RenderRadio = ({ input, meta: { touched, error } }: RenderComponentProps) => {
  const invalid = !!(touched && error);

  return (
    <FormGroup tag="fieldset">
      {input.label && <legend>{input.label}</legend>}
      {input.values.map((radio, index) => {
        return radio.value ? (
          <FormGroup key={radio.value} check>
            <Input {...input} value={radio.value} checked={radio.value === input.value} />
            <Label check>{radio.label}</Label>
            {index === input.values.length - 1 && invalid && <FormFeedback>{error}</FormFeedback>}
          </FormGroup>
        ) : (
          <FormGroup key={radio} check>
            <Input {...input} value={radio} checked={radio === input.value} invalid={invalid} />
            <Label check>{radio}</Label>
            {index === input.values.length - 1 && invalid && <FormFeedback>{error}</FormFeedback>}
          </FormGroup>
        );
      })}
    </FormGroup>
  );
};

export default RenderRadio;
