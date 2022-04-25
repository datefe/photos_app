require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

//Endpoints / Rutas

//USERS
app.post("/user", newUser);
app.get("/users", getUsers);
app.get("/user/:id", getUserById);
app.put("/user/modify/:id", putUser);
app.post("/user/login", login);
app.delete("/user/delete", deleteUser);

//POSTS
app.post("/post", newPost);
app.get("/post/:id", getPostById);
app.get("post/:txt", getPostByTxt);
app.get("/post/user/:id", getPostUser);

//LIKES
app.get("/likes/:idPost", getLikesByPost);
app.get("/likes/:idUser", getLikesByUser);
app.post("/like", newLike);
app.delete("/like", deleteLike);

//COMMENTS
app.post("/comment/:idPost", newComment);
app.get("/comments/:idPost", getCommentsByPost);
app.get("/comments/:idUser", getCommmentsByUser);
app.delete("/comment", deleteComment);

//Middleware isUser

app.use(isUser);

//Middleware 404

app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not Found / No encontrado",
  });
});

//Middleware error handling / gestor de errores

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

//Starting the server / lanzamos el servidor

app.listen(3000, () => {
  console.log("Server started / Servidor funcionando");
});
