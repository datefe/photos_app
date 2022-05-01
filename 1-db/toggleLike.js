const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const likeExist = async (userId, postId) => {
  let connection;
  try {
    connection = await getConnection();
    console.log(userId);
    const [exist] = await connection.query(
      `
        SELECT id
        FROM likes
        WHERE users_id = ? AND post_id = ? ;
        `,
      [userId, postId]
    );
    console.log(exist);
    if (exist.length < 1) {
      const [exist] = await connection.query(
        `
              INSERT INTO likes (post_id,users_id, dateCreation)
              VALUES (?,?,(UTC_TIMESTAMP));
              `,
        [postId, userId]
      );
      return "Se ha incluido el like a la base de datos";
    } else {
      const [exist] = await connection.query(
        `
                  DELETE
                  FROM likes
                  WHERE users_id = ? AND post_id = ?
                  `,
        [userId, postId]
      );
      return "Se ha eliminado el like de la base de datos";
    }
  } finally {
    if (connection) connection.release();
  }
};

module.exports = likeExist;
