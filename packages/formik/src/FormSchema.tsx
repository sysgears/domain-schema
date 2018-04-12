import { Schema } from '@domain-schema/core';
import * as React from 'react';

import { Button } from './components';

export default abstract class FormSchema extends Schema {
  public constructor() {
    super();
  }
  public abstract setSubmitBtn(): any;
  public setResetBtn(): any {
    return undefined;
  }
}
