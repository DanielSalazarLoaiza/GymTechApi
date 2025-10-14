const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No se envió token en el header" });
    }

    // Se obtiene el token enviado en el header de la petición HTTP
    let data = req.headers.authorization.split(" ");
    // Verifica que el token se envíe con Bearer
    if (data[0] === "Bearer") {
      // data[1] contiene el token enviado por el usuario
      let validarToken = jwt.verify(data[1], process.env.JWT_SECRET);

      if (validarToken) {
        // Guardar info del usuario para usar en el controlador si se necesita
        req.user = validarToken.user;
        // Continuar con la siguiente ruta
        return next();
      }
    } else {
      return res.status(401).json({
        message: "El token debe ser enviado junto a Bearer",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
};
