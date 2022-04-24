require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

//Endpoints / Rutas

//USERS
app.post("/users", newUserController);
app.get("/users/:id", getUserController);
app.post("/login", loginController);

//POSTS
app.post("/posts", newPostController);
app.get("/posts/:id", getPostController);

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
