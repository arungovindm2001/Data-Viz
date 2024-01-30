import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './styles.css';
import Spinner from '../spinner.svg';
import BarGraph from './BarGraph';

export default function DataTable() {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedColumn, setSelectedColumn] = useState('algorithms');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleData, setVisibleData] = useState([]);
  const [isMounted, setIsMounted] = useState(true);

  const handleCheckboxChange = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId);
      } else {
        newSelectedRows.add(rowId);
      }
      return newSelectedRows;
    });
    // console.log(selectedRows);
  };

  const handleRadioChange = (column) => {
    setSelectedColumn(column);
  };

  const handleNextPage = async (page) => {
    try {
      const response = await axios.get(
        `https://retoolapi.dev/cp42M1/data?_page=${page}&_per_page=${rowsPerPage}`,
      );

      setVisibleData((prev) => {
        const existingIds = new Set(prev.map((row) => row.id));
        const filteredData = response.data.filter((row) => !existingIds.has(row.id));
        return [...prev, ...filteredData];
      });

      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const totalPages = 5;
  const rowsPerPage = 10;

  const columnMappings = [
    { value: 'algorithms', label: 'DSA' },
    { value: 'operatingSystems', label: 'OS' },
    { value: 'networks', label: 'Networks' },
    { value: 'artificialIntelligence', label: 'AI' },
    { value: 'security', label: 'Security' },
    { value: 'databases', label: 'DBMS' },
  ];

  const getColumnLabel = (column) => {
    const mapping = columnMappings.find((item) => item.value === column);
    return mapping ? mapping.label : '';
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `https://retoolapi.dev/cp42M1/data?_page=${currentPage}&_per_page=${rowsPerPage}`,
      );
      return response.data;
    }

    const fetchDataAndInitialize = async () => {
      try {
        const data = await fetchData();
        setVisibleData((prev) => {
          const existingIds = new Set(prev.map((row) => row.id));
          const filteredData = data.filter((row) => !existingIds.has(row.id));
          return [...prev, ...filteredData];
        });
        if (isMounted) {
          setSelectedRows(new Set(data.slice(0, 5).map((row) => row.id)));
          setIsMounted(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndInitialize();
  }, []);

  return visibleData.length !== 0 ? (
    <div className='page'>
      <div className='component'>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              {columnMappings.map((column) => (
                <th key={column.value}>
                  <label>
                    <input
                      type='radio'
                      name='selectedColumn'
                      value={column.value}
                      checked={selectedColumn === column.value}
                      onChange={() => handleRadioChange(column.value)}
                    />
                    {getColumnLabel(column.value)}
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type='checkbox'
                      className='checkbox'
                      id={row.id}
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>{row.algorithms}</td>
                  <td>{row.operatingSystems}</td>
                  <td>{row.networks}</td>
                  <td>{row.artificialIntelligence}</td>
                  <td>{row.security}</td>
                  <td>{row.databases}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className='pagination'>
          <div>
            Page <span className='page-number'>{currentPage}</span> of {totalPages}
          </div>
          <div className='pagination--buttons'>
            <button
              className='pagination--buttons--prev'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className='pagination--buttons--next'
              onClick={() => handleNextPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className='component'>
        <BarGraph
          x={Array.from(selectedRows).map((rowId) => {
            const selectedRow = visibleData.find((row) => row.id === rowId);
            return selectedRow ? selectedRow.name : 'N/A';
          })}
          y={Array.from(selectedRows).map((rowId) => {
            const selectedRow = visibleData.find((row) => row.id === rowId);
            return selectedRow[selectedColumn];
          })}
          title={getColumnLabel(selectedColumn)}
        />
      </div>
    </div>
  ) : (
    <div className='spinner-container'>
      <img src={Spinner} className='spinner' alt='loading-spinner' />
    </div>
  );
}
