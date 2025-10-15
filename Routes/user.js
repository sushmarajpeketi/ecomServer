import express from 'express'
import { signUp,signIn,userInfo } from '../Controllers/user.js'
import userAuth from '../middlewares/user.js'
let router = express.Router()

router.post('/sign-up',signUp)
router.post('/sign-in',signIn)
router.get('/user-info',userAuth,userInfo)


export default router;