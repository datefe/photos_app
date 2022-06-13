const { getConnection } = require("../../db/db");

const getMessages = async (req, res, next) => {
  let connection;

  try {
    const { postId } = req.params;

    connection = await getConnection();
    const [messages] = await connection.query(
      `
      SELECT comments.id, comments.comment, users.name , users.surname , users.image AS avatar, users.userName
      FROM comments 
      INNER JOIN users ON comments.users_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.dateCreation
      `,
      [postId]
    );

    res.send({
      status: "ok",
      data: messages,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getMessages;
