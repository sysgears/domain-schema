import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

export interface Props {
  name: string;
  component?: any;
  onChange?: any;
  onBlur?: any;
  value?: string;
  defaultValue?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
}

export default class Field extends Component {
  public static contextTypes = {
    formik: PropTypes.object
  };

  constructor(public props: Props, public context: any) {
    super(props, context);
    if (!context.formik) {
      throw new Error('Field must be inside a component decorated with formik()');
    }
  }

  public render() {
    const { formik } = this.context;
    const { component, name, defaultValue, defaultChecked, onChange, onBlur, disabled } = this.props;
    let { value, checked } = this.props;
    value = value || '';
    checked = checked || false;
    const meta = {
      touched: formik.touched[name],
      error: formik.errors[name]
    };
    console.log(this.props);
    const input = {
      onChange: onChange ? onChange : formik.handleChange,
      // onChange: e => formik.setFieldValue(name, e.target.value),
      onBlur: onBlur ? onBlur : formik.handleBlur,
      // onBlur: e => formik.setFieldValue(name, e.target.value),
      name,
      value,
      checked,
      defaultValue,
      defaultChecked,
      disabled
    };

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
