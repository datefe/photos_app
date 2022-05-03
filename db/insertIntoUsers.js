const { getConnection } = require("./db");

const insertIntoUsers = async (email, password, registrationCode, userName) => {
  let connection;
  try {
    connection = await getConnection();

    await connection.query(
      `
              INSERT INTO users(dateCreation, email, password, registrationCode, userName )
              VALUES(UTC_TIMESTAMP, ?, SHA2(?, 512), ?, ?)
          `,
      [email, password, registrationCode, userName]
    );

    return true;
  } finally {
    if (connection) connection.release();
  }
};
module.exports = insertIntoUsers;
