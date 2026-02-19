const consoleLog = require("../Helpers/consoleLog")

const SubscriptionController = {

    activeSubscription: async (req, res) => {

        try {

            const userId = req.user.id

            const user = await req.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    isPremium: true,
                }
            })

            consoleLog('My subscription', user)

            res.json({ ok: true, user })

        } catch (error) {
            consoleLog('active subscription error', error)
            return res.json({ ok: false})
        }

    },

    cancelSubscription: async (req, res) => {

        try {

            const userId = req.user.id

            const user = await req.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    isPremium: false,
                }
            })

            consoleLog('My subscription', user)

            res.json({ ok: true, user })

        } catch (error) {
            consoleLog('cancel subscription error', error)
            return res.json({ ok: false})

        }
    }
}

module.exports = SubscriptionController