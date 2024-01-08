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
        console.log(ctx.request.body);
        const { date, buyerID_fk, detailsArray } = ctx.request.body;

        const currentOrderDetail = await Promise.all(
          detailsArray.map(({ quantity, scentID_fk, price }) =>
            strapi.entityService.create("api::order-detail.order-detail", {
              data: { quantity, scentID_fk, price },
            })
          )
        );

        const newOrder = await strapi.entityService.create("api::order.order", {
          data: {
            date,
            buyerID_fk,
            order_details: currentOrderDetail.map(({ id }) => id),
          },
        });

        ctx.body = newOrder;
      } catch (error) {
        ctx.body = error;
      }
    },
  })
);
