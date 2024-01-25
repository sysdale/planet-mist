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

        const newScentData = await strapi.entityService.create(
          "api::scent-data.scent-data",
          {
            data: {
              milliLts: 2,
              SKU_fk: currentOrderDetail.id,
            },
          }
        );

        const newScentData2 = await strapi.entityService.create(
          "api::scent-data.scent-data",
          {
            data: {
              milliLts: 16,
              SKU_fk: currentOrderDetail.id,
            },
          }
        );

        const newScentData3 = await strapi.entityService.create(
          "api::scent-data.scent-data",
          {
            data: {
              milliLts: 20,
              SKU_fk: currentOrderDetail.id,
            },
          }
        );

        ctx.body = newOrder;
        ctx.body = newScentData;
        ctx.body = newScentData2;
        ctx.body = newScentData3;
      } catch (error) {
        ctx.body = error;
      }
    },
  })
);
