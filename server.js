require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev"));
app.use(cors());
app.use("/postUpload", express.static("./postUpload"));
/* app.use("/user/postUpload", express.static("./postUpload"));
app.use("/user/profileUpload", express.static("./profileUpload")); */
app.use("/profileUpload", express.static("./profileUpload"));

const isAdmin = require("./middlewares/isAdmin");
const isUser = require("./middlewares/isUser");

//POSTS Controllers

const {
  newPost,
  getPostsLatest,
  getPostById,
  getPostUser,
} = require("./controllers/posts");

//USERS Controllers
const {
  newUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
} = require("./controllers/users");

//LIKES Controller

const toggleLikes = require("./controllers/likes/likes");

//COMMENTS Controller

const newComment = require("./controllers/comments/newComment");
const getMessages = require("./controllers/comments/getMessages");
const likesList = require("./controllers/likes/likesList");
const getOwnProfile = require("./controllers/users/getOwnProfile");
//Endpoints / Rutas

//USERS
app.post("/user", newUser);
app.post("/user/login", loginUser);
app.get("/user/:userName", getUser);
app.get("/user", isUser, getOwnProfile);
app.put("/user/modify/:userName", isUser, editUser);
app.delete("/user/delete/:id", isUser, isAdmin, deleteUser);

//POSTS
app.post("/post", isUser, newPost);
app.get("/posts", getPostsLatest);
app.get("/post/:id", getPostById);
app.get("/post/user/:id", getPostUser);

//LIKES
app.get("/post-likes/:postId", likesList);
app.get("/likes/:postId", isUser, toggleLikes);

//COMMENTS
app.post("/comment", isUser, newComment);
app.get("/comments/:postId", getMessages);
//Middleware 404

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not Found / No encontrado",
  });
});

//Middleware error handling / gestor de errores

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

//Starting the server / lanzamos el servidor

app.listen(3100, () => {
  console.log("Server started / Servidor funcionando");
});
