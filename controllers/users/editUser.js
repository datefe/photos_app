const newUserAvailable = require("../../db/newUserAvailable");
const updateUserData = require("../../db/updateUserData");
const existUser = require("../../db/existUser");
const updateProfileImage = require("../../db/updateProfileImage");
const updateLastLogin = require("../../db/updateLastLogin");
const jsonwebtoken = require("jsonwebtoken");
const {
  generateError,
  processAndSaveImageProfile,
  deleteUpload,
} = require("../../helpers");

const { editUserSchema } = require("../../validators/userValidators");

const result = {};
const editUser = async (req, res, next) => {
  try {
    const { userName } = req.params;

    let { email, name, newUserName, surname, intro } = req.body;
    await editUserSchema.validateAsync(req.query);

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
      updateLastLogin;
    }

    await updateUserData(email, name, newUserName, surname, intro, userName);

    if (req.files && Object.keys(req.files).length > 0) {
      const { image } = req.files;

      try {
        const processedImage = await processAndSaveImageProfile(
          image,
          req.auth.id
        );

        await updateProfileImage(processedImage, req.auth.id);

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
