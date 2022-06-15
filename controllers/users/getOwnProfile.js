const existUser = require("../../db/existUser");
const postList = require("../../db/postList");

const getOwnProfile = async (req, res, next) => {
  try {
    const { userName } = req.auth;

    const [userData] = await existUser(userName);

    const list = await postList(userData.id);

    const response = {
      ...userData,
      postCounter: list.length,
      posts: [...list],
    };

    res.send({
      status: "ok",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getOwnProfile;
