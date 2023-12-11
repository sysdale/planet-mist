import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";

const mltsValues = [5, 30, 50];

const PastOrders = ({ dateFilter }) => {
  const { id } = useParams();
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BUYERS}/${id}?${query}`
        );
        setPastOrders(response.data.data);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

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
            .map((order) => (
              <div key={order.id}>
                <div>
                  Order #{order.id} placed on {order.attributes.date}
                </div>
                <table className="table-auto text-center border-separate py-3">
                  <thead>
                    <tr key={order.id}>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>5ML</th>
                      <th>30ML</th>
                      <th>50ML</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.attributes.order_details.data.map((detail) => (
                      <tr key={detail.id}>
                        {/* SKU */}
                        <td>
                          {
                            detail.attributes.scentID_fk.data.attributes.SKU_fk
                              .data.id
                          }
                        </td>
                        {/* Name */}
                        <td>
                          {
                            detail.attributes.scentID_fk.data.attributes.SKU_fk
                              .data.attributes.name
                          }
                        </td>

                        {/* 5ML */}
                        <td>
                          {mltsValues.includes(5) &&
                            detail.attributes.scentID_fk.data.attributes
                              .milliLts === 5 &&
                            (detail.attributes.quantity || "-")}
                        </td>

                        {/* 30ML */}
                        <td>
                          {mltsValues.includes(30) &&
                            detail.attributes.scentID_fk.data.attributes
                              .milliLts === 30 &&
                            (detail.attributes.quantity || "-")}
                        </td>

                        {/* 50ML */}
                        <td>
                          {mltsValues.includes(50) &&
                            detail.attributes.scentID_fk.data.attributes
                              .milliLts === 50 &&
                            (detail.attributes.quantity || "-")}
                        </td>

                        {/* Price */}
                        <td>
                          {detail.attributes.scentID_fk.data.attributes.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          {console.log(pastOrders)}
        </>
      )}
    </>
  );
};

export default PastOrders;
