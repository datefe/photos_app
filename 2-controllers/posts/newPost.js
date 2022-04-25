const newPost = async (req, res, next) => {
  try {
    const { id, user_id, dateCreation, title } = req.body;

    res.send({
      status: "error",
      message: "Not ready yet",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = newPost;
