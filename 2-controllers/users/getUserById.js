const { getConnection } = require("../../1-db/db");
const { generateError } = require("../../helpers");
const getUserById = async (req, res, next) => {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
      throw generateError("No tienes permisos para editar este usuario", 403);
    }

    const [result] = await connection.query(
      `
      SELECT users.id, users.name,  users.role, users.email
      FROM users 
      WHERE id = ?
      `,
      [id]
    );

    const response = {
      user: result[0].user,
    };

    if (req.auth.id === parseInt(id) || result[0].role === "admin") {
      response.email = result[0].email;
      response.role = result[0].role;
    }

    res.send({
      status: "ok",
      message: response,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getUserById;
