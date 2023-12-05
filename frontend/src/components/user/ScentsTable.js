import React from "react";

const ScentsTable = ({ data }) => {
  return (
    <>
      <div className="text-xl font-bold">Scents Details</div>

      <table className="border-separate border-spacing-5">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>5ML</th>
            <th>30ML</th>
            <th>50ML</th>
          </tr>
        </thead>

        <tbody>
          {data.map((scent) => {
            return (
              <tr key={scent.id}>
                <td>{scent.id}</td>
                <td>{scent.attributes.name}</td>
                <td>
                  <input name="5ml" type="number" value={0} min="0" />
                </td>
                <td>
                  <input name="30ml" type="number" value={0} min="0" />
                </td>
                <td>
                  <input name="50ml" type="number" value={0} min="0" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ScentsTable;
