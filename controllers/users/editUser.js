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
      throw generateError(
        "You have no permissions to edit this user. / No tienes permisos para editar este usuario.",
        403
      );
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
        result.profileImage =
          "Image has been correctly saved. / La imagen se ha guardado correctamente.";
      } catch (error) {
        throw generateError(
          "Image could not be processed. Please try again. / No se pudo procesar la imagen. Inténtalo de nuevo.",
          400
        );
      }
    }
    result.condition =
      "Data correctly updated. / Datos actualizados correctamente.";
    res.send({
      status: "ok",
      message: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = editUser;
