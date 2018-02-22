import * as React from 'react';

const Option = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};

export default Option;
