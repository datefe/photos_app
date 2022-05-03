const { getConnection } = require("../../db/db");
const { deleteUpload } = require("../../helpers");

async function deleteUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;

    // Compruebo que existe el usuario
    const user = await connection.query(
      `
      SELECT id, image
      FROM users
      WHERE id=?
    `,
      [id]
    );

    if (user.length === 0 || req.auth.id === id) {
      const error = new Error(
        `No existe ningún usuario con id ${id} en la base de datos o eres tu mismo.`
      );
      error.httpStatus = 404;
      throw error;
    }

    //Comprobamos si el usuario tiene posts relacionados
    const [post] = await connection.query(
      `
        SELECT id
        FROM posts
        WHERE users_id=?
      `,
      [id]
    );

    console.log(post);

    if (post.length !== 0) {
      console.log("Hay posts relacionados");

      //Borramos las imagenes relacionadas al post
      for (let index = 0; index < post.length; index++) {
        console.log(post[index].id);
        await connection.query(
          `
            DELETE
            FROM images
            WHERE post_id=?
          `,
          [post[index].id]
        );
      }
      //Borramos los comments asociados al post.
      for (let index = 0; index < post.length; index++) {
        console.log(post[index].id);
        await connection.query(
          `
            DELETE
            FROM comments
            WHERE post_id=?
          `,
          [post[index].id]
        );
      }

      //Borramos los likes asociados al post.
      for (let index = 0; index < post.length; index++) {
        console.log(post[index].id);
        await connection.query(
          `
            DELETE
            FROM likes
            WHERE post_id=?
          `,
          [post[index].id]
        );
      }

      //Borramos los posts asociados al user.
      for (let index = 0; index < post.length; index++) {
        console.log(post[index].id);
        await connection.query(
          `
            DELETE
            FROM posts
            WHERE id=?
          `,
          [post[index].id]
        );
      }
    } else {
      console.log("no hay post relacionados al usuario");
    }

    await connection.query(
      `
      DELETE FROM users
      WHERE id=?
    `,
      [id]
    );

    if (user[0].image) {
      await deleteUpload(user[0].image);
    }

    res.send({
      status: "ok",
      message: `El usuario con id ${id} fue borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUser;
