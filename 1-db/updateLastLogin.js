const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const updateLastLogin = async (email) => {
  let connection;
  try {
    connection = await getConnection();

    const date = await connection.query(
      `
        UPDATE users
        SET dateLastLogIn = (UTC_TIMESTAMP)
        WHERE email = ?
           `,
      [email]
    );

    return true;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateLastLogin;
