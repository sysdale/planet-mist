import axios from "axios";

const TestAPI = async () => {
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

  console.log(query);
  await axios
    .get(`http://localhost:1337/api/buyers/3?${query}`)
    .then((response) => console.log(response.data));
};

export default TestAPI;
