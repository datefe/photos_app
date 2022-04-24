
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
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

      CREATE TABLE users_profile (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        dateLastUpdate DATETIME NOT NULL,
        username TINYTEXT NOT NULL,
        image TINYTEXT,
        intro VARCHAR(250) DEFAULT NULL

      );

      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        image_id INTEGER NOT NULL,
        likes_id INTEGER NOT NULL,
        comment_id INTEGER NOT NULL,
        dateCreation DATETIME NOT NULL,
        title VARCHAR(50) NOT NULL,
        description TEXT,
        place VARCHAR(50) NOT NULL,
        image TINYTEXT
      );

      CREATE TABLE images (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        dateCreation DATETIME NOT NULL,
        name TINYTEXT,
        path TINYTEXT
      );

      CREATE TABLE likes (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER NOT NULL,
        userprofile_id INTEGER NOT NULL,
        dateCreation DATETIME NOT NULL
      );

      CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        post_id INTEGER NOT NULL,
        userprofile_id INTEGER NOT NULL,
        dateCreation DATETIME NOT NULL,
        comment VARCHAR(200) NOT NULL
      );