import axios from "axios";

const TestAPI = async () => {
  const qs = require("qs");
  const query = qs.stringify(
    {
      populate: {
        order_details: {
          populate: ["scentID_fk"],
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  console.log(query);
  await axios
    .get(`http://localhost:1337/api/orders?${query}`)
    .then((response) => console.log(response.data));
};

export default TestAPI;

// to get SKU of scent
// // {console.log(
// //   pastOrders.attributes.orders.data[0].attributes.order_details
// //     .data[0].attributes.scentID_fk.data.attributes.SKU_fk.data.id
// // )}

// to get name of scent
// // {console.log(
// //   pastOrders.attributes.orders.data[0].attributes.order_details
// //     .data[0].attributes.scentID_fk.data.attributes.SKU_fk.data.attributes.name
// // )}
