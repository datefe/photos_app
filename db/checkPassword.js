const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const checkPassword = async (email, password) => {
  let connection;
  try {
    connection = await getConnection();

    const [dbUser] = await connection.query(
      `
        SELECT id, role, userName
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

    return dbUser;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = checkPassword;
