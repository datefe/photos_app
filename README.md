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

Instructions for deployment in Spanish / Instrucciones en Español

1- Configurar el archivo .env como en el ejemplo.

2- Arrancar la base de datos con el initDB.js

3- Crear nuevo usuario.
    Introduce los datos de registro requeridos dentro del body (email, password, userName).

4- Login.
    Introduce los datos requeridos (email, password, userName) y obten un token de retorno.

5- Ver perfil de un usuario con su galeria de fotos.
    Introducir el userName del usuario.

6- Modificar perfil de usuario.
    Requiere el token que obtienes en el login como una key Authorization en el header.
    Introducir los datos a actualizar como query params (email, name, newUserName, surname, intro).
    Si quieres actualizar la imagen de perfil introducela en el form-data con la key image.

7- Dar/quitar like.
    Requiere el token que obtienes en el login como una key Authorization en el header.
    Introducir el id del post hacia el que va dirigido el like.

8- Borrado de usuario.
    Solo permitido con un token de admin.
    Introducir id del usuario a eliminar.
