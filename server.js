require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(morgan("dev"));

const isAdmin = require("./middlewares/isAdmin");
const isUser = require("./middlewares/isUser");

//POSTS Controllers

const newPost = require("./2-controllers/posts/newPost");
const getPostsLatest = require("./2-controllers/posts/getPostsLatest");
const getPostById = require("./2-controllers/posts/getPostById");
const getPostByTxt = require("./2-controllers/posts/getPostByTxt");
const getPostUser = require("./2-controllers/posts/getPostUser");

//USERS Controllers

const newUser = require("./2-controllers/users/newUser");
const loginUser = require("./2-controllers/users/loginUser");
const getUser = require("./2-controllers/users/getUser");
const deleteUser = require("./2-controllers/users/deleteUser");
const editUser = require("./2-controllers/users/editUser");

//LIKES Controller

const toggleLikes = require("./2-controllers/likes/likes");

//Endpoints / Rutas

//USERS
app.post("/user", newUser);
app.post("/user/login", loginUser);
app.get("/user/:userName", getUser);
app.put("/user/modify/:userName", isUser, editUser);
app.delete("/user/delete/:id", isUser, deleteUser);

//POSTS
app.post("/post", isUser, newPost);
app.get("/posts", getPostsLatest);
app.get("/posts:text", getPostByTxt);
app.get("/post/:id", getPostById);
app.get("/post/user/:id", getPostUser);
app.delete("/post/delete/:id");

// //LIKES

app.get("/likes/:postId", isUser, toggleLikes);

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

app.listen(3000, () => {
  console.log("Server started / Servidor funcionando");
});
