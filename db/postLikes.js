const { getConnection } = require("./db");

const postLikes = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [list] = await connection.query(
      `
      SELECT likes.id, users.name, users.surname, users.image
      FROM likes
      INNER JOIN users ON likes.users_id = users.id
      WHERE likes.post_id = ?
      ORDER BY likes.dateCreation
    `,
      [id]
    );

    return list;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postLikes;
