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
        //const { date, buyerID_fk, orderDetailsObj } = ctx.request.body;
        const orderDetailsObj = [
          { quantity: 12, scentID_fk: 7 },
          { quantity: 8, scentID_fk: 3 },
        ];

        const currentOrderDetail = await Promise.all(
          orderDetailsObj.map(({ quantity, scentID_fk }) =>
            strapi.entityService.create("api::order-detail.order-detail", {
              data: { quantity, scentID_fk },
            })
          )
        );

        const newOrder = await strapi.entityService.create("api::order.order", {
          data: {
            date: "1990-02-02",
            buyerID_fk: "3",
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
