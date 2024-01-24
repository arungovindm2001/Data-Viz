"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import axios from "axios";

import { DataProps } from "./data";
import { getRandomColor } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";


export function DataTable() {
  const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
  const [selectedRows, setSelectedRows] = useState<DataProps[]>([]);
  const [selectedColumn, setSelectedColumn] = useState("algorithms");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleData, setVisibleData] = useState<DataProps[]>([]);
  const [isMounted, setIsMounted] = useState(true)

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

  const handleRadioChange = (column: any) => {
    setSelectedColumn(column);
  };

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const rowsPerPage = 10;
  const totalPages = 5


  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`https://retoolapi.dev/cp42M1/data?_page=${currentPage}&_per_page=${rowsPerPage}`)
      return response.data
    }

    const fetchDataAndInitialize = async () => {
      try {
        const data = await fetchData();
        setVisibleData(data);
        console.log(data)
        if(isMounted) {
          const initialSelectedRows: DataProps[] = data.slice(0, 5).map((row: DataProps) => ({ ...row }));
          setSelectedRows(initialSelectedRows);
          setIsMounted(false)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndInitialize();
  }, [currentPage]);

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
            {visibleData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="border p-2">
                  <Checkbox
                    id={row.id.toString()}
                    checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
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

        <div className="flex mt-4 justify-between">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex">
            <Button
              className="mx-1 px-2 py-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <Button
              className="mx-1 px-2 py-1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>

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
            yaxis: {
              title: 'Marks',
            },
          }}
        />
      </div>
    </>
  );
}
