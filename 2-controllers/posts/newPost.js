const { getConnection } = require("../../1-db/db");
const { generateError } = require("../../helpers");

const newPost = async (user_id, title, place = "") => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
    INSERT INTO POSTS (user_id, title, place)
    VALUES (?,?,?)
    
    `,
      [user_id, title, place]
    );

    return.result.insertId;

    // if (!title || title.length > 100) {
    //   throw generateError(
    //     "Title cannot exceed 100 characters / El título no puede exceder los 100 caracteres"
    //   );
    // }

    res.send({
      status: "error",
      message: "Not ready yet",
    });
  } catch (error) {
    next(error);
  }

  finally {
    if (connection) connection.release();
  }

};

module.exports = newPost;
