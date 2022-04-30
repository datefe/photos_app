const { getConnection } = require("../../1-db/db");
const { generateError } = require("../../helpers");

const postId = 10;
const getImageByPost = async (postId) => {
  let connection;

  try {
    connection = await getConnection();

    const [response] = await connection.query(
      `
      SELECT path 
      FROM images
      WHERE post_id = ? ;
      `,
      [postId]
    );
    if (connection) connection.release();
    if (response.length < 1) {
      return "No hay imagenes relacionadas al post";
    } else {
      console.log(response);
      return response;
    }
  } catch (error) {
    return error;
  }
};
getImageByPost(postId);
module.exports = getImageByPost;
