import React, { useContext, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { AppContext } from "../../store/AppContext";

const mlMapping = {
  fiveml: 2,
  thirtyml: 16,
  fiftyml: 20,
};

const ScentsTable = ({ data }) => {
  const { quantities, handleQuants } = useContext(AppContext);

  const uniqueSKUs = Array.from(
    new Set(data.map((scent) => scent.attributes.SKU_fk.data.id))
  );

  const handleQuantity = (sku, milliLts, value) => {
    //getting the scentID
    const scentID = data.find(
      (scent) =>
        scent.attributes.SKU_fk.data.id === sku &&
        scent.attributes.milliLts === mlMapping[milliLts]
    ).id;

    handleQuants((prevQuantities) => ({
      ...prevQuantities,
      [sku]: {
        ...prevQuantities[sku],
        [milliLts]: Number(value),
        [scentID]: Number(value),
      },
    }));
  };

  return (
    <>
      <div className="text-xl font-bold text-center">Scents Details</div>
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
                <td className="font-medium">
                  {scent.attributes.SKU_fk.data.attributes.name}
                </td>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ScentsTable;
