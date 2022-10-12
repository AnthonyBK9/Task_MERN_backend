import User from '../models/User.js'
import generateID from '../helpers/generateId.js'
import generateJWT from '../helpers/generateJWT.js'
import { emailRegister, emailForgetPassword } from '../helpers/email.js'

const registerUser = async (req, res) => {

    //Evitar usuario duplicados
    const {email} = req.body
    const userExists =  await User.findOne({email})
    if(userExists) {
        const err = new Error('Usuario ya registrado')
        return res.status(400).json({msg: err.message})
    }
    try {
        const user = new User(req.body)
        user.token = generateID()
        await user.save()

        //Enviar el email de confirmacion
        emailRegister({
            email: user.email,
            name: user.name,
            token: user.token
        })

        res.status(201).json({msg: 'Usuario creado correctamente, Revisa tu Email para confirmar tu cuenta'})
    } catch (error) {
        console.log(error)
    }
}

const authenticate = async (req, res) => {
    const {email, password} = req.body
    //Compobar si el usuario existe
    const user = await User.findOne({email})
    if(!user) {
        const err = new Error('El Usuario no existe')
        return res.status(404).json({msg: err.message})
    }
    //Comprobar si el usuairio está confirmado
    if(!user.is_confirmed) {
        const err = new Error('Tu cuenta no ha sido comfirmada')
        return res.status(403).json({msg: err.message})
    }

    //Comprobar password
    if(await user.checkPassword(password)){
        res.json({
            _id: user.id,
            name : user.name,
            email: user.email,
            token: generateJWT(user._id)
        })
    }   else {
        const err = new Error('Credenciales no válidas')
        return res.status(403).json({msg: err.message})
    }
}

const confirm = async (req, res) => {
    const { token } = req.params
    const userConfirm = await User.findOne({ token })
    if (!userConfirm) {
        const err = new Error('Token no valido')
        return res.status(403).json({msg: err.message})
    }

    try {
        userConfirm.is_confirmed = true
        userConfirm.token = ""
        await userConfirm.save()
        res.status(200).json({msg: 'Usuario confirmado Correctamente'})
    } catch (error) {
        // const err = new Error('Token no valido')
        // return res.status(403).json({msg: err.message})
        console.log(error);
    }
}

const recoverPassword = async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user) {
        const err = new Error('El Usuario no existe')
        return res.status(404).json({msg: err.message})
    }
    try {
        user.token = generateID()
        await user.save()
        //Enviar emial de recuperación del password
        emailForgetPassword({
            email: user.email,
            name: user.name,
            token: user.token
        })

        res.status(201).json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error);
    }
}

const checkToken = async (req, res) => {
    const { token } = req.params
    const tokenValid = await User.findOne({ token })
    if (tokenValid) {
        res.status(200).json({msg: 'El usuario existe Token valido'})
    } else {
        const err = new Error('Token no valido')
        return res.status(404).json({msg: err.message})
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne({ token })
    if (user) {
        user.password = password
        user.token = ""
        try {
            await user.save()
            res.status(201).json({msg: 'Passwod modificado correctamente'})
        } catch (error) {
            console.log(error);
        }
    } else {
        const err = new Error('Token no valido')
        return res.status(404).json({msg: err.message})
    }
}

const profile = async (req, res) => {
    const { user } = req
    res.json(user)
}

export {
    registerUser,
    authenticate,
    confirm,
    recoverPassword,
    checkToken,
    newPassword,
    profile
}