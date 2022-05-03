const { getConnection } = require("./db");

const postLikes = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [list] = await connection.query(
      `
    SELECT COUNT(*) AS likes
    FROM likes 
    WHERE post_id = ?;
    `,
      [id]
    );
    console.log(list);
    return list;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postLikes;
