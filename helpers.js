const { format } = require("date-fns");
const crypto = require("crypto");

function formatDateToDB(date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}

function randomString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

module.exports = { formatDateToDB, generateError, randomString };
