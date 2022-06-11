const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Validations / Validaciones

const newCommentSchema = Joi.object().keys({
  comment: Joi.string()
    .min(1)
    .max(200)
    .required()
    .error(
      generateError(
        "Comentario debe existir y tener al menos un caracter / Comment must exist and have at least one character",
        400
      )
    ),
  post_id: Joi.number()
    .min(1)
    .error(generateError("Valor minimo es 1 / Minimum value is 1", 400)),
});

module.exports = {
  newCommentSchema,
};
