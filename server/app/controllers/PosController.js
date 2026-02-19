const consoleLog = require("../Helpers/consoleLog")

const PosController = {

    create: async (req, res) => {
        try {
            consoleLog('sale body', req.user)

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.store) return res.json({ ok: false, msg: "Business not found!" })

            const invoice = await req.prisma.invoice.create({
                data: {
                    type: 'sale',
                    saleType: 'pos',
                    paymentMethod: req.body.paymentMethod,
                    userId: req.user.id,
                    customerId: req.body.customerId,
                    refNo: req.body.sku || (1000 + +(await req.prisma.invoice.count())).toString(),
                    businessId: req?.store?.id,
                    totalAmount: +req.body.totalAmount,
                    paid: req.body.paymentMethod == 'credit' ? 0 : +req.body.paidAmount,
                    due: req.body.paymentMethod == 'credit' ? +req.body.paidAmount : +req.body.dueAmount,
                    note: req.body.note,
                    invoiceData: req.body.saleDate,
                    status: true,
                }
            })


            await Promise.all(req?.body?.saleProducts?.map(async (product) => {

                await req.prisma.sale.create({
                    data: {
                        customerId: req.body.customerId,
                        businessId: req?.store?.id,
                        invoiceId: invoice.id,
                        productId: product.id,
                        userId: req.user.id,
                        quantity: +product.qty,
                        unitPrice: product.purchasePrice,
                        total: product.purchasePrice * product.qty,
                        taxId: product.taxId,
                        taxRate: +product.taxRate
                    }
                })

                await req.prisma.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        stock: {
                            decrement: +product.qty
                        }
                    }
                })

            }))

            // await Promise.all([createSale])

            const getInvoice = await req.prisma.invoice.findFirst({
                where: {
                    id: invoice.id
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

            consoleLog('Created invoice', getInvoice)

            return res.json({ ok: true, invoice: getInvoice })

        } catch (error) {
            consoleLog('salse create error', error)
            res.json({ ok: false })
        }
    },

    getInvoices: async (req, res) => {
        try {

            const date = req.query.date
            const query = req.query.query
            // consoleLog('Sales query', query)

            const businessId = req?.store?.id
            const userId = req?.user?.id

            if(!businessId) return res.json({ ok: false })


            const invoices = await req.prisma.invoice.findMany({
                where: {
                    businessId: businessId,
                    type: 'sale',
                    saleType: 'pos',
                    createdAt: {
                        gte: new Date(date[0]),
                        lte: new Date(date[1]),
                    },


                    OR: [
                        {
                            refNo: {
                                contains: query,
                                mode: 'insensitive'
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
                    ]


                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    customer: true,
                    user: true,
                    sales: {
                        include: {
                            user: true,
                            product: true
                        }
                    },
                    business: true
                }
            })

            // consoleLog('Business invoices', invoices)

            return res.json({ ok: true, invoices })

        } catch (error) {
            consoleLog('get sales error', error)
            res.json({ ok: false })
        }
    },

    getProducts: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id


            if (!businessId) return res.json({ ok: false, msg: "Business not found!" })

            const products = await req.prisma.product.findMany({
                where: {
                    businessId: businessId,
                    stock: {
                        gt: 0
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            // consoleLog('Business products', products)

            return res.json({ ok: true, products })

        } catch (error) {
            consoleLog('get pos products error', error)
            res.json({ ok: false })
        }
    },

    deletePos: async (req, res) => {
        try {

            const { id } = req.body

            const expense = await req.prisma.expense.findFirst({
                where: {
                    id: id,
                    businessId: req?.store?.id
                },
                // include: {

                // }
            })

            // consoleLog('Delete Category', category)

            const deleteExpense = await req.prisma.expense.delete({
                where: {
                    id: brand.id
                }
            })

            res.json({ ok: true })

        } catch (error) {
            consoleLog('Expense Delete Error', error)
            res.json({ ok: false })
        }
    }
}

module.exports = PosController