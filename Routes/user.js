import express from 'express'
import { signUp,signIn,userInfo,allUsers,dynamicUsers,usersLength,avtarUpload } from '../Controllers/user.js'
import auth from '../middlewares/user.js'

import multer from 'multer'

const upload = multer({ dest: 'uploads/' })
let router = express.Router()

router.post('/sign-up',signUp)
router.post('/sign-in',signIn)
router.get('/user-info',auth,userInfo)
router.get('/all-users',allUsers)
router.get('/length',usersLength)
router.get('/', dynamicUsers)
router.post('/upload-avatar',auth,upload.single('avatar'),avtarUpload)


export default router;