const { randomString, generateError } = require("../../helpers");
const { newUserSchema } = require("../../validators/userValidators");
const emailExist = require("../../db/emailExist");
const insertIntoUsers = require("../../db/insertIntoUsers");

const newUser = async (req, res, next) => {
  try {
    const { email, password, userName } = req.body;
    await newUserSchema.validateAsync(req.body);

    const resultEmailExist = await emailExist(email);

    if (resultEmailExist) {
      throw generateError(
        "User with this email address already exists in the database. / Ya existe un usuario en la base de datos con ese correo electrónico.",
        409
      );
    }

    const registrationCode = randomString(40);

    await insertIntoUsers(email, password, registrationCode, userName);

    res.send({
      status: "ok",
      message: "User registered. / Usuario registrado.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = newUser;
