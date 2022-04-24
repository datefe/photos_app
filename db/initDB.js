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

    await connection.query(`
      CREATE TABLE users (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        dateCreation DATETIME NOT NULL,
        dateLastLogIn DATETIME NOT NULL,
        registrationCode TINYTEXT,
        name TINYTEXT,
        surname TINYTEXT,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TINYTEXT NOT NULL,
        role ENUM("normal", "admin") DEFAULT "normal" NOT NULL,       
        active BOOLEAN DEFAULT false        
      );
    `);

    await connection.query(`
      CREATE TABLE usersProfile (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER UNSIGNED,
        dateLastUpdate DATETIME NOT NULL,
        username TINYTEXT NOT NULL,
        image TINYTEXT,
        intro VARCHAR(250) DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await connection.query(`
      CREATE TABLE posts (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        usersProfile_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        place VARCHAR(50) NOT NULL,
        image VARCHAR(150),
      FOREIGN KEY (usersProfile_id) REFERENCES usersProfile(id)
      );
    `);

    await connection.query(`
      CREATE TABLE images (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME NOT NULL,
        name TINYTEXT,
        path TINYTEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id)
      );
    `);

    await connection.query(`
      CREATE TABLE likes (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER UNSIGNED NOT NULL,
        usersProfile_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (usersProfile_id) REFERENCES usersProfile(id)

      );
    `);

    await connection.query(`
      CREATE TABLE comments (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER UNSIGNED NOT NULL,
        usersProfile_id INTEGER UNSIGNED NOT NULL,
        dateCreation DATETIME NOT NULL,
        comment VARCHAR(200) NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (usersProfile_id) REFERENCES usersProfile(id)

      );
    `);

    // Adding template data

    console.log(
      "Users table: creating Admin user / Tabla users: creando usuario Admin"
    );

    await connection.query(
      `
      INSERT INTO users(dateCreation, dateLastLogin, name, surname, email, password, role, active)
      VALUES(UTC_TIMESTAMP, UTC_TIMESTAMP, "Admin", "Surname", "admin@email.com", SHA2("${process.env.DEFAULT_ADMIN_PASSWORD}", 512), "admin", true)
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
      INSERT INTO users(dateCreation, dateLastLogin, name, surname, email, password, role, active)
      VALUES(UTC_TIMESTAMP, UTC_TIMESTAMP, "${name}", "${surname}", "${email}", SHA2("${faker.internet.password()}", 512), "normal", true)
      `
      );
    }

    console.log(
      "Adding sample data to usersProfile table / Añadiendo datos de prueba a la tabla de usersProfile"
    );

    const usersProfile = 11;
    let counter = 1;

    for (let index = 0; index < usersProfile; index++) {
      const dateLastUpdate = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO usersProfile(user_id, dateLastUpdate, username, intro)
        VALUES(
          "${counter}",
          "${dateLastUpdate}",
          "${faker.name.firstName()}",
          "${faker.lorem.sentence(5)}"         
          )
      `);

      counter++;
    }

    console.log(
      "Adding sample data to Posts table / Añadiendo datos de prueba a la tabla de Posts"
    );

    const posts = 10;

    for (let index = 0; index < posts; index++) {
      const dateCreationPost = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO posts(usersProfile_id, dateCreation, title, description, place, image)
        VALUES(
          "${random(2, users + 1)}",
          "${dateCreationPost}",
          "${faker.lorem.words(3)}",
          "${faker.lorem.paragraphs(2)}",
          "${faker.address.city()}",
          "${faker.image.avatar()}"         
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
        INSERT INTO comments(post_id,usersProfile_id, dateCreation, comment)
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
        INSERT INTO likes(post_id,usersProfile_id, dateCreation)
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
      const dateCreationImages = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO images(post_id,dateCreation,name,path)
        VALUES(
          "${random(2, users)}",
          "${dateCreationImages}",
          "${faker.lorem.words(1)}",
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
