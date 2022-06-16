const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const existPost = async (postId) => {
  let connection;
  try {
    connection = await getConnection();

    const [exist] = await connection.query(
      `
        SELECT *
        FROM posts
        WHERE id = ? ;
        `,
      [postId]
    );

    if (exist.length < 1) {
      throw generateError(
        `There is no post with id / No hay ningún post con el id:${postId}`,
        404
      );
    }

    return true;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = existPost;
