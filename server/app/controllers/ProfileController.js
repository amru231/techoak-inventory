const consoleLog = require("../Helpers/consoleLog")
const bcrypt = require('bcryptjs');

const ProfileController = {

    update: async (req, res) => {
        try {
            consoleLog('user body', req.body)
            // consoleLog('category user business', req.business)

            const { firstName, lastName, email } = req.body

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            // if (!req.business) return res.json({ ok: false, msg: "Business not found!" })

            const user = await req.prisma.user.update({
                where: {
                    id: req?.user?.id
                },
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                }
            })

            return res.json({ ok: true, user })

        } catch (error) {
            consoleLog('tax create error', error)
            res.json({ ok: false })
        }
    },


    password: async (req, res) => {
        try {
            consoleLog('user body', req.body)
            // consoleLog('category user business', req.business)

            const { password } = req.body

            const hashedPassword = bcrypt.hashSync(password, 12);
            consoleLog('Hashed password', hashedPassword)
    

            if (!req.user) return res.json({ ok: false, msg: "you are not authenticated!" })
            // if (!req.business) return res.json({ ok: false, msg: "Business not found!" })

            const user = await req.prisma.user.update({
                where: {
                    id: req?.user?.id
                },
                data: {
                    password: hashedPassword,
                }
            })

            return res.json({ ok: true, user })

        } catch (error) {
            consoleLog('tax create error', error)
            res.json({ ok: false })
        }
    },
}

module.exports = ProfileController