import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/db.js'
import { generarTokenCorreo } from './helpers/generarTokens.js'
import usuarioRoute from './routes/usuarioRoutes.js'

const app = express()

app.use(express.json())

dotenv.config()
//conectar db
try {
    await db.authenticate();
    db.sync();
    console.log('Conexion a la base de datos exitosa.')
} catch (error) {
    console.log(error);
}

const corsOptions = {
    origin: "*"
} 

app.use(cors(corsOptions))

//rutas
app.use('/api/usuarios',usuarioRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Proyecto ... Port ${process.env.PORT}`)
    console.log(generarTokenCorreo())
})
