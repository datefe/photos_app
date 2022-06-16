const { isArray } = require("lodash");
const { getConnection } = require("../../db/db");
const { generateError, proccesImagesPost } = require("../../helpers");
const {
  newPostSchema,
  newImageSchema,
} = require("../../validators/postValidators");

const newPost = async (req, res, next) => {
  const { title, place } = req.body;

  const users_id = req.auth.id;

  let connection;
  try {
    await newPostSchema.validateAsync(req.body);

    if (!isArray(req.files.image)) {
      req.files.image = [{ ...req.files.image }];
    }

    await newImageSchema.validateAsync(req.files);
    connection = await getConnection();

    const [result] = await connection.query(
      `
      INSERT INTO posts (users_id, title, place, dateCreation)
      VALUES (?,?,?,(UTC_TIMESTAMP))
      
      `,
      [users_id, title, place]
    );

    for (const imageData of req.files.image.slice(0, 3)) {
      const pathImage = await proccesImagesPost(imageData);

      await connection.query(
        `
          INSERT INTO images (post_id , path)
          VALUES (?,?)`,
        [result.insertId, pathImage]
      );
    }

    res.send({
      status: "ok",
      message: "Post created. / Post creado.",
      postId: result.insertId,
    });
  } catch (error) {
    next(
      generateError(
        "Post could not be processed. Please try again. / No se pudo procesar el post. Inténtalo de nuevo",
        400
      )
    );
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newPost;
