const existUser = require("../../1-db/existUser");
const existPost = require("../../1-db/existPost");
const likeExist = require("../../1-db/toggleLike");
const toggleLikes = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    let { postId } = req.params;
    postId = parseInt(postId);

    const postExist = await existPost(postId);

    const like = await likeExist(userId, postId);

    res.send({
      status: "ok",
      message: like,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = toggleLikes;
