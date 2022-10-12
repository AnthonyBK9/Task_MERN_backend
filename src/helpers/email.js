import { text } from 'express';
import nodemailer from 'nodemailer'

export const emailRegister = async (data) => {
    const { email, name, token } = data
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

     //Información del email
     const info = await transport.sendMail({
        from: 'UpTask - Administrador de Proyectos <cuentas@uptask.com>', 
        to: email,
        subject: 'UpTask - Comprueba tu cuenta',
        text: 'Comprueba tu cuenta en UpTask',
        html: `
            <p>Hola ${name} Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobar en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar cuenta</a>
        </p>
        <p>Si tú no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

export const emailForgetPassword = async (data) => {
    const { email, name, token } = data
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

   
      //Información del email
      const info = await transport.sendMail({
        from: 'UpTask - Administrador de Proyectos <cuentas@uptask.com>', 
        to: email,
        subject: 'UpTask - Reestablecer tu Password',
        text: 'Reestablecer tu Password',
        html: `
            <p>Hola ${name} ha solicitado reestablecer tu paswrod</p>
        <p>Sigue el siguinte enlace para generar un nuevo passwrod:
            <a href="${process.env.FRONTEND_URL}/reestablecer-password/${token}">Reestablecer Password</a>
        </p>
        <p>Si tú solicitaste este email, puedes ignorar el mensaje</p>
        `
    })
}