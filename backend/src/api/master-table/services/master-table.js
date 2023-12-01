'use strict';

/**
 * master-table service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::master-table.master-table');
