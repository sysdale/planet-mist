"use strict";

/**
 * order-detail controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::order-detail.order-detail",
  ({ strapi }) => ({
    async createOrder(ctx) {
      try {
        const entry = await strapi.entityService.create(
          "api::order-detail.order-detail",
          { data: { quantity: 12, scentID_fk: 7 } }
        );

        const newOrder = await strapi.entityService.create("api::order.order", {
          data: {
            date: "1990-01-01",
            buyerID_fk: 3,
            order_details: [entry.id],
          },
        });

        ctx.body = newOrder;
      } catch (error) {
        ctx.body = error;
      }
    },
  })
);
