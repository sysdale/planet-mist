import axios from "axios";
import React, { useEffect, useState } from "react";

const perfumeData = [
  {
    sku: 1,
    name: "Bright Crystal",
    purchasedML: 500,
    costPerVisit: 8750,
    literCost: 17500,
    zoCulture: 350,
    yesfir: 350,
    tropicalMist: 280,
    testers: 35,
  },
  {
    sku: 2,
    name: "Envy",
    purchasedML: 200,
    costPerVisit: 5000,
    literCost: 25000,
    zoCulture: 500,
    yesfir: 500,
    tropicalMist: 400,
    testers: 50,
  },
  {
    sku: 3,
    name: "Flora",
    purchasedML: 200,
    costPerVisit: 4000,
    literCost: 20000,
    zoCulture: 400,
    yesfir: 400,
    tropicalMist: 320,
    testers: 40,
  },
  {
    sku: 4,
    name: "Herrera for Men",
    purchasedML: 1000,
    costPerVisit: 1000,
    literCost: 1000,
    zoCulture: 20,
    yesfir: 20,
    tropicalMist: 16,
    testers: 2,
  },
  {
    sku: 5,
    name: "1 million",
    purchasedML: 1000,
    costPerVisit: 1000,
    literCost: 1000,
    zoCulture: 20,
    yesfir: 20,
    tropicalMist: 16,
    testers: 2,
  },
  {
    sku: 6,
    name: "Mr. Burberry",
    purchasedML: 200,
    costPerVisit: 4800,
    literCost: 24000,
    zoCulture: 480,
    yesfir: 480,
    tropicalMist: 384,
    testers: 48,
  },
  {
    sku: 7,
    name: "Chance Eau De Tendre",
    purchasedML: 300,
    costPerVisit: 8400,
    literCost: 28000,
    zoCulture: 560,
    yesfir: 560,
    tropicalMist: 448,
    testers: 56,
  },
  {
    sku: 8,
    name: "Aventus for Her",
    purchasedML: 200,
    costPerVisit: 5500,
    literCost: 27500,
    zoCulture: 550,
    yesfir: 550,
    tropicalMist: 440,
    testers: 55,
  },
];

const qs = require("qs");
const query = qs.stringify(
  {
    populate: "*",
  },
  {
    encodeValuesOnly: true,
  }
);

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

        console.log(masterData);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchScentsData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_SCENTDATAS);
        setScentsData(response.data.data);

        console.log(scentsData);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
    fetchScentsData();
  }, []);

  const handleMTEdit = () => {};

  return (
    <>
      {isLoading ? (
        <p>Kindly wait ... Master Table is loading</p>
      ) : (
        <>
          <div className="text-xl font-bold pb-4">Master Sheet</div>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded">
            Add new Scent
          </button>

          <button
            onClick={handleMTEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
          >
            Edit Master Table
          </button>

          <table className="table-auto border-separate text-center border-spacing-x-4">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Purchased ML</th>
                <th>Cost Per Visit</th>
                <th>Liter Cost</th>
                {buyersList.map((item) => (
                  <th key={item.id}>
                    {item.attributes.buyerName}-{item.attributes.group}
                  </th>
                ))}
                <th>Testers (5ml)</th>
              </tr>
            </thead>
            <tbody>
              {masterData.map((perfume) => (
                <tr key={perfume.id}>
                  <td>{perfume.attributes.SKU_fk.data.id}</td>
                  <td>{perfume.attributes.SKU_fk.data.attributes.name}</td>
                  <td>{perfume.attributes.purchasedML}</td>
                  <td>{perfume.attributes.costEveryVisit}</td>
                  <td>{perfume.attributes.literCost}</td>

                  {/* buyers information here */}
                  {buyersList.map((item) => (
                    <td key={item.id}>
                      {item.attributes.group === 20 ||
                      item.attributes.group === 16
                        ? (perfume.attributes.literCost / 1000) *
                          item.attributes.group
                        : null}
                    </td>
                  ))}

                  <td>{(perfume.attributes.literCost / 1000) * 2}</td>
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
