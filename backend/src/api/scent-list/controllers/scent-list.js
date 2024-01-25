"use strict";

/**
 * scent-list controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::scent-list.scent-list",
  ({ strapi }) => ({
    async createMasterEntry(ctx) {
      try {
        const { name, purchasedML, costEveryVisit } = ctx.request.body;

        const currentOrderDetail = await strapi.entityService.create(
          "api::scent-list.scent-list",
          {
            data: { name },
          }
        );

        const newOrder = await strapi.entityService.create(
          "api::master-table.master-table",
          {
            data: {
              purchasedML,
              costEveryVisit,
              SKU_fk: currentOrderDetail.id,
            },
          }
        );

        ctx.body = newOrder;
      } catch (error) {
        ctx.body = error;
      }
    },
  })
);
