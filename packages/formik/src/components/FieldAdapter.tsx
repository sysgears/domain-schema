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
  parent?: any;
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
    const { component, name, defaultValue, defaultChecked, onChange, parent, onBlur, disabled, className } = this.props;
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
      defaultValue,
      defaultChecked,
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
