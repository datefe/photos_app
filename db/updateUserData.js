const { getConnection } = require("./db");

const updateUser = async (
  email,
  name,
  newUserName,
  surname,
  intro,
  userName
) => {
  let connection;
  try {
    connection = await getConnection();

    const [update] = await connection.query(
      `
        UPDATE users
        SET  email= ?, name = ?, surname = ?, userName = ?, intro = ?
        WHERE userName = ?
        `,
      [email, name, surname, newUserName, intro, userName]
    );

    return update;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUser;
