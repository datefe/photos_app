const { getConnection } = require("../../1-db/db");

async function getPostById(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT posts.*, COUNT(likes.post_id) AS PostLikes
      FROM posts
      LEFT JOIN likes
      ON likes.post_id = posts.id
      WHERE posts.id=?
    `,
      [id]
    );

    // Getting images from the post / Imagenes asociadas al post

    const [images] = await connection.query(
      `
      SELECT id, path
      FROM images
      WHERE post_id = ?
    `,
      [id]
    );

    console.log(images);

    res.send({
      status: "ok",
      data: {
        ...result[0],
        images,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getPostById;
