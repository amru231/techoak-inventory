const consoleLog = require("../Helpers/consoleLog")
const TryCatch = require("../Helpers/TryCatch")


const SupplierController = {

    createSupplier: async (req, res) => {
        TryCatch(res, async () => {

            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })


            const supplier = await req.prisma.supplier.create({
                data: {
                    prefix: req.body.prefix,
                    firstName: req.body.firstName,
                    middleName: req.body.middleName,
                    lastName: req.body.lastName,
                    mobile: req.body.mobile,
                    alternativeMobile: req.body.alternativeMobile,
                    landLine: req.body.landLine,
                    email: req.body.email,
                    taxNumber: req.body.taxNumber,
                    addressOne: req.body.addressOne,
                    addressTwo: req.body.addressTwo,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country,
                    zipCode: req.body.zipCode,
                    description: req.body.description,
                    businessId: businessId,
                    status: true
                }
            })


            res.json({ ok: true, supplier })

        })
    },

    getSuppliers: async (req, res) => {

        TryCatch(res, async () => {

            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })

            
            const suppliers = await req.prisma.supplier.findMany({
                where: {
                    businessId: businessId,
                    status: true
                },

                include: {
                    invoices: {
                        include: {
                            purchases: true,
                            sales: true,
                        }
                    }
                }
            })

            res.json({ ok: true, suppliers: suppliers })
        })
    },

    deleteSupplier: async (req, res) => {

        TryCatch(res, async () => {


        })
    }

}

module.exports = SupplierController