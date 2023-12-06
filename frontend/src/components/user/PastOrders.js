import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const qs = require("qs");
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

const PastOrders = () => {
  const { id } = useParams();
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pastOrdersAPI = async (id) => {
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

    pastOrdersAPI(id);
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

          <div className="text-xl font-bold">Order History</div>
          <table className="table-auto border-separate">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>5ML</th>
                <th>30ML</th>
                <th>50ML</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {console.log(
                pastOrders.attributes.orders.data[0].attributes.order_details
                  .data[0].attributes
              )}

              {pastOrders.attributes.orders.data.map((order) => {
                return (
                  <tr key={order.id}>
                    <td>
                      {
                        pastOrders.attributes.orders.data[0].attributes
                          .order_details.data[0].attributes.scentID_fk.data
                          .attributes.SKU_fk.data.id
                      }
                    </td>
                    <td>
                      {
                        pastOrders.attributes.orders.data[0].attributes
                          .order_details.data[0].attributes.scentID_fk.data
                          .attributes.SKU_fk.data.attributes.name
                      }
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {
                        pastOrders.attributes.orders.data[0].attributes
                          .order_details.data[0].attributes.scentID_fk.data
                          .attributes.price
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default PastOrders;
