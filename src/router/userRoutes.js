import express  from "express"
import {  registerUser, authenticate, confirm, recoverPassword, checkToken, newPassword, profile } from '../controllers/userControllers.js'
import cheackAuth from "../middleware/cheackAuth.js"

const router = express.Router()

//Autenticación, Registro  y Confirmación de usuarios
router.post('/', registerUser)
router.post('/login', authenticate)
router.get('/confirm/:token', confirm)
router.post('/reestablecer-password', recoverPassword)

router.route('/reestablecer-password/:token')
    .get(checkToken)
    .post(newPassword)

router.get('/perfil', cheackAuth, profile)

export default router