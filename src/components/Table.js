import React from 'react';
import numeral from 'numeral';
import { v4 as uuidv4 } from 'uuid';
import './styles/Table.css';

function Table({ countries }){
  return (
    <div className='table'>
      <table>
        <tbody>
          {
            countries.map(({ country, cases }) => (
              <tr key={uuidv4()}>
                <td>{country}</td>
                <td>
                  <strong>{numeral(cases).format()}</strong>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Table;