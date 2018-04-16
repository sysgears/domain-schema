import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';

const RenderCheckBox = ({ input, options, meta: { touched, error } }: RenderComponentProps) => {
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
