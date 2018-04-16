import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';

import { RenderComponentProps } from '../types';
import Option from './Option';

const RenderSelect = ({ input, options, meta: { touched, error } }: RenderComponentProps) => {
  const { label, values } = input;
  let className = input.className || '';
  if (touched && error) {
    className += ' invalid-select';
  }

  return (
    <FormGroup {...options}>
      {label && <Label>{label}</Label>}
      <Input {...input} className={className}>
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
      {touched && (error && <div className="validation-err">{error}</div>)}
    </FormGroup>
  );
};

export default RenderSelect;
