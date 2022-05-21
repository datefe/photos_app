const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validations / Validaciones

const newUserSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .error(
      generateError(
        "Por favor introduce una dirección de correo válida / Please add a valid email address",
        400
      )
    ),
  password: Joi.string()
    .min(8)
    .required()
    .error(
      generateError(
        "La contraseña debe tener al menos 8 caracteres / Password must have at least 8 characters",
        400
      )
    ),
  userName: Joi.string()
    .max(25)
    .required()
    .error(
      generateError(
        "El campo nombre de usuario no puede tener más de 25 caracteres y es obligatorio / The userName field can't have more than 25 characters and must have a value",
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
        "Dirección de correo no valida / Please introduce a valid email address",
        400
      )
    ),
  userName: Joi.string()
    .max(25)

    .error(
      generateError(
        "El campo nombre de usuario no puede tener más de 25 caracteres y es obligatorio / The userName field can't have more than 25 characters and must have a value",
        400
      )
    ),
  name: Joi.string()
    .max(20)
    .error(
      generateError(
        "El campo nombre no puede tener más de 20 caracteres / The name field can't have more than 20 characters",
        400
      )
    ),
});

module.exports = {
  newUserSchema,
  loginUserSchema,
  editUserSchema,
};
