const CloudinaryHelper = require("../Helpers/CloudinaryHelper")
const consoleLog = require("../Helpers/consoleLog")

const ProductController = {

    create: async (req, res) => {
        try {
            // consoleLog('brand body', req.body)
            consoleLog('user business', req.body.business)

            //    req.body

            // return res.status(200).json({ ok: true })

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.body.business) return res.json({ ok: false, msg: "Business not found!" })

            // const imageUploadResult = req.body.image ? await CloudinaryHelper.uploader.upload(req.body.image, {
            //     folder: `product_images/${req?.user?.id}`,
            //     format: 'webp',
            //     width: 500,
            //     height: 300,
            //     crop: "fill",
            //     quality: 75
            // }) : null

            const product = await req.prisma.product.create({
                data: {
                    name: req.body.name,

                    sku: req.body.sku || 'SKU-' + 1000 + +(await req.prisma.product.count()),

                    unitId: req.body.unitId,

                    unitValue: req.body.unitValue,

                    brandId: req.body.brandId,

                    categoryId: req.body.categoryId,

                    businessId: req.body.business,

                    taxId: req.body.taxId,

                    alertQuantity: +req.body.alertQuantity,

                    description: req.body.description,

                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJiT-UHSm6w0Jperb8SitpfoAKeMUE3uynPg5YO-2Drw&s',
                    // imageUploadResult?.secure_url,

                    taxRate: +req.body.taxRate,

                    profitMargin: +req.body.profitMargin,

                    purchasePrice: +req.body.purchasePrice,

                    sellingPriceIncTax: +req.body.sellingPriceIncludingTax,

                    sellingPriceExcTax: +req.body.sellingPriceExcludingTax,

                    rackNo: req.body.rackNo,
                    row: req.body.row,
                    column: req.body.column
                    // status: true,
                }

            })

            return res.json({ ok: true, product })

        } catch (error) {
            consoleLog('product create error', error)
            res.json({ ok: false })
        }
    },

    getProducts: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id

            if(!businessId) return res.json({ ok: false })

            const products = await req.prisma.product.findMany({
                where: {
                    businessId: businessId
                },
                include: {
                    category: true,
                    brand: true,
                    tax: true,
                    unit: true
                }
            })

            // consoleLog('Business products', products)

            return res.json({ ok: true, products })

        } catch (error) {
            consoleLog('get brands error', error)
            res.json({ ok: false })
        }
    },

    getProductById: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id

            if(!businessId) return res.json({ ok: false })

            const product = await req.prisma.product.findFirst({
                where: {
                    sku: req.params.id
                },
                include: {
                    category: true,
                    brand: true,
                    tax: true,
                    unit: true
                }
            })

            // consoleLog('Business products', products)

            return res.json({ ok: true, product })

        } catch (error) {
            consoleLog('get brands error', error)
            res.json({ ok: false })
        }
    },

    searchProducts: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id

            if(!businessId) return res.json({ ok: false })

            const query = req.params.query
            const qStatus = req.params.status

            var searchTearm = undefined

            if(qStatus == 'sale'){
                searchTearm = {
                    stock: {
                        gt: 0
                    }
                }
            }

            console.log('product search query: ', qStatus)

            const products = await req.prisma.product.findMany({
                where: {
                    businessId: businessId,
                    OR: [
                        {name: {contains: query, mode: 'insensitive'}},
                        {sku: {contains: query, mode: 'insensitive'}},
                    ],

                    ...searchTearm
                },
                take: 5,
                include: {
                    category: true,
                    brand: true,
                    tax: true,
                    unit: true
                }
            })

            // consoleLog('Business products', products)

            return res.json({ ok: true, products })

        } catch (error) {
            consoleLog('get brands error', error)
            res.json({ ok: false })
        }
    },
    

    deleteProduct: async (req, res) => {
        try {

            const { id } = req.body

            const businessId =  req?.store?.id
            if(!businessId) return res.json({ ok: false })


            const product = await req.prisma.product.findFirst({
                where: {
                    id: id,
                    businessId: businessId
                },
                // include: {

                // }
            })



            // consoleLog('Delete Category', category)

            const deleteProduct = await req.prisma.product.delete({
                where: {
                    id: product.id
                }
            })

            res.json({ ok: true })

        } catch (error) {
            consoleLog('Product Delete Error', error)
            res.json({ ok: false })
        }
    }
}

module.exports = ProductController