import * as React from 'react';
import { Form as RSForm } from 'reactstrap';

export interface Props {
  children?: any;
  layout?: string;
  type?: string;
}

const Form = ({ children, layout, ...props }: Props) => {
  let inline = false;
  if (layout === 'inline') {
    inline = true;
  }
  return (
    <RSForm {...props} inline={inline}>
      {children}
    </RSForm>
  );
};

export default Form;
