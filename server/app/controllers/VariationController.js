const consoleLog = require("../Helpers/consoleLog")

const VariationController = {

    create: async (req, res) => {
        try {
            // consoleLog('brand body', req.body)
            // consoleLog('category user business', req.business)

            const { name, status, values } = req.body

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.store) return res.json({ ok: false, msg: "Business not found!" })

            const brand = await req.prisma.variation.create({
                data: {
                    name: name,
                    values: values,
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

    getVariations: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id
            if(!businessId) return res.json({ ok: false })

            const variations= await req.prisma.variation.findMany({
                where: {
                    businessId: businessId
                }
            })

            // consoleLog('Business variations', variations)

            return res.json({ ok: true, variations})

        } catch (error) {
            consoleLog('get variations error', error)
            res.json({ ok: false })
        }
    },


    deleteVariation: async (req, res) => {
        try {

            const {id} = req.body 

            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })


            const brand = await req.prisma.variation.findFirst({
                where: {
                    id: id,
                    businessId: businessId,
                },
                // include: {

                // }
            })



            // consoleLog('Delete Category', category)

            const deleteBrand = await req.prisma.variation.delete({
                where: {
                    id: brand.id
                }
            })

            res.json({ok:true})
            
        } catch (error) {
            consoleLog('Variation Delete Error', error)
            res.json({ok:false})
        }
    }
}

module.exports = VariationController