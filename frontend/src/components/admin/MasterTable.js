import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const qs = require("qs");
const query = qs.stringify(
  {
    populate: "*",
  },
  {
    encodeValuesOnly: true,
  }
);

const showToastMessage = () => {
  toast.success("New Scent Added! Refreshing Master Table", {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
  });
};

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const PerfumeTable = () => {
  const initState = {
    name: "",
    purchasedML: 0,
    costEveryVisit: 0,
  };

  const [masterData, setMasterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScentForm, setshowScentForm] = useState(false);
  const [newScent, setNewScent] = useState(initState);

  const [buyersList, setBuyersList] = useState([]);
  const [scentsData, setScentsData] = useState([]);

  const navigate = useNavigate();

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
        //console.log(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
    fetchScentsData();
  }, []);

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

  const changeHandler = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setNewScent((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    //console.log(newScent);
  };

  const handleNewScent = async (e) => {
    e.preventDefault();

    const masterPayload = {
      name: newScent.name,
      purchasedML: newScent.purchasedML,
      costEveryVisit: newScent.costEveryVisit,
    };

    try {
      axios
        .post("http://localhost:1337/api/custom2", masterPayload)
        .then((response) => {
          console.log(response);
          showToastMessage();
          setNewScent(initState);
          setshowScentForm(false);
        });
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      navigate(0);
    }, 4000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading ? (
        <p>Kindly wait ... Master Table is loading</p>
      ) : (
        <>
          <div className="text-xl font-bold pb-4">Master Sheet</div>
          <div className="flex space-x-2">
            <button
              onClick={() => setshowScentForm((prevState) => !prevState)}
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold p-1 rounded"
            >
              Add new Scent
            </button>

            <button
              onClick={handleMTEdit}
              className="bg-[#0058a3] hover:bg-blue-700 text-white font-bold p-1 rounded"
            >
              Edit Master Table
            </button>
          </div>

          <div className="py-5">
            {showScentForm && (
              <form onSubmit={handleNewScent}>
                <label className="pr-5">
                  <span className="font-semibold">Name:</span>
                  <input
                    type="text"
                    name="name"
                    autoFocus
                    value={newScent.name}
                    onChange={changeHandler}
                    className="border-2 border-slate-200"
                  />
                </label>

                <label className="pr-5 ">
                  <span className="font-semibold">Purchased ML:</span>
                  <input
                    type="number"
                    min={0}
                    name="purchasedML"
                    value={newScent.purchasedML}
                    onChange={changeHandler}
                    className="border-2 border-slate-200 "
                  />
                </label>

                <label className="pr-5">
                  <span className="font-semibold">Cost Per Visit:</span>
                  <input
                    type="number"
                    min={0}
                    name="costEveryVisit"
                    value={newScent.costEveryVisit}
                    onChange={changeHandler}
                    className="border-2 border-slate-200"
                  />
                </label>
                <button className="px-5 bg-green-500 text-white">+</button>
              </form>
            )}
            <ToastContainer />
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
                        ? formatter.format(
                            (perfume.attributes.literCost / 1000) *
                              item.attributes.group
                          )
                        : null}
                    </td>
                  ))}

                  <td className="border p-3">
                    {formatter.format(
                      (perfume.attributes.literCost / 1000) * 2
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PerfumeTable;
