const { getConnection } = require("./db");

const postImage = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [list] = await connection.query(
      `
    SELECT id, path
    FROM images 
    WHERE post_id = ?;
    `,
      [id]
    );

    if (list.length < 1) {
      return "no hay imagenes ligadas al post";
    }

    return list;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postImage;
