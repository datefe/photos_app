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
      INNER JOIN likes ON posts.id =  likes.post_id
      WHERE posts.users_id = ?
      GROUP BY images.id 
    `,
      [id]
    );

    if (list.length < 1) {
      return false;
    }

    const joinedResults = list.reduce((acc, current) => {
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

    console.log(joinedResults);

    return joinedResults;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = postList;
