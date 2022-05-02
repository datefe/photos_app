const newUserAvailable = require("../../1-db/newUserAvailable");
const updateUserData = require("../../1-db/updateUserData");
const existUser = require("../../1-db/existUser");
const updateProfileImage = require("../../1-db/updateProfileImage");
const jsonwebtoken = require("jsonwebtoken");
const {
  generateError,
  processAndSaveImageProfile,
  deleteUpload,
} = require("../../helpers");

const { editUserSchema } = require("../../5-validators/userValidators");
const result = {};
const editUser = async (req, res, next) => {
  try {
    const { userName } = req.params;
    let { email, name, newUserName, surname, intro } = req.query;

    await editUserSchema.validateAsync(req.body);

    if (req.auth.userName !== userName && req.auth.role !== "admin") {
      throw generateError("No tienes permisos para editar este usuario", 403);
    }

    const [saveData] = await existUser(userName);

    if (!email) {
      email = saveData.email;
    }
    if (!name) {
      name = saveData.name;
    }
    if (!surname) {
      surname = saveData.surname;
    }
    if (!intro) {
      intro = saveData.intro;
    }
    if (!newUserName) {
      newUserName = userName;
    } else {
      //comprobar que el newUserName esté disponible
      await newUserAvailable(newUserName);
      const tokenInfo = {
        id: req.auth.id,
        role: req.auth.role,
        userName: newUserName,
      };

      const token = jsonwebtoken.sign(tokenInfo, process.env.SECRET, {
        expiresIn: "30d",
      });
      result.token = token;
    }
    await updateUserData(email, name, newUserName, surname, intro, userName);

    if (req.files && Object.keys(req.files).length > 0) {
      const { image } = req.files;

      try {
        console.log(image);
        const processedImage = await processAndSaveImageProfile(
          image,
          req.auth.id
        );

        await updateProfileImage(processedImage, req.auth.id);
        console.log(saveData.image, processedImage);
        if (saveData.image && saveData.image !== processedImage) {
          await deleteUpload(saveData.image);
        }
        result.profileImage = "se ha guardado la imagen correctamente";
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo",
          400
        );
      }
    }
    result.condition = "Datos actualizados correctamente";
    res.send({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUser;
