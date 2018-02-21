import * as React from 'react';
import { Button as RSButton } from 'reactstrap';

const Button = ({ children, ...props }) => {
  return <RSButton {...props}>{children}</RSButton>;
};

export default Button;
