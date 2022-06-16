const { getConnection } = require("../../db/db");

async function getPostById(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT posts.dateCreation, posts.id AS postId, posts.place, posts.title, users.userName ,
      users.image AS userAvatar, images.id AS imageId, images.path AS image, images.post_id AS imagePostId,
      likes.id AS likeId, likes.users_id AS userLikedIt
      FROM posts
      INNER JOIN users ON posts.users_id = users.id
      INNER JOIN images ON posts.id =  images.post_id
      LEFT JOIN likes ON images.post_id =  likes.post_id
      WHERE posts.id= ?
      
    `,
      [id]
    );

    let [joinedResults] = result.reduce((acc, current) => {
      const existingPost = acc.find((item) => item.postId === current.postId);
      const existingImage = acc.find((item) => {
        const imgExist = item.image.find((img) => img.id === current.imageId);
        return imgExist;
      });
      const existingLike = acc.find((item) => {
        const likeExist = item.likes.find((like) => like.id === current.likeId);
        return likeExist;
      });

      if (!existingPost) {
        acc.push({
          ...current,
          image: [{ path: current["image"], id: current["imageId"] }],
          likes: [
            { id: current["likeId"], userLikedIt: current["userLikedIt"] },
          ],
        });
      } else {
        if (!existingImage) {
          existingPost["image"].push({
            path: current["image"],
            id: current["imageId"],
          });
        }
        if (!existingLike) {
          existingPost["likes"].push({
            id: current["likeId"],
            userLikedIt: current["userLikedIt"],
          });
        }
      }

      return acc;
    }, []);
    console.log("results", joinedResults);

    // Getting images from the post / Imagenes asociadas al post

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
