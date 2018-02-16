import DomainSchema from 'domain-schema';
import DomainValidation from 'domain-validation';

export default class DomainReactForms {
  constructor(private schema: DomainSchema) {}

  public validate(formValues: any) {
    return DomainValidation.validate(formValues, this.schema);
  }

  public static setValidationMessages(messages) {
    DomainValidation.setValidationMessages(messages);
  }
}
