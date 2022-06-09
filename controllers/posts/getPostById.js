const { getConnection } = require("../../db/db");

async function getPostById(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT posts.dateCreation, posts.id AS postId, posts.place, posts.title, users.userName , users.image AS userAvatar, images.id AS imageId, images.path AS image, images.post_id AS imagePostId, COUNT(likes.id) AS likesCount
      FROM posts
      INNER JOIN users ON posts.users_id = users.id
      INNER JOIN images ON posts.id =  images.post_id
      LEFT JOIN likes ON images.post_id =  likes.post_id
      WHERE posts.id= ?
      GROUP BY images.id;
    `,
      [id]
    );

    const [joinedResults] = result.reduce((acc, current) => {
      const existingItem = acc.find((item) => item.postId === current.postId);

      if (!existingItem) {
        acc.push({
          ...current,
          image: [{ path: current["image"], id: current["imageId"] }],
        });
      } else {
        existingItem["image"].push({
          path: current["image"],
          id: current["imageId"],
        });
      }

      return acc;
    }, []);

    // Getting images from the post / Imagenes asociadas al post
    console.log(joinedResults);
    res.send({
      status: "ok",
      data: joinedResults,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getPostById;
