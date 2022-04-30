const { getConnection } = require("../../1-db/db");

async function getPostsLatest(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    // Sacamos las posibles opciones del querystring:
    //  search: para listar solo las entradas que contengan su valor en place o description
    //  order: para ordernar el listado por likes, place o date
    //  direction: para la dirección de la ordenación desc o asc
    const { search, order, direction } = req.query;

    // Proceso la dirección de orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
      case "likes":
        orderBy = "likes";
        break;
      case "place":
        orderBy = "place";
        break;
      default:
        orderBy = "dateCreation";
    }

    // Ejecuto la query en base a si existe querystring de search o no
    let queryResults;
    if (search) {
      queryResults = await connection.query(
        `
        SELECT posts.dateCreation AS "Post Date Creation", posts.title AS "Post Title", posts.place AS "Place", images.name AS "Image Name"
        (SELECT AVG(likes.id) FROM likes WHERE likes.post_id=posts.id) AS "Likes Average"
        FROM posts
        INNER JOIN images on images.post_id = posts.id
        WHERE posts.place LIKE ? OR posts.title LIKE ?
        ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${search}%`, `%${search}%`]
      );
    } else {
      queryResults = await connection.query(
        `
        SELECT posts.dateCreation AS "Post Date Creation", posts.title AS "Post Title", posts.place AS "Place", images.name AS "Image Name"
        (SELECT AVG(likes.id) FROM likes WHERE likes.post_id=posts.id) AS "Likes Average"
        FROM posts
        INNER JOIN images on images.post_id = posts.id
        ORDER BY ${orderBy} ${orderDirection}`
      );
    }

    // Extraigo los resultados reales del resultado de la query
    const [result] = queryResults;

    // Mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getPostsLatest;
