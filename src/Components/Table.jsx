import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ states }) {
  return (
    <div className="table">
      {states.map(({ state, active }) => (
        <tr>
          <td>{state} </td>
          <td>
            <strong>{numeral(active).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
