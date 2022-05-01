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
        `El nuevo nombre de usuario '${userName}' ya esta ocupado, pruebe con otro`,
        404
      );
    }

    return exist;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUserAvailable;
