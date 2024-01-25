import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { format, parseISO } from "date-fns";

const mltsValues = [5, 30, 50];
const query = qs.stringify(
  {
    populate: {
      orders: {
        populate: {
          order_details: {
            populate: {
              scentID_fk: {
                populate: ["SKU_fk"],
              },
            },
          },
        },
      },
    },
  },
  {
    encodeValuesOnly: true,
  }
);

const formatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const PastOrders = () => {
  const { state } = useLocation();
  const buyerID = state?.buyerID || null;
  const dateFilter = state?.dateFilter || null;
  //console.log(dateFilter);

  const dateFormat = "dd MMMM yyyy";
  const invoicedStatus = state?.invoicedStatus || null;
  const { id } = useParams() || { id: buyerID };

  const [pastOrders, setPastOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BUYERS}/${id}?${query}`
        );

        response.data.data.attributes.orders.data.sort((a, b) => b.id - a.id);
        setPastOrders(response.data.data);
        console.log(response.data.data);

        const transformed = processOrderData(response.data.data, dateFilter);
        setProcessedData(transformed);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const processOrderData = (data, filterDate) => {
    const processedOrders = [];

    data.attributes.orders.data.forEach((order) => {
      if (!filterDate || order.attributes.date === filterDate) {
        const processedObject = {};

        order.attributes.order_details.data.forEach((detail) => {
          const skuID =
            detail.attributes.scentID_fk.data.attributes.SKU_fk.data.id;
          const milliLts =
            detail.attributes.scentID_fk.data.attributes.milliLts;

          if (!processedObject[skuID]) {
            processedObject[skuID] = {
              scentIDs: {},
              name: detail.attributes.scentID_fk.data.attributes.SKU_fk.data
                .attributes.name,
              quantities: {},
              totalPrice: 0,
            };
          }

          processedObject[skuID].quantities[milliLts] =
            detail.attributes.quantity;
          processedObject[skuID].totalPrice +=
            detail.attributes.quantity *
            detail.attributes.scentID_fk.data.attributes.price;
        });

        processedOrders.push(processedObject);
      }
    });

    return processedOrders;
  };
  return (
    <>
      {isLoading ? (
        <p>Loading... Please Wait...</p>
      ) : (
        <>
          <div className="text-xl pb-5 font-bold">
            Welcome, {pastOrders.attributes.buyerName}
          </div>
          {pastOrders.attributes.orders.data.length > 0 ? (
            <div className="text-xl font-bold pb-4">Order History</div>
          ) : (
            <p>No orders to display</p>
          )}

          {pastOrders.attributes.orders.data
            .filter((order) =>
              dateFilter ? order.attributes.date === dateFilter : true
            )
            .map((order, index) => (
              <div key={order.id}>
                <div>
                  Order #{" "}
                  <span className="text-blue-700 font-medium">{order.id}</span>{" "}
                  placed on{" "}
                  <span className="font-medium">
                    {format(parseISO(order.attributes.date), dateFormat)}
                  </span>
                </div>
                <table className="table-auto text-center border-collapse py-3">
                  <thead>
                    <tr>
                      <th className="border p-3">SKU</th>
                      <th className="border p-3">Name</th>
                      <th className="border p-3">5ml</th>
                      <th className="border p-3">16ml</th>
                      <th className="border p-3">20ml</th>
                      <th className="border p-3">Scents Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processOrderData &&
                      Object.keys(processedData[index]).map((skuID) => (
                        <tr key={skuID}>
                          <td className="border p-2">{skuID}</td>
                          <td className="border p-2">
                            {processedData[index][skuID].name}
                          </td>
                          <td className="border p-2">
                            {processedData[index][skuID].quantities[2] || "-"}
                          </td>
                          <td className="border p-2">
                            {processedData[index][skuID].quantities[16] || "-"}
                          </td>
                          <td className="border p-2">
                            {processedData[index][skuID].quantities[20] || "-"}
                          </td>
                          <td className="border p-2">
                            {Object.values(
                              processedData[index][skuID].quantities
                            ).reduce((acc, qt) => acc + qt, 0)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="mt-3">
                  <div className="font-semibold">
                    Total Scents Ordered:{" "}
                    {Object.values(processedData[index]).reduce(
                      (acc, sku) =>
                        acc +
                        Object.values(sku.quantities).reduce(
                          (accQt, qt) => accQt + qt,
                          0
                        ),
                      0
                    )}
                  </div>
                </div>
                {
                  "-----------------------------------------------------------------------------"
                }
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default PastOrders;
