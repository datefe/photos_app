const { getConnection } = require("./db");
const { generateError } = require("../helpers");

const updateProfileImage = async (processedImage, id) => {
  let connection;
  try {
    connection = await getConnection();

    const update = await connection.query(
      `
          UPDATE users
          SET  image = ?
          WHERE id = ?
          `,
      [processedImage, id]
    );
    return update;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateProfileImage;
