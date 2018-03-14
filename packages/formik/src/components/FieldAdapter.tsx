import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

export interface Props {
  attrs: any;
  checked?: boolean;
  component: any;
  fieldType?: string;
  name: string;
  onBlur?: any;
  onChange?: any;
  options?: any;
  parent?: any;
  value?: string | number;
}

export default class Field extends Component<Props, {}> {
  public static contextTypes = {
    formik: PropTypes.object
  };

  constructor(public props: Props, public context: any) {
    super(props, context);
  }

  public render() {
    const { formik: { setFieldValue, handleChange, handleBlur, touched, errors } } = this.context;
    const { component, parent, attrs, fieldType, value, checked } = this.props;
    const { onChange, onBlur, type } = attrs;
    const name = attrs.name || this.props.name;

    const input = {
      onChange:
        parent && parent.name
          ? e =>
              setFieldValue(parent.name, {
                ...parent.value,
                [name]: e.target.value
              })
          : onChange ? onChange : handleChange,
      onBlur: onBlur ? onBlur : handleBlur,
      value: value || '',
      type: type || fieldType,
      checked: !!checked,
      name,
      ...attrs
    };

    const meta = {
      touched: touched[name],
      error: errors[name]
    };

    return React.createElement(component, {
      ...this.props,
      input,
      meta
    });
  }
}
