const { getConnection } = require("../../1-db/db");

const getUserById = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT users.id, users.name, COUNT(posts.id)
      FROM users INNER JOIN posts
      ON users.id = posts.users_id
      WHERE users.id = ?
      
      `,
      [id]
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

module.exports = getUserById;
