const { getConnection } = require("./db");

const postList = async (id) => {
  let connection;
  try {
    connection = await getConnection();

    const [list] = await connection.query(
      `
      SELECT posts.dateCreation, posts.id AS postId, posts.place, posts.title, images.id AS imageId, images.path AS "image", images.post_id AS imagePostId, COUNT(likes.id) AS likesCount
      FROM posts
      INNER JOIN images ON posts.id =  images.post_id
      LEFT JOIN likes ON images.post_id =  likes.post_id
      
      
      WHERE posts.users_id = ?
       GROUP BY images.id 
      ORDER BY posts.dateCreation
     
      
    `,
      [id]
    );

    let joinedResults = list.reduce((acc, current) => {
      const existingPost = acc.find((item) => item.postId === current.postId);

      if (!existingPost) {
        acc.push({
          ...current,
          image: [{ path: current["image"], id: current["imageId"] }],
        });
      } else {
        existingPost["image"].push({
          path: current["image"],
          id: current["imageId"],
        });
      }

      return acc;
    }, []);

    console.log("--->", joinedResults);

    return joinedResults;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postList;
