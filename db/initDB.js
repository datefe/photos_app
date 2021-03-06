require("dotenv").config();

const faker = require("faker/locale/es");
const { getConnection } = require("./db");
const { formatDateToDB } = require("../helpers");
const { random } = require("lodash");

async function main() {
  let connection;
  try {
    // Connecting to database
    connection = await getConnection();

    // Removing (dropping) tables if they already exists (users, users_profile, posts, images, likes, comments)
    console.log("Removing tables / Eliminando tablas");

    await connection.query("DROP TABLE IF EXISTS likes");
    await connection.query("DROP TABLE IF EXISTS comments");
    await connection.query("DROP TABLE IF EXISTS images");
    await connection.query("DROP TABLE IF EXISTS posts");
    await connection.query("DROP TABLE IF EXISTS usersProfile");
    await connection.query("DROP TABLE IF EXISTS users");

    // Creating the tables
    console.log("Creating tables / Creando tablas");

    // registrationcode tipo de  dato
    // name,surname utilizar varchar
    // contar con la codificacion de la contraseña

    await connection.query(`
      CREATE TABLE users (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        dateCreation DATETIME NOT NULL,
        dateLastLogIn DATETIME,
        registrationCode TINYTEXT,  
        name VARCHAR(20) DEFAULT "Undefined",
        surname VARCHAR(20) DEFAULT "Undefined",
        email VARCHAR(100) UNIQUE NOT NULL,
        password TINYTEXT NOT NULL,
        userName VARCHAR(25)  NOT NULL,
        image TINYTEXT,
        intro VARCHAR(250) DEFAULT NULL,
        role ENUM("normal", "admin") DEFAULT "normal",       
        active BOOLEAN DEFAULT true        
      );
    `);

    await connection.query(`
      CREATE TABLE posts (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        users_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(100) NOT NULL,
        place VARCHAR(50),
      FOREIGN KEY (users_id) REFERENCES users(id)
      );
    `);

    await connection.query(`
      CREATE TABLE images (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER UNSIGNED NOT NULL,
        path VARCHAR(1000) NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id)
      );
    `);

    await connection.query(`
      CREATE TABLE likes (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER UNSIGNED NOT NULL,
        users_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (users_id) REFERENCES users(id)

      );
    `);

    await connection.query(`
      CREATE TABLE comments (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER UNSIGNED NOT NULL,
        users_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME NOT NULL,
        comment VARCHAR(200) NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (users_id) REFERENCES users(id)

      );
    `);

    // Adding template data

    console.log(
      "Users table: creating Admin user / Tabla users: creando usuario Admin"
    );

    await connection.query(
      `
      INSERT INTO users(dateCreation, dateLastLogin, name, surname, email, password, userName, role, active)
      VALUES(UTC_TIMESTAMP, UTC_TIMESTAMP, "Admin", "Surname", "admin@email.com", SHA2("adminPass}", 512), "admin", "admin", true)
    `
    );

    console.log(
      "Adding sample data to Users table / Añadiendo datos de prueba a la tabla de Users"
    );
    const users = 10;

    for (let index = 0; index < users; index++) {
      const email = faker.internet.email();
      const name = faker.name.firstName();
      const surname = faker.name.lastName();

      await connection.query(
        `
      INSERT INTO users(dateCreation, dateLastLogin, name, surname, email, password, userName, role, active)
      VALUES(UTC_TIMESTAMP, UTC_TIMESTAMP, "${name}", "${surname}", "${email}", SHA2("${faker.internet.password()}", 512),  "${name}",  "normal", true)
      `
      );
    }

    console.log(
      "Adding sample data to Posts table / Añadiendo datos de prueba a la tabla de Posts"
    );

    const posts = 10;

    for (let index = 0; index < posts; index++) {
      const dateCreationPost = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO posts(users_id, dateCreation, title, place)
        VALUES(
          "${random(2, users + 1)}",
          "${dateCreationPost}",
          "${faker.lorem.words(3)}",
          "${faker.address.city()}"   
          )
      `);
    }

    console.log(
      "Adding sample data to Comments table / Añadiendo datos de prueba a la tabla de Comments"
    );
    const comments = 20;

    for (let index = 0; index < comments; index++) {
      const dateCreationComment = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO comments(post_id,users_id, dateCreation, comment)
        VALUES(
          "${random(2, users)}",
          "${random(2, users)}",
          "${dateCreationComment}",
          "${faker.lorem.sentence(20)}"
          )
      `);
    }
    console.log(
      "Adding sample data to Likes table / Añadiendo datos de prueba a la tabla de Likes"
    );
    const likes = 80;

    for (let index = 0; index < likes; index++) {
      const dateCreationLikes = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO likes(post_id,users_id, dateCreation)
        VALUES(
          "${random(2, users)}",
          "${random(2, users)}",
          "${dateCreationLikes}"
          )
      `);
    }

    console.log(
      "Adding sample data to Images table / Añadiendo datos de prueba a la tabla de Images"
    );
    const images = 15;

    for (let index = 0; index < images; index++) {
      await connection.query(`
        INSERT INTO images(post_id,path)
        VALUES(
          "${random(2, users)}",
          "${faker.image.image()}"
          )
      `);
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log("All done, releasing connection");
    if (connection) connection.release();
    process.exit();
  }
}

main();
