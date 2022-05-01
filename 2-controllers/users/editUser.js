const { getConnection } = require("../../1-db/db");
const {
  generateError,
  processAndSaveImageProfile,
  deleteUpload,
} = require("../../helpers");

const { editUserSchema } = require("../../5-validators/userValidators");

const editUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    let { email, name, surname, userName, intro } = req.query;

    if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
      throw generateError("No tienes permisos para editar este usuario", 403);
    }

    const [saveData] = await connection.query(
      `
        SELECT *
        FROM users 
        WHERE id = ?
        `,
      [id]
    );

    if (!email) {
      email = saveData[0].email;
    }
    if (!name) {
      name = saveData[0].name;
    }
    if (!surname) {
      surname = saveData[0].surname;
    }
    if (!userName) {
      userName = saveData[0].userName;
    }
    if (!intro) {
      intro = saveData[0].intro;
    }

    const [result] = await connection.query(
      `
      UPDATE users
      SET  email= ?, name = ?, surname = ?, userName = ?, intro = ?
      WHERE id = ?
      `,
      [email, name, surname, userName, intro, id]
    );

    if (req.files && Object.keys(req.files).length > 0) {
      const { image } = req.files;

      try {
        const processedImage = await processAndSaveImageProfile(image);

        await connection.query(
          `
            UPDATE users
            SET  image = ?
            WHERE id = ?
            `,
          [processedImage, id]
        );
        if (saveData[0].image) {
          deleteUpload(saveData[0].image);
        }
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo",
          400
        );
      }
    }
    res.send({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
