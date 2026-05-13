const seed = require('./seed.json');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', seed.products);
    await queryInterface.bulkInsert('warehouses', seed.warehouses);
    await queryInterface.bulkInsert('warehouse_inventory', seed.warehouse_inventory);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('warehouse_inventory');
    await queryInterface.bulkDelete('warehouses');
    await queryInterface.bulkDelete('products');
  },
};
