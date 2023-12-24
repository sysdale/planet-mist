import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { format } from "date-fns";

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
        setPastOrders(response.data.data);
        const transformed = processOrderData(response.data.data);
        setProcessedData(transformed);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const processOrderData = (data) => {
    const processedOrders = [];

    data.attributes.orders.data.forEach((order) => {
      const processedObject = {};

      order.attributes.order_details.data.forEach((detail) => {
        const skuID =
          detail.attributes.scentID_fk.data.attributes.SKU_fk.data.id;
        const milliLts = detail.attributes.scentID_fk.data.attributes.milliLts;

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
    });

    return processedOrders;
  };
  return (
    <>
      {isLoading ? (
        <p>Loading... Please Wait...</p>
      ) : (
        <>
          <div className="text-xl pb-5">
            Welcome, {pastOrders.attributes.buyerName}
          </div>

          <div className="text-xl font-bold pb-4">Order History</div>

          {pastOrders.attributes.orders.data
            .filter((order) =>
              dateFilter ? order.attributes.date === dateFilter : true
            )
            .map((order, index) => (
              <div key={order.id}>
                <div>
                  Order #{order.id} placed on {order.attributes.date}
                </div>
                <table className="table-auto text-center border-separate py-3">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>5ml</th>
                      <th>16ml</th>
                      <th>20ml</th>
                      <th>Scents Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(processedData[index]).map((skuID) => (
                      <tr key={skuID}>
                        <td>{skuID}</td>
                        <td>{processedData[index][skuID].name}</td>
                        <td>
                          {processedData[index][skuID].quantities[2] || "-"}
                        </td>
                        <td>
                          {processedData[index][skuID].quantities[16] || "-"}
                        </td>
                        <td>
                          {processedData[index][skuID].quantities[20] || "-"}
                        </td>
                        <td>
                          {Object.values(
                            processedData[index][skuID].quantities
                          ).reduce((acc, qt) => acc + qt, 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default PastOrders;
