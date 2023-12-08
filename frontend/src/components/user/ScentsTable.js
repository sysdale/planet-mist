import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";

const mlMapping = {
  fiveml: 5,
  thirtyml: 30,
  fiftyml: 50,
};

const ScentsTable = ({ data }) => {
  const [quantities, setQuantities] = useState({});

  const handleQuantity = (sku, milliLts, value) => {
    //getting the scentID
    const scentID = data.find(
      (scent) =>
        scent.attributes.SKU_fk.data.id === sku &&
        scent.attributes.milliLts === mlMapping[milliLts]
    ).id;

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [sku]: {
        ...prevQuantities[sku],
        [milliLts]: Number(value),
        [scentID]: Number(value),
      },
    }));
  };

  const handleAddToCart = () => {
    console.log("Quantities:", quantities);
  };

  // Extract unique SKUs
  const uniqueSKUs = Array.from(
    new Set(data.map((scent) => scent.attributes.SKU_fk.data.id))
  );

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
          {uniqueSKUs.map((sku) => {
            const scent = data.find(
              (scent) => scent.attributes.SKU_fk.data.id === sku
            );
            return (
              <tr key={sku}>
                <td>{sku}</td>
                <td>{scent.attributes.SKU_fk.data.attributes.name}</td>
                <td>
                  <input
                    name={`fiveml-${sku}`}
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[sku]?.fiveml || 0}
                    onChange={(e) =>
                      handleQuantity(sku, "fiveml", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    name={`thirtyml-${sku}`}
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[sku]?.thirtyml || 0}
                    onChange={(e) =>
                      handleQuantity(sku, "thirtyml", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    name={`fiftyml-${scent.id}`}
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[sku]?.fiftyml || 0}
                    onChange={(e) =>
                      handleQuantity(sku, "fiftyml", e.target.value)
                    }
                  />
                </td>
                <td>
                  <FaCartPlus onClick={handleAddToCart} />
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
