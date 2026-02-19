const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const consoleLog = require('../Helpers/consoleLog');

module.exports = {

    emailSignIn: async (req, res) => {

        const { email, password } = req.body

        consoleLog('Login User ', email, password)

        try {

            const user = await req.prisma.user.findFirst({
                where: { email: email },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatar: true,
                    password: true,
                    businesses: true,
                    store: true,
                    business_role: true,
                    isPremium: true,
                }
            })

            consoleLog('Login User pass', user)

            if (user == null) return res.send({ ok: false, msg: 'Email or password was not correct.' })

            const compare = await bcrypt.compare(password, user.password)

            // consoleLog('fucking online user', compare)

            if (!compare) return res.send({ ok: false, msg: 'Email or password was not correct' })

            const tokenUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                businesses: user.businesses,
                business_role: user.business_role,
                isPremium: user.isPremium,
                store: user.store,
            }

            // console.log('User with businesses', tokenUser)

            const accessToken = jwtSignAccessToken(tokenUser, '1d')
            const refreshToken = jwtSignRefreshToken(tokenUser, '1y')

            setRefreshTokenCookie(res, refreshToken)

            return res.send({ ok: true, type: 'login', accessToken })


        } catch (error) {
            consoleLog('Login Try Catch Error', error)
            return res.status(500).send({ ok: false, msg: error })
        }

    },

    socialSignIn: async (req, res) => {

        const { email } = req.body

        try {

            const user = await req.prisma.user.findFirst({
                where: {
                    email: email
                },
                select: {
                    id: true,
                    userName: true,
                    fullName: true,
                    displayName: true,
                    email: true,
                    avatar: true,
                    // isNew: true,
                    // isActive: true,
                    // role: true
                }
            })

            if (!user) return res.send({ ok: false, msg: 'একাঊন্ট খুজে পাওয়া যায়নি' })

            if (user.isNew == true) {

                const profileUpdateToken = jwtSignUpdateToken(
                    {
                        email: user.email,
                        avatar: user.avatar,
                        redirectUrl: '/acc/initial/update_profile_information'
                    }
                )

                return res.send({ ok: true, type: 'update', profileUpdateToken })

            }

            const accessToken = jwtSignAccessToken(user, '1d')
            const refreshToken = jwtSignRefreshToken(user, '1y')

            setRefreshTokenCookie(res, refreshToken)


            // ('Response: cookie', res)

            return res.send({ ok: true, type: 'login', accessToken })

        } catch (error) {
            consoleLog('Social login error', error.message)
            return res.status(500).send({ ok: false, msg: error.message })
        }

    },

    emailSignup: async (req, res) => {

        const { email, firstName, lastName, password } = req.body
        const hashedPassword = bcrypt.hashSync(password, 12);

        try {

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
                    business_role: 'admin',
                    password: hashedPassword,
                    isNew: true,
                }
            })

            const tokenUser = {
                id: createUser.id,
                firstName: createUser.firstName,
                lastName: createUser.firstName,
                email: createUser.email,
                avatar: createUser.avatar,
                business_role: createUser.business_role,
                isPremium: createUser.isPremium,
            }

            const accessToken = jwtSignAccessToken(tokenUser, '1d')
            const refreshToken = jwtSignRefreshToken(tokenUser, '1y')

            setRefreshTokenCookie(res, refreshToken)

            return res.send({ ok: true, type: 'register', accessToken })


        } catch (error) {

            consoleLog('TryCatch Error! ', error)

            return res.status(500).send({ ok: false, msg: error.message })
        }

    },

    socialSignup: async (req, res) => {

        try {

            const { email, avatar, host } = req.body

            const hostName = host == 'google' ? 'গুগোল' : host == 'facebook' ? 'ফেসবুক' : ''

            const user = await req.prisma.user.findFirst({
                where: {
                    email: email
                }
            })

            if (user) return res.send({ ok: false, msg: `${hostName} একাউন্টটি আগে থেকে সংযুক্ত আছে।` })


            const createUser = await req.prisma.user.create({
                data: {
                    email: email,
                    avatar: avatar,
                    isNew: true
                }
            })

            const tokenUser = {
                id: createUser.id,
                userName: createUser.userName,
                fullName: createUser.fullName,
                displayName: createUser.displayName,
                email: createUser.email,
                avatar: createUser.avatar
            }

            const accessToken = jwtSignAccessToken(tokenUser, '1d')
            const refreshToken = jwtSignRefreshToken(tokenUser, '1y')

            setRefreshTokenCookie(res, refreshToken)

            return res.send({ ok: true, type: 'login', accessToken })

        } catch (error) {

            console.log('Social Signup Error! ', error)

            return res.status(500).send({ ok: false, msg: error.message })
        }
    },

    refereshToken: async (req, res) => {
        const cookies = req.cookies

        if (!cookies?.refreshToken) return res.status(401).json({ msg: 'Unauthorized!' })

        const refreshToken = cookies.refreshToken

        consoleLog('refreshToken', refreshToken)

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.status(403).json({ msg: 'Forbidden!' })

                const user = await req.prisma.user.findUnique({
                    where: {
                        email: decoded.email
                    }
                })

                if (!user) return res.status(401).json({ msg: 'Unauthorized' })


                const accessToken = jwtSignAccessToken(
                    {
                        username: user.username,
                        email: user.email,
                        fullname: user.fullname,
                        avatar: user.avatar
                    },
                    '20s'
                )


                res.json({ accessToken })
            }
        )
    },

    logout: async (req, res) => {

        try {
            if (req.user) {

                const cookies = req.cookies
                // if (!cookies?.refreshToken) return res.sendStatus(204) //No content
                res.clearCookie('refreshToken', { httpOnly: true, SameSite: 'none', secure: true })

                return res.json({ ok: true, msg: 'Cookie cleared' })

            }

        } catch (error) {
            consoleLog('Logout User error', error.message)
            res.json({ ok: false })
        }
    },

    getAuthorisedUser: async (req, res) => {

        try {
            const authUser = req?.user

            if (authUser) {

                const userData = await req.prisma.user.findUnique({

                    where: {
                        email: authUser.email
                    },

                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        createdAt: true,
                        updatedAt: true,
                        businesses: true,
                        business_role: true,
                        isPremium: true,
                        store: true
                    }
                })


                // consoleLog('get authorized user', userData)


                return res.json({ ok: true, user: userData })
            }

            return res.json({ ok: false, msg: "You are not authorised." })

        } catch (error) {

            consoleLog('get authorized user error', error.message)

            return res.json({ ok: false, msg: "You are not authorised" })

        }


    },

    check_product_author: async (req, res) => {

        const { postId } = req.body

        // consoleLog(' req.body',  req.body)
        // consoleLog('post id & author id', `${postId} & ${req?.user?.id}`)

        try {

            const post = await req.prisma.post.findFirst({
                where: {
                    id: postId,
                    authorId: req?.user?.id
                }
            })

            // consoleLog('check post author', post)


            if (!post) return res.json({ ok: false })

            return res.json({ ok: true, post })

        } catch (error) {
            consoleLog('check post author error', error.message)
            return res.json({ ok: false })
        }
    }
}

const jwtSignAccessToken = (data, exp = '1d') => {
    const token = jwt.sign(
        data,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: exp }
    );

    return token
}



const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, //accessible only by web server
        maxAge: 365 * 24 * 60 * 60 * 1000,
        secure: true,
        SameSite: 'none'
    })
}



const jwtSignRefreshToken = (data, exp = '1y') => {
    const token = jwt.sign(
        data,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: exp }
    );

    return token
}