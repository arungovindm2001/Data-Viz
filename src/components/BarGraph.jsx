import React from "react";

import Plot from "react-plotly.js";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function BarGraph({ x, y, title }) {
  return (
      <Plot
        data={[
          {
            x: x,
            y: y,
            type: "bar",
            marker: { color: getRandomColor() },
          },
        ]}
        layout={{ width: "100%", height: "100%", title: title }}
        style={{ minWidth: "100%", minHeight: "100%" }}
      />
  );
}

export default BarGraph;
