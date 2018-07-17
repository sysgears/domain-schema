import * as React from 'react';
import { pascalize } from 'humps';
import { FormFeedback } from 'reactstrap';
import { Select, Query } from './index';
import { RenderComponentProps } from '../../types';

const RenderSelectQuery = ({
                             value,
                             schema,
                             style = { width: '100%' },
                             meta: { touched, error }
                           }: RenderComponentProps) => {

  const column = schema.keys().find(key => !!schema.values[key].sortBy) || 'name';
  const toString = schema.__.__toString ? schema.__.__toString : opt => opt[column];
  const formattedValue = value ? value.id : '0';
  return (
    <div>
      <Query schemaName={schema.name}>
        {(data) => {
          if (!data) {
            return <div>Data Not found</div>;
          }
          const { edges } = data;
          const renderOptions = () => {
            const defaultOption = formattedValue
              ? []
              : [
                <option key="0" value="0">
                  Select {pascalize(schema.name)}
                </option>
              ];
            return edges
              ? edges.reduce((acc, opt) => {
                acc.push(
                  <option key={opt.id} value={`${opt.id}`}>
                    {toString(opt)}
                  </option>
                );
                return acc;
              }, defaultOption)
              : defaultOption;
          };
          const props = {
            style,
            value: formattedValue,
            onChange: () => {
            },
            onBlur: () => {
            },
            invalid: !!(touched && error)
          };
          return (
            <div>
              <Select {...props}>
                {renderOptions()}
              </Select>
              {error && <FormFeedback>{error}</FormFeedback>}
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default RenderSelectQuery;

