import axios from "axios";
import React, { useEffect, useState } from "react";

const qs = require("qs");
const query = qs.stringify(
  {
    populate: "*",
  },
  {
    encodeValuesOnly: true,
  }
);

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const PerfumeTable = () => {
  const [masterData, setMasterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [buyersList, setBuyersList] = useState([]);
  const [scentsData, setScentsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_MASTERTABLE}?${query}`
        );

        const buyers = await axios.get(process.env.REACT_APP_API_BUYERS);

        const updatedData = response.data.data.map((perfume) => ({
          ...perfume,
          attributes: {
            ...perfume.attributes,
            literCost:
              (perfume.attributes.costEveryVisit /
                perfume.attributes.purchasedML) *
              1000,
          },
        }));

        setMasterData(updatedData);
        setBuyersList(buyers.data.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchScentsData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_SCENTDATAS}?${query}`
        );

        setScentsData(response.data.data);
        console.log(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
    fetchScentsData();
  }, []);

  const updateScentsDataBackend = async (updatedScents) => {
    const payload = {
      data: {
        price: updatedScents.attributes.price,
      },
    };

    try {
      await axios.put(process.env.REACT_APP_API_SCENTDATAS, payload);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMTEdit = async () => {
    const updatedScents = scentsData.map((perfume) => {
      const current = masterData.find(
        (masterRow) =>
          masterRow.attributes.SKU_fk.data.id ===
          perfume.attributes.SKU_fk.data.id
      );

      if (current) {
        const updatedPrice =
          (current.attributes.literCost / 1000) * perfume.attributes.milliLts;

        return {
          ...perfume,
          attributes: {
            ...perfume.attributes,
            price: updatedPrice,
          },
        };
      }
      return perfume;
    });

    setScentsData(updatedScents);
  };

  const handleNewScent = () => {};

  return (
    <>
      {isLoading ? (
        <p>Kindly wait ... Master Table is loading</p>
      ) : (
        <>
          <div className="text-xl font-bold pb-4">Master Sheet</div>
          <div className="flex space-x-2">
            <button
              onClick={handleNewScent}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
            >
              Add new Scent
            </button>

            <button
              onClick={handleMTEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
            >
              Edit Master Table
            </button>
          </div>

          <table className="table-auto text-center border-collapse py-3">
            <thead>
              <tr>
                <th className="border p-3">SKU</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Purchased ML</th>
                <th className="border p-3">Cost Per Visit</th>
                <th className="border p-3">Liter Cost</th>
                {buyersList.map((item) => (
                  <th key={item.id} className="border p-3">
                    {item.attributes.buyerName}-{item.attributes.group}
                  </th>
                ))}
                <th className="border p-3">Testers (5ml)</th>
              </tr>
            </thead>
            <tbody>
              {masterData.map((perfume) => (
                <tr key={perfume.id}>
                  <td className="border p-3">
                    {perfume.attributes.SKU_fk.data.id}
                  </td>
                  <td className="border p-3">
                    {perfume.attributes.SKU_fk.data.attributes.name}
                  </td>
                  <td className="border p-3">
                    {perfume.attributes.purchasedML}
                  </td>
                  <td className="border p-3">
                    {formatter.format(perfume.attributes.costEveryVisit)}
                  </td>
                  <td className="border p-3">
                    {formatter.format(perfume.attributes.literCost)}
                  </td>

                  {/* buyers information here */}
                  {buyersList.map((item) => (
                    <td className="border p-3" key={item.id}>
                      {item.attributes.group === 20 ||
                      item.attributes.group === 16
                        ? (perfume.attributes.literCost / 1000) *
                          item.attributes.group
                        : null}
                    </td>
                  ))}

                  <td className="border p-3">
                    {(perfume.attributes.literCost / 1000) * 2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default PerfumeTable;
