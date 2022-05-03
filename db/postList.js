const { getConnection } = require("./db");

const postList = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [list] = await connection.query(
      `
    SELECT id, dateCreation, title, place
    FROM posts 
    WHERE users_id = ?;
    `,
      [id]
    );

    if (list.length < 1) {
      return false;
    }

    return list;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postList;
