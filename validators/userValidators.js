const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validations / Validaciones

const newUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError(
        "Please add a valid email address. / Por favor introduce una dirección de correo válida.",
        400
      )
    ),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "Password must have at least 8 characters. / La contraseña debe tener al menos 8 caracteres.",
        400
      )
    ),
  userName: Joi.string()
    .max(25)
    .required()
    .error(
      generateError(
        "The userName field can't have more than 25 characters and must have a value. / El campo nombre de usuario no puede tener más de 25 caracteres y es obligatorio.",
        400
      )
    ),
});

const loginUserSchema = newUserSchema;

const editUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .error(
      generateError(
        "Please introduce a valid email address. / Dirección de correo no valida.",
        400
      )
    ),
  userName: Joi.string()
    .max(25)

    .error(
      generateError(
        "The userName field can't have more than 25 characters and must have a value. / El campo nombre de usuario no puede tener más de 25 caracteres y es obligatorio.",
        400
      )
    ),
  name: Joi.string()
    .max(20)
    .error(
      generateError(
        "The name field can't have more than 20 characters. / El campo nombre no puede tener más de 20 caracteres.",
        400
      )
    ),
});

module.exports = {
  newUserSchema,
  loginUserSchema,
  editUserSchema,
};
