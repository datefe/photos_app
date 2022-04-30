const { getConnection } = require("../../1-db/db");
const { generateError } = require("../../helpers");

const getUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();
    const { userName } = req.params;
    const { orderBy } = req.query;
    console.log(userName);
    const [exist] = await connection.query(
      `
      SELECT name, surname, email, image, intro
      FROM users
      WHERE userName = ? ;
      `,
      [userName]
    );

    if (exist.length < 1) {
      throw generateError(
        `No hay ningun usuario con el userName:${userName}`,
        404
      );
    }

    let [result] = await connection.query(
      `
      SELECT users.name, users.surname, users.email , users.image, users.intro, posts.title, posts.id AS postsId
      FROM users INNER JOIN posts 
      ON users.id = posts.users_id 
      WHERE users.userName = ? ;
      `,
      [userName]
    );

    console.log(result);
    if (result.length < 1) {
      result = [...exist];
      console.log(result);
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

module.exports = getUser;
