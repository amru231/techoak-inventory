const consoleLog = require("../Helpers/consoleLog")

const ExpenseController = {

    create: async (req, res) => {
        try {
            // consoleLog('expense body', req.body)
            // consoleLog('category user business', req.business)

            const { type, amount, note, expenseDate } = req.body

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            if (!req.store) return res.json({ ok: false, msg: "Business not found!" })

            const expense = await req.prisma.expense.create({
                data: {
                    type: type,
                    note: note,
                    amount: amount,
                    businessId: req?.store?.id,
                    expenseDate: expenseDate
                }
            })

            return res.json({ ok: true, expense })

        } catch (error) {
            consoleLog('expense create error', error)
            res.json({ ok: false })
        }
    },

    getExpenses: async (req, res) => {
        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id
            if(!businessId) return res.json({ ok: false })


            const expenses= await req.prisma.expense.findMany({
                where: {
                    businessId: businessId
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            // consoleLog('Business expenses', expenses)

            return res.json({ ok: true, expenses})

        } catch (error) {
            consoleLog('get expenses error', error)
            res.json({ ok: false })
        }
    },

    deleteExpense: async (req, res) => {
        try {

            const {id} = req.body 

            const businessId = req?.store?.id
            if(!businessId) return res.json({ ok: false })


            const expense = await req.prisma.expense.findFirst({
                where: {
                    id: id,
                    businessId: businessId
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

            res.json({ok:true})
            
        } catch (error) {
            consoleLog('Expense Delete Error', error)
            res.json({ok:false})
        }
    }
}

module.exports = ExpenseController