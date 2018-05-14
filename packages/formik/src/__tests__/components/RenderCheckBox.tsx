import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';

const RenderCheckBox = ({ input: { value, ...input }, meta: { touched, error } }: RenderComponentProps) => {
  const invalid = !!(touched && error);
  return (
    <FormGroup>
      <FormGroup check>
        <Input id={input.name} checked={value} {...input} invalid={invalid} />
        <Label for={input.name} check>
          {input.label}
        </Label>
        {invalid && <FormFeedback>{error}</FormFeedback>}
      </FormGroup>
    </FormGroup>
  );
};

export default RenderCheckBox;
