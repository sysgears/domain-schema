import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../../types';
import Option from './Option';

const RenderSelect = ({ input, meta: { touched, error } }: RenderComponentProps) => {
  const { label, values } = input;
  const invalid = !!(touched && error);

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Input {...input} invalid={invalid}>
        {values.map(option => {
          return option.value ? (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ) : (
            <Option key={option} value={option}>
              {option}
            </Option>
          );
        })}
      </Input>
      {invalid && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

export default RenderSelect;
