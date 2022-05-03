const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validations / Validaciones

const newPostSchema = Joi.object().keys({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .error(
      generateError(
        "Titulo debe existir y tener al menos un caracter / Title must exist and have at least one character",
        400
      )
    ),
  place: Joi.string().max(50),
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

module.exports = {
  newPostSchema,
};
