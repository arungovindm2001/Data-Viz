import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './styles.css';
import Spinner from '../spinner.svg';
import BarGraph from './BarGraph';

export default function DataTable() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('algorithms');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleData, setVisibleData] = useState([]);
  const [isMounted, setIsMounted] = useState(true);

  const handleCheckboxChange = (rowData) => {
    setSelectedRows((prevSelectedRows) => {
      const isRowSelected = prevSelectedRows.some((row) => row.name === rowData.name);

      if (isRowSelected) {
        return prevSelectedRows.filter((row) => row.name !== rowData.name);
      } else {
        return [...prevSelectedRows, rowData];
      }
    });
    console.log(selectedRows);
  };

  const handleRadioChange = (column) => {
    setSelectedColumn(column);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const totalPages = 5;
  const rowsPerPage = 10;

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
        setVisibleData(data);
        console.log(data);
        if (isMounted) {
          const initialSelectedRows = data.slice(0, 5).map((row) => ({ ...row }));
          setSelectedRows(initialSelectedRows);
          setIsMounted(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndInitialize();
  }, [currentPage, isMounted]);

  return visibleData.length !== 0 ? (
    <div className='page'>
      <div className='component'>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>
                <label>
                  <input
                    type='radio'
                    name='selectedColumn'
                    value='algorithms'
                    checked={selectedColumn === 'algorithms'}
                    onChange={() => handleRadioChange('algorithms')}
                  />
                  DSA
                </label>
              </th>
              <th>
                <label>
                  <input
                    type='radio'
                    name='selectedColumn'
                    value='operatingSystems'
                    checked={selectedColumn === 'operatingSystems'}
                    onChange={() => handleRadioChange('operatingSystems')}
                  />
                  OS
                </label>
              </th>
              <th>
                <label>
                  <input
                    type='radio'
                    name='selectedColumn'
                    value='networks'
                    checked={selectedColumn === 'networks'}
                    onChange={() => handleRadioChange('networks')}
                  />
                  Networks
                </label>
              </th>
              <th>
                <label>
                  <input
                    type='radio'
                    name='selectedColumn'
                    value='artificalIntelligence'
                    checked={selectedColumn === 'artificialIntelligence'}
                    onChange={() => handleRadioChange('artificialIntelligence')}
                  />
                  AI
                </label>
              </th>
              <th>
                <label>
                  <input
                    type='radio'
                    name='selectedColumn'
                    value='security'
                    checked={selectedColumn === 'security'}
                    onChange={() => handleRadioChange('security')}
                  />
                  Security
                </label>
              </th>
              <th>
                <label>
                  <input
                    type='radio'
                    name='selectedColumn'
                    value='databases'
                    checked={selectedColumn === 'databases'}
                    onChange={() => handleRadioChange('databases')}
                  />
                  DBMS
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type='checkbox'
                    className='checkbox'
                    id={row.id.toString()}
                    checked={selectedRows.some((selectedRow) => selectedRow.id === row.id)}
                    onChange={() => handleCheckboxChange(row)}
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className='pagination--buttons--next'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className='component'>
        <BarGraph
          x={selectedRows.map((row) => row.name)}
          y={selectedRows.map((row) => row[selectedColumn])}
          title={selectedColumn}
        />
      </div>
    </div>
  ) : (
    <div className='spinner-container'>
      <img src={Spinner} className='spinner' alt='loading-spinner' />
    </div>
  );
}
