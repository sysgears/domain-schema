import * as React from 'react';
import { Input } from 'reactstrap';

const Select = ({ children, ...props }) => {
  return (
    <Input {...props} type="select">
      {children}
    </Input>
  );
};

export default Select;
