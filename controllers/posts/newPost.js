const { getConnection } = require("../../db/db");
const { generateError, proccesImagesPost } = require("../../helpers");
const { newPostSchema } = require("../../validators/postValidators");

const newPost = async (req, res, next) => {
  let connection;

  const { userName, title, place } = req.query;
  const users_id = req.auth.id;

  try {
    if (req.auth.userName !== userName) {
      throw generateError("No tienes permisos para hacer ese post", 403);
    }
    connection = await getConnection();

    await newPostSchema.validateAsync(req.query);

    if (req.files && Object.keys(req.files).length > 0) {
      let i = 1;
      for (const imageData of Object.entries(req.files).slice(0, 2)) {
        try {
          console.log(imageData);
          const pathImage = await proccesImagesPost(imageData[1]);
          const [result] = await connection.query(
            `
          INSERT INTO posts (users_id, title, place, dateCreation)
          VALUES (?,?,?,(UTC_TIMESTAMP))
          
          `,
            [users_id, title, place]
          );

          const [saveImage] = await connection.query(
            `
          INSERT INTO images (post_id , path)
          VALUES (?,?)`,
            [result.insertId, pathImage]
          );
          console.log(saveImage);
        } catch (error) {
          throw generateError(
            "No se pudo procesar el post. Inténtalo de nuevo",
            400
          );
        }
        i++;
      }
    }

    res.send({
      status: "ok",
      message: "post creado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newPost;
