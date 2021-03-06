const { format } = require("date-fns");
const crypto = require("crypto");
const fs = require("fs").promises;
const uuid = require("uuid");
const sharp = require("sharp");
const path = require("path");

const imageUploadPath = path.join(process.env.UPLOADS_PROFILE);
const imagePathPost = path.join(process.env.UPLOADS_POST);

function formatDateToDB(date) {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ss");
}

function randomString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

async function deleteUpload(uploadedImage) {
  await fs.unlink(path.join(uploadedImage));
}

function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

async function processAndSaveImageProfile(uploadedImage, id) {
  try {
    const isDir = await fs.lstat(imageUploadPath);
    isDir.isDirectory();
  } catch (error) {
    await fs.mkdir(imageUploadPath, { recursive: true });
    console.error(
      "Folder for storing profile images created. / Creada carpeta de almacenamiento de imagenes de perfil."
    );
  }
  const image = sharp(uploadedImage.data);
  const imageInfo = await image.metadata();

  if (imageInfo.width > 300) {
    image.resize(300);
  }

  const imageFileName = `${id}${uploadedImage.name}`;
  const imagePath = path.join(imageUploadPath, imageFileName);

  await image.toFile(imagePath);

  return imageFileName;
}

async function proccesImagesPost(uploadedImage) {
  try {
    const isDir = await fs.lstat(imagePathPost);
    isDir.isDirectory();
  } catch (error) {
    await fs.mkdir(imagePathPost, { recursive: true });
    console.log(
      "Folder for storing posts created. / Creada carpeta de almacenamiento de posts."
    );
  }

  const image = sharp(uploadedImage.data);
  const imageInfo = await image.metadata();

  if (imageInfo.width > 1000) {
    image.resize(1000);
  }
  if (imageInfo.height > 1000) {
    image.resize({ height: 1000 });
  }

  const imageFileName = `${uuid.v4()}${uploadedImage.name}`;
  const imagePath = path.join(imagePathPost, imageFileName);
  await image.toFile(imagePath);

  return imageFileName;
}

module.exports = {
  formatDateToDB,
  generateError,
  randomString,
  deleteUpload,
  processAndSaveImageProfile,
  proccesImagesPost,
};
