# photos_app

Backend architecture of an app for photos upload.
Arquitectura de backend para una app de subida de fotos.

Entities / Entidades

- users
- posts
- images
- likes
- comments

Endpoints / Rutas

//USERS
/user
/user/login
/user/:userName
/user/modify/:userName
/user/delete/:id

//POSTS
/post
/posts
/post/:id
/post/user/:id

//LIKES
/likes/:postId

//COMMENTS
/comment

Instructions for deployment in Spanish / Instrucciones en Español

1- Configurar el archivo .env como en el ejemplo.

2- Arrancar la base de datos con el initDB.js

3- Importa las dos postman collections.

4- Crear nuevo usuario.
Introduce los datos de registro requeridos dentro del body (email, password, userName).

5- Login.
Introduce los datos requeridos (email, password, userName) y obten un token de retorno.

6- Ver perfil de un usuario con su galeria de fotos.
Introducir el userName del usuario.

7- Modificar perfil de usuario.
Requiere el token que obtienes en el login como una key Authorization en el header.
Introducir los datos a actualizar como query params (email, name, newUserName, surname, intro).
Si quieres actualizar la imagen de perfil introducela en el form-data con la key image.

8- Dar/quitar like.
Requiere el token que obtienes en el login como una key Authorization en el header.
Introducir el id del post hacia el que va dirigido el like.

9- Borrado de usuario.
Solo permitido con un token de admin.
Introducir id del usuario a eliminar.

10- Get Posts.
Para ver todos los posts de la base de datos con sus imagenes.
Utiliza Params section y puedes ordernar por order: title, place o dateCreation (por defecto)

11- Get Post by ID.
Para ver la información relacionada con un post: el usuario que la creó, imagenes, likes, titulo, lugar y date creation del post.

12- New Post.
Crea un post añadiendo la información en la sección de Params.

13- New Comment.
Crea un comentario a través del Body > JSON
