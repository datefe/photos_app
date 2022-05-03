const existUser = require("../../db/existUser");
const postList = require("../../db/postList");
const postLikes = require("../../db/postLikes");
const postImages = require("../../db/postImages");

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
        const [{ likes }] = await postLikes(post.id);
        console.log(likes);
        userData.posts.push({
          title: post.title,
          place: post.place,
          dateCreation: post.dateCreation,
          likes: likes,
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
