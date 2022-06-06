const { getConnection } = require("../../db/db");

const getMessages = async (req, res, next) => {
  let connection;

  try {
    const { postId } = req.params;
    console.log(postId);
    connection = await getConnection();
    const [messages] = await connection.query(
      `
      SELECT comments.id, comments.comment, users.name AS userName, users.surname AS userSurname, users.image AS avatar
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
