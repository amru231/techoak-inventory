const { Router } = require("express")
const router = Router()
// const { getUsers } = require('../app/controllers/UsersController');
const adminAuthMiddleware = require('../app/middlewares/adminAuthMiddleware');
const authMiddleware = require('../app/middlewares/authMiddleware');
const { emailSignIn, emailSignup, socialSignIn, socialSignup, refereshToken, logout, getAuthorisedUser, check_product_author } = require('../app/controllers/AuthController');

// router.get('/', getUsers);
router.post('/signIn', emailSignIn);
router.post('/signUp', emailSignup);

//Social Auth
router.post('/social_signin', socialSignIn)
router.post('/social_signup', socialSignup)

//Refresh token
router.post('/refresh', refereshToken)

//Logout user
router.post('/logout', authMiddleware, logout)

router.get('/get_authorised_user',authMiddleware, getAuthorisedUser)

router.post('/check_product_author',authMiddleware, check_product_author)

const authRoutes = router
module.exports = authRoutes