module.exports = {
  routes: [
    {
      method: "POST",
      path: "/custom",
      handler: "order.customAction",
      config: {
        auth: false,
      },
    },
  ],
};
