const consoleLog = require("../Helpers/consoleLog")

const brandController = {

    create: async (req, res) => {
        try {
            consoleLog('brand body', req.body)
            // consoleLog('category user business', req.business)

            const { name, status, description } = req.body

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.store) return res.json({ ok: false, msg: "Business not found!" })

            const brand = await req.prisma.brand.create({
                data: {
                    name: name,
                    description: description,
                    status: status == 'yes' ? true : false,
                    businessId: req?.store?.id,
                }
            })

            return res.json({ ok: true, brand })

        } catch (error) {
            consoleLog('brand create error', error)
            res.json({ ok: false })
        }
    },

    getBrands: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id

            if(!businessId) return res.json({ ok: false })


            const brands= await req.prisma.brand.findMany({
                where: {
                    businessId: businessId
                }
            })

            // consoleLog('Business brands', brands)

            return res.json({ ok: true, brands})

        } catch (error) {
            consoleLog('get brands error', error)
            res.json({ ok: false })
        }
    },

    deleteBrand: async (req, res) => {
        try {

            const {id} = req.body 

            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })


            const brand = await req.prisma.brand.findFirst({
                where: {
                    id: id,
                    businessId: businessId
                },
                // include: {

                // }
            })



            // consoleLog('Delete Category', category)

            const deleteBrand = await req.prisma.brand.delete({
                where: {
                    id: brand.id
                }
            })

            res.json({ok:true})
            
        } catch (error) {
            consoleLog('Brand Delete Error', error)
            res.json({ok:false})
        }
    }
}

module.exports = brandController