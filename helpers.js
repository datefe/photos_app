const { format } = require("date-fns");
const crypto = require("crypto");
const fs = require("fs").promises;
const sharp = require("sharp");
const path = require("path");

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_PROFILE);

function formatDateToDB(date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}

function randomString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

async function deleteUpload(uploadedImage) {
  await fs.unlink(path.join(imageUploadPath, uploadedImage));
}

function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

async function processAndSaveImageProfile(uploadedImage) {
  try {
    const isDir = await fs.lstat(imageUploadPath);
    isDir.isDirectory();
  } catch (error) {
    await fs.mkdir(imageUploadPath, { recursive: true });
    console.error("Creada carpeta de almacenamiento de imagenes de perfil");
  }

  const image = sharp(uploadedImage.data);
  const imageInfo = await image.metadata();

  if (imageInfo.width > 300) {
    image.resize(300);
  }

  const imageFileName = uploadedImage.name;
  await image.toFile(path.join(imageUploadPath, imageFileName));

  return imageFileName;
}

module.exports = {
  formatDateToDB,
  generateError,
  randomString,
  deleteUpload,
  processAndSaveImageProfile,
};
