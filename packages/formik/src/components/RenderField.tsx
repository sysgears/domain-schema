import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';

const RenderField = ({ input, options, meta: { touched, error }, children }: RenderComponentProps) => {
  const { label, placeholder } = input;
  let valid: boolean = null;
  if (touched && error) {
    valid = false;
  }

  return (
    <FormGroup {...options}>
      {label && <Label>{label}</Label>}
      <Input {...input} placeholder={placeholder || label || ''} valid={valid}>
        {children}
      </Input>
      {touched && (error && <FormFeedback>{error}</FormFeedback>)}
    </FormGroup>
  );
};

export default RenderField;
