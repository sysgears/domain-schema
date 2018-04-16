import { Button, RenderCheckBox, RenderField, RenderRadio, RenderSelect } from './components';
import { FieldType, RenderComponentProps } from './types';

export default {
  custom: { name: 'custom' },
  input: { name: 'input', component: RenderField },
  select: { name: 'select', component: RenderSelect },
  checkbox: { name: 'checkbox', component: RenderCheckBox },
  radio: { name: 'radio', component: RenderCheckBox },
  button: { name: 'button', component: Button }
};
