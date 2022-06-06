const postLikes = require("../../db/postLikes");
const likesList = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const likes = await postLikes(postId);

    res.send({
      status: "ok",
      message: likes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = likesList;
