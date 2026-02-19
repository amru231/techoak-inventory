const consoleLog = require("../Helpers/consoleLog")
var randomId = require('random-id');
const bcrypt = require('bcryptjs');
const mailer = require("../Helpers/mailer");

const userController = {

    create: async (req, res) => {

        const { email, firstName, lastName, password } = req.body


        const hashedPassword = bcrypt.hashSync(password, 12);
        consoleLog('Hashed password', hashedPassword)


        try {

            const businessId = req?.store?.id
            const userId = req?.user?.id
            if (!businessId) return res.json({ ok: false, msg: 'Business not found' })


            const user = await req.prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            if (user) return res.send({ ok: false, msg: 'Sorry! the email is already used.' })

            const createUser = await req.prisma.user.create({
                data: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    storeId: businessId,
                    business_role: 'sales',
                    password: hashedPassword,
                    isNew: true,
                }
            })


            let info = await mailer.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "bar@example.com, baz@example.com", // list of receivers
                subject: "Hello ✔", // Subject line
                template: 'staffCreated',
                context: {
                    name: firstName + ' ' + lastName,
                    email: email,
                    password: password
                }
            });


            consoleLog("Message sent: %s", info.messageId);
            consoleLog('created staff', createUser)

            return res.send({ ok: true })


        } catch (error) {

            consoleLog('TryCatch Error! ', error)

            return res.status(500).send({ ok: false, msg: error.message })
        }

    },

    getUsers: async (req, res) => {
        try {


            const businessId = req?.store?.id
            const userId = req?.user?.id
            if (!businessId) return res.json({ ok: false, msg: 'Business not found' })

            const users = await req.prisma.user.findMany({
                where: {
                    id: {
                        not: userId
                    },
                    storeId: businessId,
                },
                include:{
                    invoices: true,
                    sales: true
                }
            })

            // consoleLog('Business users', users)

            return res.json({ ok: true, users })

        } catch (error) {
            consoleLog('get users error', error)
            res.json({ ok: false })
        }
    },


    deleteUsers: async (req, res) => {
        try {

            const { id } = req.body

            const businessId = req?.store?.id
            if (!businessId) return res.json({ ok: false })


            const tax = await req.prisma.tax.findFirst({
                where: {
                    id: id,
                    businessId: businessId
                },
                // include: {

                // }
            })



            // consoleLog('Delete Category', category)

            const deleteTax = await req.prisma.tax.delete({
                where: {
                    id: tax.id
                }
            })

            res.json({ ok: true })

        } catch (error) {
            consoleLog('Tax Delete Error', error)
            res.json({ ok: false })
        }
    }
}

module.exports = userController