import * as React from 'react';
import { RenderComponentProps } from '../../types';

const Query = ({ schemaName, children }: RenderComponentProps) => {
  const data = { edges: [] };
  if (schemaName === 'Group') {
    for (let i = 1; i <= 5; i++) {
      data.edges.push({
        id: i,
        name: `Group_${i}`,
        description: `Group ${i} description`
      });
    }
  }
  return children(data);
};

export default Query;
