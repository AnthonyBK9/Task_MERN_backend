import jfw from "jsonwebtoken"


const generateJWT = (id) => {
    return jfw.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '7d',
    })
}

export default generateJWT