import * as React from 'react';
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import Option from './Option';

export interface Props {
  input?: any;
  label?: string;
  multiple?: boolean;
  type?: string;
  meta?: any;
  values?: any[];
}

const RenderSelect = ({ input, label, multiple, values, type, meta: { touched, error } }: Props) => {
  let className = '';
  if (touched && error) {
    className = 'invalid-select';
  }

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Input className={className} {...input} type={type} multiple={multiple}>
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
