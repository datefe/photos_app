const { getConnection } = require("../../db/db");
const { newCommentSchema } = require("../../validators/commentValidators");

async function newComment(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let { comment } = req.body;
    let { post_id } = req.query;
    post_id = Number(post_id);

    console.log("POST:", post_id, comment);

    await newCommentSchema.validateAsync(req.body);

    const [result] = await connection.query(
      `
      INSERT INTO comments(post_id, comment, dateCreation, users_id)
      VALUES(?,?,(UTC_TIMESTAMP), ?)
      `,
      [post_id, comment, req.auth.id]
    );

    res.send({
      status: "ok",
      message: "Comentario creado. / Comment created.",
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
