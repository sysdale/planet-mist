"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const newOrderData = {
  data: {
    date: "2010-12-08",
    buyerID_fk: {
      id: 3,
    },
    order_details: {
      data: {
        quantity: 12,
        scentID_fk: {
          id: 6,
        },
      },
    },
  },
};

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async customAction(ctx) {
    try {
      const entry = await strapi.entityService.create("api::order.order", {
        data: {
          date: "2020-12-01",
          buyerID_fk: 3,
        },
      });
      return entry;
    } catch (error) {
      ctx.body = error;
    }
  },
}));
