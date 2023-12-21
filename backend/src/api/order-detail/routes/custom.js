module.exports = {
  routes: [
    {
      method: "POST",
      path: "/custom",
      handler: "order-detail.createOrder",
      config: {
        auth: false,
      },
    },
  ],
};
