const { getConnection } = require("../../1-db/db");
const { randomString, generateError } = require("../../helpers");

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const { email, password } = req.body;

    const [existingUser] = await connection.query(
      `
            SELECT id
            FROM users
            WHERE email=?
        `,
      [email]
    );

    if (existingUser.length > 0) {
      throw generateError(
        "Ya existe un usuario en la base de datos con ese email",
        409
      );
    }

    const registrationCode = randomString(40);

    await connection.query(
      `
            INSERT INTO users(dateCreation, email, password, registrationCode )
            VALUES(UTC_TIMESTAMP, ?, SHA2(?, 512), ?)
        `,
      [email, password, registrationCode]
    );

    res.send({
      status: "ok",
      message: "Usuario registrado.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
