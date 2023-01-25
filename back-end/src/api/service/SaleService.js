const { Sale, Product, User, SaleProduct } = require('../../database/models');
const { decodeToken } = require('./Auth.service');

const findSellerSales = async (tokenSellerId) => {
  const sellerId = decodeToken(tokenSellerId);
  const sales = await Sale.findAll({ where: { sellerId } });

  return sales;
};

const findSaleProducts = async (saleId) => {
  const sales = await Sale.findOne({
     where: { id: saleId },
    include: [
      {
      model: Product,
      as: 'products',
    }, {
      model: User,
      as: 'users',
    }] });

    return sales;
};

const createSale = async (saleData) => {
  const userId = decodeToken(saleData.token);
  const { id: saleId } = await Sale.create({ ...saleData.sale, userId });
  const products = saleData.products.map((product) => ({ saleId, ...product }));
  await SaleProduct.bulkCreate(products);

  return saleId;
};

module.exports = { findSellerSales, findSaleProducts, createSale };
