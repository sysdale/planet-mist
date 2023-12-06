import axios from "axios";

const orderHistory = async (id) => {
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
      encodeValuesOnly: true, // prettify URL
    }
  );

  await axios
    .get(`${process.env.REACT_APP_API_BUYERS}/${id}?${query}`)
    .then((response) => console.log(response.data));
};

export default orderHistory;
