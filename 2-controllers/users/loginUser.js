const { getConnection } = require("../../1-db/db");
const jsonwebtoken = require("jsonwebtoken");

const { generateError } = require("../../helpers");

async function loginUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { email, password } = req.body;

    // Seleccionar el usuario de la base de datos y comprobar que las passwords coinciden
    const [dbUser] = await connection.query(
      `
      SELECT id, role, active
      FROM users
      WHERE email=? AND password=SHA2(?, 512)
    `,
      [email, password]
    );

    if (dbUser.length === 0) {
      throw generateError(
        "No hay ningún usuario registrado con ese email o la password es incorrecta",
        401
      );
    }
    console.log(email);
    const prueba = await connection.query(
      `
      UPDATE users
      SET dateLastLogIn = (UTC_TIMESTAMP)
      WHERE email = ?
         `,
      [email]
    );

    // Generar token con información del usuario
    const tokenInfo = {
      id: dbUser[0].id,
      role: dbUser[0].role,
    };

    const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });

    // Devolver el token
    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
