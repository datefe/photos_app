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
});

module.exports = {
  newPostSchema,
};
