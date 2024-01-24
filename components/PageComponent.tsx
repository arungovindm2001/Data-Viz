"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { data } from "./data";
import { getRandomColor } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";



export function DataTable() {
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("algorithms");

  const handleCheckboxChange = (rowData: any) => {
    setSelectedRows((prevSelectedRows) => {
      const isRowSelected = prevSelectedRows.some((row) => row.name === rowData.name);

      if (isRowSelected) {
        return prevSelectedRows.filter((row) => row.name !== rowData.name);
      } else {
        return [...prevSelectedRows, rowData];
      }
    });
  };

  const handleRadioChange = (column) => {
    setSelectedColumn(column);
  };

  useEffect(() => {
    const initialSelectedRows = data.slice(0, 5).map((row) => ({ ...row }));
    setSelectedRows(initialSelectedRows);
  }, []);

  return (
    <>
      <div className="col-span-1 pr-4 overflow-auto">
        <table className="min-w-full border-3 border-slate-300">
          <thead className="border rounded-lg">
            <tr className="bg-slate-300">
              <th className="p-2">
              </th>
              <th className="p-2">Name</th>
              <th className="p-2">
                <label>
                  <input
                    type="radio"
                    name="selectedColumn"
                    value="algorithms"
                    checked={selectedColumn === "algorithms"}
                    onChange={() => handleRadioChange("algorithms")}
                  />
                  DSA
                </label>

              </th>
              <th className="p-2">
                <label>
                  <input
                    type="radio"
                    name="selectedColumn"
                    value="operatingSystems"
                    checked={selectedColumn === "operatingSystems"}
                    onChange={() => handleRadioChange("operatingSystems")}
                  />
                  OS
                </label>
              </th>
              <th className="p-2"><label>
                <input
                  type="radio"
                  name="selectedColumn"
                  value="networks"
                  checked={selectedColumn === "networks"}
                  onChange={() => handleRadioChange("networks")}
                />
                Networks
              </label>
              </th>
              <th className="p-2">
                <label>
                  <input
                    type="radio"
                    name="selectedColumn"
                    value="artificalIntelligence"
                    checked={selectedColumn === "artificialIntelligence"}
                    onChange={() => handleRadioChange("artificialIntelligence")}
                  />
                  AI
                </label>
              </th>
              <th className="p-2">
                <label>
                  <input
                    type="radio"
                    name="selectedColumn"
                    value="security"
                    checked={selectedColumn === "security"}
                    onChange={() => handleRadioChange("security")}
                  />
                  Security
                </label>
              </th>
              <th className="p-2">
                <label>
                  <input
                    type="radio"
                    name="selectedColumn"
                    value="databases"
                    checked={selectedColumn === "databases"}
                    onChange={() => handleRadioChange("databases")}
                  />
                  DBMS
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="border p-2">
                  <Checkbox
                    id={row.id}
                    checked={selectedRows.some((selectedRow) => selectedRow.name === row.name)}
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
      </div>

      <div className="col-span-1 pl-4">
        <Plot
          data={[
            {
              type: 'bar',
              x: selectedRows.map((row) => row.name),
              y: selectedRows.map((row) => row[selectedColumn]),
              marker: { color: getRandomColor() },
            },
          ]}
          style={{ width: '100%', height: '100%' }}
          layout={{
            barmode: 'stack',
            title: `${selectedColumn}`,
            xaxis: {
              title: 'Names',
            },
            yaxis: {
              title: 'Marks',
            },
          }}
        />
      </div>
    </>
  );
}
