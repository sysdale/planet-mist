module.exports = {
  routes: [
    {
      method: "POST",
      path: "/custom2",
      handler: "scent-list.createMasterEntry",
      config: {
        auth: false,
      },
    },
  ],
};
