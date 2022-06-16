const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const newUserAvailable = async (userName) => {
  let connection;
  try {
    connection = await getConnection();

    const [exist] = await connection.query(
      `
        SELECT id, name, surname, email, image, intro
        FROM users
        WHERE userName = ? ;
        `,
      [userName]
    );

    if (exist.length > 0) {
      throw generateError(
        `The new username'${userName}' already exists, please try with a new one. / El nuevo nombre de usuario '${userName}' ya está ocupado, prueba con otro.`,
        404
      );
    }

    return exist;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUserAvailable;
