import DomainSchema, { Schema } from '@domain-schema/core';
import * as React from 'react';

export default abstract class FormSchema extends Schema {
  public id = DomainSchema.Int;
  public constructor() {
    super();
  }
  public setSubmitBtn(): any {
    return undefined;
  }
  public setResetBtn(): any {
    return undefined;
  }
}
