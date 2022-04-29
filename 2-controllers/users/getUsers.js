const { use } = require("bcrypt/promises");
const { getConnection } = require("../../1-db/db");
const { generateError } = require("../../helpers");

const getUsers = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();
    const { userName, orderBy } = req.query;
    console.log(userName);
    const [result] = await connection.query(
      `
      SELECT users.id, users.name, users.surname, users.email , posts.title, posts.id AS postsId
      FROM users INNER JOIN posts 
      ON users.id = posts.users_id 
      WHERE users.userName = ? ;
      `,
      [userName]
    );
    console.log(result.length);
    if (result.length < 1) {
      throw generateError(
        `No hay ningun usuario con el userName:${userName}`,
        404
      );
    }

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
