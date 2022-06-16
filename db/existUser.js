const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const existUser = async (userName) => {
  let connection;
  try {
    connection = await getConnection();

    const [exist] = await connection.query(
      `
        SELECT id, name, surname, email, image, intro, userName
        FROM users
        WHERE userName = ? ;
        `,
      [userName]
    );

    if (exist.length < 1) {
      throw generateError(
        `There is no user with username / No hay ningun usuario con el nombre:${userName}`,
        404
      );
    }

    return exist;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = existUser;
