const jwt = require('jsonwebtoken')
const consoleLog = require('../Helpers/consoleLog')

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization

    // consoleLog('auth user token', authHeader)

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ msg: 'Unauthorized' })

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(401).json({ msg: 'Unauthorized' })

            const business = await req.prisma.business.findFirst({
                where: {
                    operators: {
                        some: {
                            id: decoded.id
                        }
                    },
                }
            })
            
            req.user = decoded
            req.role = decoded.role
            req.store = business
            next()
        }
    )

}

module.exports = authMiddleware