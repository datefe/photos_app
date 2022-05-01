const { getConnection } = require("../../1-db/db");

async function getPostsLatest(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { search, order, direction } = req.query;

    // Proceso la dirección de orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "ASC" : "DESC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
      case "title":
        orderBy = "title";
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
        SELECT posts.dateCreation AS "Post Date Creation",  posts.title AS "Post Title",
        posts.place AS "Place", images.path AS "Image Path"
        
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
        SELECT posts.dateCreation AS "Post Date Creation", posts.title AS "Post Title",
        posts.place AS "Place", images.path AS "Image Path"
        
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
