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
  place: Joi.string()
    .max(50)
    .error(
      generateError(
        "Place debe existir y tener maximo 50 caracteres / Title must exist and have at least one character",
        400
      )
    ),
});

const newImageSchema = Joi.object().keys({
  image: Joi.array()
    .min(0)
    .max(3)
    .required()
    .error(
      generateError(
        "La cantidad de imagenes debe de ser entre 1 y 3 / The number of images must be between 1 and 3",
        400
      )
    ),
});
module.exports = {
  newPostSchema,
  newImageSchema,
};
