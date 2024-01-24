"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"

import { data } from "./data";
import { Checkbox } from "@/components/ui/checkbox";

export function DataTable() {
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const checkFiveRows = data.slice(0, 5);
  const [chartData, setChartData] = useState(
    checkFiveRows.map((row) => ({
    type: 'bar',
    x: ['DSA', 'OS', 'Networks', 'AI', 'Security', 'DBMS'],
    y: [row.algorithms, row.operatingSystems, row.networks, row.artificialIntelligence, row.databases],
    name: row.name,
  }))
  );

  const handleCheckboxChange = (data: any) => {
    let updatedChartData = chartData.map((chart) => {
      if (chart.name === data.name) {
        return {
          ...chart,
          y: [data.security, data.databases, data.networks, data.artificialIntelligence, data.operatingSystems, data.algorithms],
        };
      }
      return chart;
    });


    if (!updatedChartData.some((chart) => chart.name === data.name)) // Check if the selected data is not already in chartData, then add a new chart
    {
      updatedChartData.push({
        type: 'bar',
        x: ['DSA', 'OS', 'Networks', 'AI', 'Security', 'DBMS'],
        y: [data.algorithms, data.operatingSystems, data.networks, data.artificialIntelligence, data.databases],
        name: data.name,
      });
    } else {
      updatedChartData = updatedChartData.filter((chart) => chart.name !== data.name);
    }

    setChartData(updatedChartData);
    console.log(chartData)
  };

  return (
    <>
      <table className="min-w-full border-3 rounded-lg border-gray-300">
        <thead className="border rounded-lg">
          <tr>
            <th className="border p-2">
            </th>
            <th className="border p-2">Name</th>
            <th className="border p-2">DSA</th>
            <th className="border p-2">OS</th>
            <th className="border p-2">Networks</th>
            <th className="border p-2">AI</th>
            <th className="border p-2">Security</th>
            <th className="border p-2">DBMS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">
                <Checkbox
                  id={row.id}
                  checked={chartData.some((chart) => chart.name === row.name)}
                  onCheckedChange={() => handleCheckboxChange(row)}
                />
              </td>
              <td className="border text-start p-2">{row.name}</td>
              <td className="border text-center p-2">{row.algorithms}</td>
              <td className="border text-center p-2">{row.operatingSystems}</td>
              <td className="border text-center p-2">{row.networks}</td>
              <td className="border text-center p-2">{row.artificialIntelligence}</td>
              <td className="border text-center p-2">{row.security}</td>
              <td className="border text-center p-2">{row.databases}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Plot
        id="chart"        
        data={chartData}
        style={{ width: '100%', height: '100%' }}
        layout={{
          barmode: 'stack',
          title: 'Bar Chart',
          xaxis: {
            title: 'Subject',
          },
          yaxis: {
            title: 'Marks',
          },
        }} />
    </>
  )
}
