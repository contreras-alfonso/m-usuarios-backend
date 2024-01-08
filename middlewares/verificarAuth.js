import jwt from "jsonwebtoken";
import Usuario from "../models/usuarioModel.js";

const verificarAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = await Usuario.findOne({
        where: { id: decoded.id },
        attributes: { exclude: ["password", "confirmado", "token", "createdAt", "updatedAt"] },
      });

      console.log(req.usuario);

      next();
    } catch (error) {
      console.log(error);
      return res.json({ status: false, msg: "Token no válido(?)" });
    }
  }

  if (!token) {
    res.json({ status: false, msg: "Token no válido" });
    return;
  }
};

export default verificarAuth;
