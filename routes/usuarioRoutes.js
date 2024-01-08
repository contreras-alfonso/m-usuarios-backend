import express from 'express'
import { confirmarCuentaUsuario, iniciarSesion, perfil, registrarUsuario } from '../controllers/usuarioController.js';
import verificarAuth from '../middlewares/verificarAuth.js';

const router = express.Router();

router.post('/registro',registrarUsuario);
router.get('/verificar-token/:token',confirmarCuentaUsuario);
router.post('/login',iniciarSesion);
router.get('/perfil',verificarAuth,perfil)


export default router