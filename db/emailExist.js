const { getConnection } = require("./db");

const emailExist = async (email) => {
  let connection;
  try {
    connection = await getConnection();

    const [exist] = await connection.query(
      `
        SELECT id, name, surname, email, image, intro
        FROM users
        WHERE email = ? ;
        `,
      [email]
    );

    if (exist.length < 1) {
      return false;
    }

    return true;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = emailExist;
