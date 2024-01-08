import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import { format } from "date-fns";

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
  maximumFractionDigits: 2,
});

const InvoiceItem = () => {
  const { state } = useLocation();
  const buyerID = state?.buyerID || null;
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
      } finally {
        setIsLoading(false);
      }
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

        if (!processedObject[skuID]) {
          processedObject[skuID] = {
            name: detail.attributes.scentID_fk.data.attributes.SKU_fk.data
              .attributes.name,
            details: [],
          };
        }

        processedObject[skuID].details.push({
          ml: detail.attributes.scentID_fk.data.attributes.milliLts,
          quantity: detail.attributes.quantity,
          price: detail.attributes.scentID_fk.data.attributes.price,
          ethanol: {
            2: 7,
            16: 30,
            20: 50,
          },
        });
      });

      Object.keys(processedObject).forEach((skuID) => {
        processedObject[skuID].details.sort((a, b) => a.ml - b.ml);
      });

      processedOrders.push(processedObject);
    });

    return processedOrders;
  };

  const calculateSubtotal = (detail) => {
    const quantity = detail.quantity || 0;
    const price = detail.price || 0;
    const ethanol = {
      2: 7,
      16: 30,
      20: 50,
    };

    return quantity * price;
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

          <div className="text-xl font-bold pb-4">Invoice History</div>

          {pastOrders.attributes.orders.data.map((order, index) => {
            let subtotal = 0;
            let totalQuantities = 0;
            let totalSubtotals = 0;
            let totalEthanolCost = 0;
            return (
              <div key={order.id}>
                <div>
                  Invoice #{order.id} generated on {order.attributes.date}
                </div>
                <table className="table-auto text-center border-collapse py-3">
                  <thead>
                    <tr>
                      <th className="border p-3">SKU</th>
                      <th className="border p-3">Name</th>
                      <th className="border p-3">ML</th>
                      <th className="border p-3">Quantity</th>
                      <th className="border p-3">Price</th>
                      <th className="border p-3">Sub-total</th>
                      <th className="border p-3">Ethanol</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.keys(processedData[index]).map((skuID) =>
                      processedData[index][skuID].details.map((detail, i) => {
                        subtotal = calculateSubtotal(detail);
                        totalQuantities += detail.quantity || 0;
                        totalSubtotals += subtotal;
                        totalEthanolCost +=
                          (detail.ethanol[detail.ml] || 0) * detail.quantity;

                        return (
                          <tr key={`${skuID}-${i}`}>
                            <td className="border p-3">{skuID}</td>
                            <td className="border p-3">
                              {processedData[index][skuID].name}
                            </td>
                            <td className="border p-3">{detail.ml}</td>
                            <td className="border p-3">{detail.quantity}</td>
                            <td className="border p-3">
                              {formatter.format(detail.price)}
                            </td>
                            <td className="border p-3">
                              {formatter.format(calculateSubtotal(detail))}
                            </td>
                            <td className="border p-3">
                              {detail.ethanol[detail.ml]}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <div>Total Quantities: {totalQuantities}</div>
                    <div>
                      Total Ethanol Cost: {formatter.format(totalEthanolCost)}
                    </div>
                    <div>Scents Bill: {formatter.format(totalSubtotals)}</div>
                    <div className="font-semibold">
                      Final Bill :{" "}
                      {formatter.format(totalSubtotals + totalEthanolCost)}
                    </div>
                  </div>
                </div>
                {"----------------------------------------------------------"}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default InvoiceItem;
