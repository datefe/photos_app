const { getConnection } = require("../../1-db/db");

async function getPostUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
        SELECT posts.dateCreation AS "Post Date Creation", posts.title AS "Post Title", posts.place AS "Place", images.path AS "Image Path"       
        FROM posts
        INNER JOIN images on images.post_id = posts.id
      WHERE posts.users_id=?
    `,
      [id]
    );

    res.send({
      status: "ok",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getPostUser;
