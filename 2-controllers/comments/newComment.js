const { getConnection } = require("../../1-db/db");
const { newCommentSchema } = require("../../5-validators/postValidators");

async function newComment(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    await newCommentSchema.validateAsync(req.body);

    const { post_id, comment } = req.body;

    const [result] = await connection.query(
      `
      INSERT INTO comments(post_id, comment, dateCreation, user_id)
      VALUES(?,?,UTC_TIMESTAMP, ?)
      `,
      [post_id, comment, req.auth.id]
    );

    res.send({
      status: "ok",
      message: "Comentario creado / Comment created",
      data: {
        id: result.id,
        post_id,
        comment,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newComment;