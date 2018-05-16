import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';

const RenderField = ({ input, meta: { touched, error }, children }: RenderComponentProps) => {
  const { label, placeholder } = input;
  const invalid = !!(touched && error);

  return (
    <FormGroup>
      {label && <Label for={input.name}>{label}</Label>}
      <Input id={input.name} {...input} placeholder={placeholder || label || ''} invalid={invalid} />
      {invalid && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

export default RenderField;
