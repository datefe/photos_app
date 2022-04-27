const { generateError } = require("../../helpers");

const newPost = async (req, res, next) => {
  try {
    const { id, user_id, dateCreation, title } = req.body;

    if (!title) {
      throw generateError(
        "Title and Image are required / Indica titulo e imagen"
      );
    }

    res.send({
      status: "error",
      message: "Not ready yet",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = newPost;
