const { getConnection } = require("./db");

const postList = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [list] = await connection.query(
      `
      SELECT posts.dateCreation, posts.id AS postId, posts.place, posts.title, images.id AS imageId,
      images.path AS "image", images.post_id AS imagePostId, likes.id AS likeId, likes.users_id AS userLikedIt

      FROM posts
      INNER JOIN images ON posts.id =  images.post_id
      LEFT JOIN likes ON images.post_id =  likes.post_id
      
      
      WHERE posts.users_id = ?
      ORDER BY posts.dateCreation DESC
     
      
    `,
      [id]
    );

    let joinedResults = list.reduce((acc, current) => {
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

    return joinedResults;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postList;
