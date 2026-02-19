const consoleLog = require("../Helpers/consoleLog")

const categoryController = {

    create: async (req, res) => {
        try {
            consoleLog('category body', req.body)
            // consoleLog('category user business', req.business)

            const { name, status, description, subCategory, mainCategory } = req.body

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.store) return res.json({ ok: false, msg: "Business not found!" })

            const category = await req.prisma.category.create({
                data: {
                    name: name,
                    description: description,
                    status: status == 'yes' ? true : false,
                    businessId: req?.store?.id,
                    isSubcategory: subCategory,
                    parentId: mainCategory,
                }
            })

            return res.json({ ok: true, category })

        } catch (error) {
            consoleLog('category create error', error)
            res.json({ ok: false })
        }
    },

    getCategories: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id
            if(!businessId) return res.json({ ok: false })

            const categories = await req.prisma.category.findMany({
                where: {
                    businessId: businessId
                },
                include: {
                    children: true
                }
            })

            // consoleLog('Business categories', categories)

            return res.json({ ok: true, categories })

        } catch (error) {
            consoleLog('get categories error', error)
            res.json({ ok: false })
        }
    },

    getParentCategories: async (req, res) => {
        try {

            const businessId = req.store.id
            if(!businessId) return res.json({ ok: false })

            const categories = await req.prisma.category.findMany({
                where: {
                    businessId: businessId,
                    isSubcategory: false
                }
            })

            return res.json({ok: true, categories})
            
        } catch (error) {
            consoleLog('parent categories error', error)
            res.json({ok: false})
        }
    },

    deleteCategory: async (req, res) => {
        try {

            const {id} = req.body 
            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })


            const category = await req.prisma.category.findFirst({
                where: {
                    id: id,
                    businessId: businessId
                },
                // include: {

                // }
            })



            // consoleLog('Delete Category', category)

            const deleteCat = await req.prisma.category.delete({
                where: {
                    id: category.id
                }
            })

            res.json({ok:true})
            
        } catch (error) {
            consoleLog('Category Delete Error', error)
            res.json({ok:false})
        }
    }
}

module.exports = categoryController