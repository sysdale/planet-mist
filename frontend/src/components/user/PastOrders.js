import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import qs from "qs";

const mltsValues = [5, 30, 50];

const PastOrders = () => {
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
  }, [id]);

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

          {pastOrders.attributes.orders.data.map((order) => (
            <div key={order.id}>
              <div>Order #{order.id}</div>
              <table className="table-auto border-separate py-3">
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
                    <>
                      {console.log(detail)}

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
                        {/* 5ML, 30ML, 50ML*/}
                        <td>
                          {detail.attributes.scentID_fk.data.attributes
                            .milliLts === 5
                            ? detail.attributes.quantity
                            : null}
                        </td>
                        <td>
                          {detail.attributes.scentID_fk.data.attributes
                            .milliLts === 30
                            ? detail.attributes.quantity
                            : null}
                        </td>
                        <td>
                          {detail.attributes.scentID_fk.data.attributes
                            .milliLts === 50
                            ? detail.attributes.quantity
                            : null}
                        </td>
                        {/* Price */}
                        <td>
                          {detail.attributes.scentID_fk.data.attributes.price}
                        </td>
                      </tr>
                    </>
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
