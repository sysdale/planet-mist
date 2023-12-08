import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";

const initQty = {
  fiveml: 0,
  thirtyml: 0,
  fiftyml: 0,
};

const ScentsTable = ({ data }) => {
  const [qty, setQty] = useState(initQty);

  const handleQuantity = (e) => {
    const { name, value } = e.target;

    setQty((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    console.log(qty);
  };

  return (
    <>
      <div className="text-xl font-bold">Scents Details</div>
      <table className="text-center border-separate border-spacing-5">
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
                  <input
                    name="fiveml"
                    type="number"
                    value={qty.fiveml}
                    min="0"
                    max="1000"
                    onChange={handleQuantity}
                  />
                </td>
                <td>
                  <input
                    name="thirtyml"
                    type="number"
                    value={qty.thirtyml}
                    min="0"
                    max="1000"
                    onChange={handleQuantity}
                  />
                </td>
                <td>
                  <input
                    name="fiftyml"
                    type="number"
                    value={qty.fiftyml}
                    min="0"
                    max="1000"
                    onChange={handleQuantity}
                  />
                </td>
                <td>
                  <FaCartPlus />
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
