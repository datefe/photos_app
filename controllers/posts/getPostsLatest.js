const { getConnection } = require("../../db/db");

async function getPostsLatest(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { search, order, direction } = req.query;

    // Proceso la dirección de orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "ASC" : "DESC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
      case "title":
        orderBy = "title";
        break;
      case "place":
        orderBy = "place";
        break;
      default:
        orderBy = "dateCreation";
    }

    // Ejecuto la query en base a si existe querystring de search o no
    let queryResults;
    if (search) {
      queryResults = await connection.query(
        `
        SELECT posts.dateCreation, posts.id AS postId, posts.place, posts.title, images.id AS imageId,
        images.path AS "image", images.post_id AS imagePostId, COUNT(likes.id) AS likesCount
        FROM posts
        INNER JOIN images ON posts.id =  images.post_id
        LEFT JOIN likes ON posts.id =  likes.post_id
        WHERE posts.place LIKE ? OR posts.title LIKE ?
        GROUP BY images.id 
        ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${search}%`, `%${search}%`]
      );
    } else {
      queryResults = await connection.query(
        `
        SELECT posts.dateCreation, posts.id AS postId, posts.place, posts.title,
        users.userName , users.image AS userAvatar, images.id AS imageId, images.path AS "image",
        images.post_id AS imagePostId,likes.id AS likeId, likes.users_id AS userLikedIt
        FROM posts
        INNER JOIN users ON posts.users_id = users.id
        INNER JOIN images ON posts.id =  images.post_id
        LEFT JOIN likes ON images.post_id =  likes.post_id
        
       
        ORDER BY ${orderBy} ${orderDirection}
        `
      );
    }

    // Extraigo los resultados reales del resultado de la query
    const [result] = queryResults;

    let joinedResults = result.reduce((acc, current) => {
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

    // Mando la respuesta
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

module.exports = getPostsLatest;
