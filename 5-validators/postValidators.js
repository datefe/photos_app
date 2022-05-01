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

// const editPostSchema = Joi.object().keys({
//   title: Joi.string()
//     .min(1)
//     .max(100)
//     .required()
//     .error(
//       generateError(
//         "Titulo debe existir y tener al menos un caracter / Title must exist and have at least one character",
//         400
//       )
//     ),
//   place: Joi.string().max(50),
//   dateCreation: Joi.string()
//     .required()
//     .error(
//       generateError(
//         "El campo de fecha debe existir / Date field cannot be null",
//         400
//       )
//     ),
// });

module.exports = {
  newPostSchema,
};
