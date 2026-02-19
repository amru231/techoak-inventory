const consoleLog = require("../Helpers/consoleLog")

const UnitController = {

    create: async (req, res) => {
        try {
            // consoleLog('brand body', req.body)
            // consoleLog('category user business', req.business)
            const { name, status, shortName } = req.body

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.store) return res.json({ ok: false, msg: "Business not found!" })

            const unit = await req.prisma.unit.create({
                data: {
                    name: name,
                    shortName: shortName,
                    status: status == 'yes' ? true : false,
                    businessId: req?.store?.id,
                }
            })

            return res.json({ ok: true, unit })

        } catch (error) {
            consoleLog('brand create error', error)
            res.json({ ok: false })
        }
    },

    getUnits: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id
            if(!businessId) return res.json({ ok: false })

            const units = await req.prisma.unit.findMany({
                where: {
                    businessId: businessId
                }
            })

            // consoleLog('Business units', units)

            return res.json({ ok: true, units })

        } catch (error) {
            consoleLog('get variations error', error)
            res.json({ ok: false })
        }
    },


    deleteUnit: async (req, res) => {
        try {

            const { id } = req.body

            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })

            const unit = await req.prisma.unit.findFirst({
                where: {
                    id: id,
                    businessId: businessId
                },
                // include: {

                // }
            })

            // consoleLog('Delete Category', category)
            const deleteunit = await req.prisma.unit.delete({
                where: {
                    id: unit.id
                }
            })

            res.json({ ok: true })

        } catch (error) {
            consoleLog('Variation Delete Error', error)
            res.json({ ok: false })
        }
    }
}

module.exports = UnitController