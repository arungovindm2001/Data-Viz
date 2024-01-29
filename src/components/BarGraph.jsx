import React from 'react';

import Plot from 'react-plotly.js';

function BarGraph(props) {
  return (
    <Plot
      data={[
        {
          x: props.x,
          y: props.y,
          type: 'bar',
        },
      ]}
      layout={{ width: '100%', height: '100%', title: props.title }}
      style={{ minWidth: '100%', minHeight: '100%' }}
    />
  );
}

export default BarGraph;
