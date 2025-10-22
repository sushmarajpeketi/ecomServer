import express from 'express'
import { signUp,signIn,userInfo,allUsers,dynamicUsers,usersLength } from '../Controllers/user.js'
import auth from '../middlewares/user.js'
let router = express.Router()

router.post('/sign-up',signUp)
router.post('/sign-in',signIn)
router.get('/user-info',auth,userInfo)
router.get('/all-users',allUsers)
router.get('/length',usersLength)
router.get(`/dynamic-users/:page/:rows`,dynamicUsers)


export default router;