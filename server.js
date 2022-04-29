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
const getUsers = require("./2-controllers/users/getUsers");
const deleteUser = require("./2-controllers/users/deleteUser");
const getUserById = require("./2-controllers/users/getUserById");
const editUser = require("./2-controllers/users/editUser");
//Endpoints / Rutas

//USERS
app.post("/user", newUser);
app.post("/user/login", loginUser);
app.get("/users", getUsers);
app.get("/user/:id", isUser, getUserById);
app.put("/user/modify/:id", isUser, editUser);
app.delete("/user/delete/:id", isUser, deleteUser);

//POSTS
app.post("/post", newPost);
app.get("/posts", getPostsLatest);
app.get("/post/:id", getPostById);
app.get("post/:txt", getPostByTxt);
app.get("/post/user/:id", getPostUser);
app.delete("/post/delete/:id");

// //LIKES
// app.get("/likes/:idPost", getLikesByPost);
// app.get("/likes/:idUser", getLikesByUser);
// app.post("/like", newLike);
// app.delete("/like", deleteLike);

// //COMMENTS
// app.post("/comment/:idPost", newComment);
// app.get("/comments/:idPost", getCommentsByPost);
// app.get("/comments/:idUser", getCommmentsByUser);
// app.delete("/comment", deleteComment);

//Middleware isUser

// app.use(isUser);

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
