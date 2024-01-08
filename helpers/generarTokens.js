import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';

const generarTokenCorreo = () => {
    return uuidv4();
}
const generarJWT = (id,nombre,email) => {
    return jwt.sign({id,nombre,email}, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export {
    generarJWT,
    generarTokenCorreo,
}