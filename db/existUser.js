const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const existUser = async (userName) => {
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

    if (exist.length < 1) {
      throw generateError(
        `No hay ningun usuario con el userName:${userName}`,
        404
      );
    }

    return exist;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = existUser;
