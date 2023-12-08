import React, { useState } from "react";
import { FaCartPlus } from "react-icons/fa";

const ScentsTable = ({ data }) => {
  const [quantities, setQuantities] = useState({});

  const handleQuantity = (scentId, field, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [scentId]: {
        ...prevQuantities[scentId],
        [field]: Number(value),
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
                    name={`fiveml-${scent.id}`}
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[scent.id]?.fiveml || 0}
                    onChange={(e) =>
                      handleQuantity(scent.id, "fiveml", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    name={`thirtyml-${scent.id}`}
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[scent.id]?.thirtyml || 0}
                    onChange={(e) =>
                      handleQuantity(scent.id, "thirtyml", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    name={`fiftyml-${scent.id}`}
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[scent.id]?.fiftyml || 0}
                    onChange={(e) =>
                      handleQuantity(scent.id, "fiftyml", e.target.value)
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
