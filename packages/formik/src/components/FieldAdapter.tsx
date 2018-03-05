import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

export interface Props {
  name: string;
  component?: any;
  onChange?: any;
  onBlur?: any;
  value?: string | boolean;
  checked?: boolean;
  disabled?: boolean;
  parent?: any;
  options?: any;
  className?: string;
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
    const { component, name, onChange, parent, onBlur, disabled, className } = this.props;
    let { value, checked } = this.props;
    value = value || '';
    checked = checked || false;
    const meta = {
      touched: formik.touched[name],
      error: formik.errors[name]
    };
    const input = {
      onChange:
        parent && parent.name
          ? e =>
              formik.setFieldValue(parent.name, {
                ...parent.value,
                [name]: e.target.value
              })
          : onChange ? onChange : formik.handleChange,
      onBlur: onBlur ? onBlur : formik.handleBlur,
      name,
      value,
      checked,
      disabled,
      className
    };

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
