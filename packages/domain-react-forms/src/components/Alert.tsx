import * as React from 'react';
import { Alert as RSAlert } from 'reactstrap';

export interface Props {
  children?: any;
  color?: string;
}

const Alert = ({ children, color, ...props }: Props) => {
  if (color === 'error') {
    color = 'danger';
  }
  return (
    <RSAlert {...props} color={color}>
      {children}
    </RSAlert>
  );
};

export default Alert;
