const existUser = require("../../1-db/existUser");
const postList = require("../../1-db/postList");
const postLikes = require("../../1-db/postLikes");
const postImages = require("../../1-db/postImages");

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
