const moment = require("moment")
const consoleLog = require("../Helpers/consoleLog")


const ReportController = {

   getHeadingReports: async (req, res, next) => {

      // consoleLog('Repoert, business', req?.store)
      try {

         const businessId = req?.store?.id
         const userId = req?.user?.id

         const date = req.query.date
         const query = req.query.query


         if (!businessId) return res.json({ ok: false })


         const sales = await req.prisma.invoice.findMany({
            where: {
               businessId: businessId,
               type: 'sale',
               createdAt: {
                  gte: new Date(date[0]),
                  lte: new Date(date[1]),
               },

            },

            orderBy: {
               createdAt: 'desc'
            },

            include: {
               customer: true,
               sales: {
                  include: {
                     product: true
                  }
               },
               business: true
            }

         })


         const salesData = {
            totalSales: sales.reduce((total, current) => {
               return total + current.totalAmount
            }, 0),

            totalPaid: sales.reduce((total, current) => {
               return total + current.paid
            }, 0),

            totalDue: sales.reduce((total, current) => {
               return total + current.due
            }, 0),

            salesCount: sales.reduce((total, current) => {
               return total + current.sales?.length
            }, 0),

         }

         consoleLog('Sales data', salesData)



         const purchases = await req.prisma.invoice.findMany({
            where: {
               businessId: businessId,
               type: 'purchase',
               createdAt: {
                  gte: new Date(date[0]),
                  lte: new Date(date[1]),
               },
            },

            orderBy: {
               createdAt: 'desc'
            },

            include: {
               customer: true,
               purchases: {
                  include: {
                     product: true
                  }
               },
               business: true
            }
         })

         const purcasesData = {
            totalSales: purchases.reduce((total, current) => {
               return total + current.totalAmount
            }, 0),

            totalPaid: purchases.reduce((total, current) => {
               return total + current.paid
            }, 0),

            totalDue: purchases.reduce((total, current) => {
               return total + current.due
            }, 0),

            purchaseCount: purchases.reduce((total, current) => {
               return total + current.purchases?.length
            }, 0),

         }

         // consoleLog('Purchase data', purcasesData)


         return res.json({ ok: true, sale: salesData, purchase: purcasesData })

      } catch (error) {

         // consoleLog('Heading report error', error)
         res.json({ ok: false })
      }
   },

   getThirtyDaySaleReport: async (req, res) => {
      try {

         const businessId = req?.store?.id
         const userId = req?.user?.id
         const query = req.query.query

         if (!businessId) return res.json({ ok: false })

         const date = new Date()

         const sales = await req.prisma.invoice.groupBy({
            by: ['createdAt', 'totalAmount'],
            where: {
               businessId: businessId,
               type: 'sale',
               createdAt: {
                  gte: new Date(Date.now() - ((24 * 60 * 60 * 1000) * date.getDate())).toISOString()
               },

            },

            orderBy: {
               createdAt: 'asc'
            },

            // _sum: {
            //    sales: true,
            //  },

            // include: {
            //    customer: true,
            //    sales: {
            //       include: {
            //          product: true
            //       }
            //    },
            //    business: true
            // }

         })

         const salesWithConvertedMonthName = sales.map((sale) => {
            return {
               ...sale,
               date: moment(sale.createdAt).format('ll')
            }
         })



         var result = salesWithConvertedMonthName.reduce(function (h, obj) {
            h[obj.date] = (h[obj.date] || []).concat(obj);
            return h;
         }, {});

         result = Object.keys(result).map(key => {
            return {
               date: key,
               total: result[key].reduce((a, b) => a + b.totalAmount, 0)
            }
         });
         //   console.log(result);

         // console.log('getThirtyDaySaleReport', result)

         const keys = result.map((r) => r.date)
         const values = result.map((r) => r.total.toFixed(2))

         // consoleLog('getThirtyDaySaleReport', groupedBydate)

         return res.json({ ok: true, keys, values })


      } catch (error) {
         // consoleLog('getThirtyDaySaleReport error', error)
         return res.json({ ok: false })
      }
   },


   getSalesCurrentYear: async (req, res) => {
      try {

         const businessId = req?.store?.id
         const userId = req?.user?.id
         const query = req.query.query

         if (!businessId) return res.json({ ok: false })

         const date = new Date()

         const sales = await req.prisma.invoice.groupBy({
            by: ['createdAt', 'totalAmount'],
            where: {
               businessId: businessId,
               type: 'sale',
               createdAt: {
                  gte: new Date(Date.now() - 31556952000).toISOString()
               },

            },

            orderBy: {
               createdAt: 'asc'
            },

            // _sum: {
            //    sales: true,
            //  },

            // include: {
            //    customer: true,
            //    sales: {
            //       include: {
            //          product: true
            //       }
            //    },
            //    business: true
            // }

         })

         const salesWithConvertedMonthName = sales.map((sale) => {
            return {
               ...sale,
               date: moment(sale.createdAt).format('MMMM')
            }
         })



         var result = salesWithConvertedMonthName.reduce(function (h, obj) {
            h[obj.date] = (h[obj.date] || []).concat(obj);
            return h;
         }, {});

         result = Object.keys(result).map(key => {
            return {
               date: key,
               total: result[key].reduce((a, b) => a + b.totalAmount, 0)
            }
         });
         console.log(result);

         // console.log('getThirtyDaySaleReport', result)

         const keys = result.map((r) => r.date)
         const values = result.map((r) => r.total.toFixed(2))

         // consoleLog('getThirtyDaySaleReport', groupedBydate)

         return res.json({ ok: true, keys, values })


      } catch (error) {
         // consoleLog('getThirtyDaySaleReport error', error)
         return res.json({ ok: false })
      }
   },

   getSalesDue: async (req, res) => {
      try {

         const businessId = req?.store?.id
         const userId = req?.user?.id
         const query = req.query.query

         if (!businessId) return res.json({ ok: false })

         const sales = await req.prisma.invoice.findMany({
            where: {
               businessId: businessId,
               type: 'sale',
               due: {
                  gt: 0
               }
            },

            include: {
               business: true,
               customer: true,
               user:true,
               sales: {
                  include: {
                     product: true
                  }
               }
            }
         })

         // consoleLog('Sales Due', sales)

         return res.json({ ok: true, sales: sales })

      } catch (error) {
         // consoleLog('getThirtyDaySaleReport error', error)
         return res.json({ ok: false })
      }
   },

   getPurchasesDue: async (req, res) => {
      try {

         const businessId = req?.store?.id
         const userId = req?.user?.id
         const query = req.query.query

         if (!businessId) return res.json({ ok: false })

         const purchases = await req.prisma.invoice.findMany({
            where: {
               businessId: businessId,
               type: 'purchase',
               due: {
                  gt: 0
               }
            },

            include: {
               business: true,
               supplier: true,
               purchases: {
                  include: {
                     product: true
                  }
               }
            }
         })

         // consoleLog('Purchases Due', purchases)

         return res.json({ ok: true, purchases: purchases })

      } catch (error) {
         // consoleLog('getThirtyDaySaleReport error', error)
         return res.json({ ok: false })
      }
   },

   getStockAlerts: async (req, res) => {
      try {

         const businessId = req?.store?.id
         const userId = req?.user?.id
         const query = req.query.query

         if (!businessId) return res.json({ ok: false })

         const products = await req.prisma.product.findMany({
            where: {
               businessId: businessId,
               stock: {
                  lt: 50
               }
            },
            // include: {
            //    brand: true,
            //    category: true,
            // }
         })

         console.log(products)

         const stockedProducts = products.filter(product => {
            if(product.stock <= product.alertQuantity){
               return product
            }
         })

         consoleLog('getStockAlert', stockedProducts)
         return res.json({ok: true, products: stockedProducts})

      } catch (error) {
         // consoleLog('getThirtyDaySaleReport error', error)
         return res.json({ ok: false })
      }
   },

   profites: async (req, res) => {

      try {

         const date = req.query.date
         const query = req.query.query
         const cashier = req.query.cashier

         console.log('Cashier query', req.query)

 

         var cashierQuery

         if(cashier){
             cashierQuery = {
                 userId: cashier
             }
         }else{
             cashierQuery = undefined
         }

         const businessId = req?.store?.id
         const userId = req?.user?.id

         console.log('Sales business id', businessId)

         if (!businessId) return res.json({ ok: false })


         const sales = await req.prisma.sale.findMany({
             where: {
                 businessId: businessId,
                 isReturn: false,
                 createdAt: {
                     gte: new Date(date[0]),
                     lte: new Date(date[1]),
                 },

                 OR: [
                     {
                         invoice: {
                             refNo: query
                         }
                     },

                     {
                        product: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },

                     {
                        customer: {
                            firstName: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },

                     {
                         customer: {
                             lastName: {
                                 contains: query,
                                 mode: 'insensitive'
                             }
                         }
                     },

                     {
                         customer: {
                             email: {
                                 contains: query,
                                 mode: 'insensitive'
                             }
                         }
                     },

                     {
                         customer: {
                             mobile: {
                                 contains: query,
                                 mode: 'insensitive'
                             }
                         }
                     },
                 ],
                 ...cashierQuery
             },
             orderBy: {
                 createdAt: 'desc'
             },
             include: {
                 customer: true,
                 user:true,
                 product: true,
                 invoice: {
                  include:{
                     sales: {
                        include: {
                           product: true
                        }
                     }
                  }
                 }
             }
         })

         // consoleLog('Business invoices', invoices)

         return res.json({ ok: true, sales })

     } catch (error) {
         consoleLog('get sales error', error)
         res.json({ ok: false })
     }

   },

   returns: async (req, res) => {

      try {

         const date = req.query.date
         const query = req.query.query
         const cashier = req.query.cashier

         console.log('Cashier query', req.query)

 

         var cashierQuery

         if(cashier){
             cashierQuery = {
                 userId: cashier
             }
         }else{
             cashierQuery = undefined
         }

         const businessId = req?.store?.id
         const userId = req?.user?.id

         console.log('Sales business id', businessId)

         if (!businessId) return res.json({ ok: false })


         const sales = await req.prisma.sale.findMany({
             where: {
                 businessId: businessId,
                 isReturn: true,
                 createdAt: {
                     gte: new Date(date[0]),
                     lte: new Date(date[1]),
                 },

                 OR: [
                     {
                         invoice: {
                             refNo: query
                         }
                     },

                     {
                        product: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },

                     {
                        customer: {
                            firstName: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    },

                     {
                         customer: {
                             lastName: {
                                 contains: query,
                                 mode: 'insensitive'
                             }
                         }
                     },

                     {
                         customer: {
                             email: {
                                 contains: query,
                                 mode: 'insensitive'
                             }
                         }
                     },

                     {
                         customer: {
                             mobile: {
                                 contains: query,
                                 mode: 'insensitive'
                             }
                         }
                     },
                 ],
                 ...cashierQuery
             },
             orderBy: {
                 createdAt: 'desc'
             },
             include: {
                 customer: true,
                 user:true,
                 product: true,
                 invoice: {
                  include:{
                     sales: {
                        include: {
                           product: true
                        }
                     }
                  }
                 }
             }
         })

         // consoleLog('Business invoices', invoices)

         return res.json({ ok: true, sales })

     } catch (error) {
         consoleLog('get sales error', error)
         res.json({ ok: false })
     }

   }

}

module.exports = ReportController