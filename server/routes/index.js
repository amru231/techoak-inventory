const authRoutes = require("./authRoutes");
const brandRoutes = require("./brandRoutes");
const businessRoutes = require("./businessRoutes");
const categoryRoutes = require("./categoryRoutes");
const customerRoutes = require("./customerRoutes");
const expenseRoutes = require("./expenseRoutes");
const posRoutes = require("./posRoutes");
const productRoutes = require("./productRoutes");
const profileRoutes = require("./profileRoutes");
const purchaseRoutes = require("./purchaseRoutes");
const saleRoutes = require("./saleRoutes");
const supplierRoutes = require("./supplierRoutes");
const reportRouter = require("./reportRouter");
const taxdRoutes = require("./taxRoutes");
const unitRoutes = require("./unitRoutes");
const variationRoutes = require("./variationRoutes");
const userRoutes = require("./userRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");

// /* GET home page. */
// require('./reportRouter')(router)

const indexRouter = (app) => {
  app.use('/auth', authRoutes);
  app.use('/report', reportRouter)
  app.use('/business', businessRoutes)
  app.use('/category', categoryRoutes)
  app.use('/brand', brandRoutes)
  app.use('/variation', variationRoutes)
  app.use('/unit', unitRoutes)
  app.use('/supplier', supplierRoutes)
  app.use('/customer', customerRoutes)
  app.use('/tax', taxdRoutes)
  app.use('/product', productRoutes)
  app.use('/purchase', purchaseRoutes)
  app.use('/sale', saleRoutes)
  app.use('/expense', expenseRoutes)
  app.use('/pos', posRoutes)
  app.use('/profile', profileRoutes)
  app.use('/user', userRoutes)
  app.use('/subscription', subscriptionRoutes)

}

module.exports = indexRouter;
