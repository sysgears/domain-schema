import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

export interface Props {
  name: string;
  component?: any;
  onChange?: any;
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
    const { component, name, value, defaultValue, checked, defaultChecked, onChange, disabled } = this.props;

    const meta = {
      touched: formik.touched[name],
      error: formik.errors[name]
    };

    const input = {
      onChange,
      onBlur: formik.handleBlur,
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
