const { generateError } = require("../../helpers");

const getPostsLatest = async (req, res, next) => {
  try {
    res.send({
      status: "error",
      message: "Not ready yet",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getPostsLatest;
