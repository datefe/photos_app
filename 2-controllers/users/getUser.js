const existUser = require("./existUser");
const postList = require("./postList");
const postImages = require("./postImages");
const getUser = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const { orderBy } = req.query;

    const [userData] = await existUser(userName);

    const list = await postList(userData.id);

    if (!list) {
      userData.countPosts = 0;
    } else {
      userData.countPosts = list.length;
      userData.posts = [];

      for (const post of list) {
        const images = await postImages(post.id);

        userData.posts.push({
          title: post.title,
          place: post.place,
          dateCreation: post.dateCreation,
          images: images,
        });
      }
    }

    res.send({
      status: "ok",
      message: userData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
