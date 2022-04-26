const { getConnection } = require("../../1-db/db");
const { generateError } = require("../../helpers");

const getUsers = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
        SELECT id,email,name,surname
        FROM users
      `
    );

    res.send({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getUsers;
