import correoVerificacion from "../helpers/correoVerificacion.js";
import { generarJWT, generarTokenCorreo } from "../helpers/generarTokens.js";
import Usuario from "../models/usuarioModel.js";
import bcrypt from "bcrypt";

const registrarUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;
  if ([nombre, email, password].includes("")) {
    return res.json({
      status: false,
      msg: "Todos los campos son obligatorios",
    });
  }
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario) {
      return res.json({ status: false, msg: "Usuario ya existente" });
    }
    const newUsuario = await Usuario.create({
      nombre,
      email,
      password: await bcrypt.hash(password, 10),
      token: generarTokenCorreo(),
      confirmado: false,
    });

    await newUsuario.save();
    correoVerificacion(newUsuario.nombre, newUsuario.token, newUsuario.email);
    res.status(200).json({ status: true, msg: "Confirma tu cuenta, verifica tu bandeja de entrada." });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res
      .status(500)
      .json({ status: false, msg: "Error interno del servidor" });
  }
};

const confirmarCuentaUsuario = async (req, res) => {
  const { token } = req.params;
  try {
    const usuario = await Usuario.findOne({ where: { token } });
    if (!usuario) {
      return res.json({ status: false, msg: "Token invalido." });
    }
    usuario.token = "";
    usuario.confirmado = !usuario.confirmado;
    await usuario.save();
    return res.json({ status: true, msg: "Cuenta confirmada." });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, msg: "Error interno del servidor" });
  }
};

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].includes("")) {
    return res.json({
      status: false,
      msg: "Todos los campos son obligatorios.",
    });
  }
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.json({ status: false, msg: "Usuario o contraseña incorrecta." });
  }
  if (!usuario?.confirmado) {
    return res.json({
      status: false,
      msg: "Primero debes confirmar tu cuenta.",
    });
  }
  const verificarPass = await bcrypt.compare(password, usuario.password);

  if (!verificarPass) {
    return res.json({ status: false, msg: "Usuario o contraseña incorrecta." });
  }

  const jwt = generarJWT(usuario.id, usuario.nombre, usuario.email);
  return res.json({
    status: true,
    msg: "Sesión iniciada.",
    jwt,
  });
};

const perfil = async (req, res) => { 
  res.json(req.usuario);
};

export { registrarUsuario, confirmarCuentaUsuario, iniciarSesion, perfil };
