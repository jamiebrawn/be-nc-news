const db = require( "../db/connection" ) ;
const { checkExists } = require( "../models/utils.models" ) ;

exports.selectCommentsByArticleId = ( article_id ) => {
  return db
  .query(
    `SELECT comment_id, body, votes, author, article_id, created_at
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;` ,
    [ article_id ]
  )
  .then( ( result ) => {
    return result.rows ;
  }) ;
} ;

exports.insertCommentByArticleId = ( article_id , username , body ) => {
  return db
  .query(
    `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [ article_id , username , body ]
  )
  .then( ( result ) => {
    return result.rows[ 0 ] ;
  }) ;
} ;

exports.deleteCommentFromDbByCommentId = ( comment_id ) => {
  return db
  .query( "DELETE FROM comments WHERE comment_id = $1", [ comment_id ] ) ; 
}  

// exports.insertCommentByArticleId = (article_id, username, body) => {
//   return Promise.all([
//     checkExists("articles", "article_id", article_id),
//     checkExists("users", "username", username)
//   ])
//   .then(() => {
//     return db.query(
//       `INSERT INTO comments (article_id, author, body)
//       VALUES ($1, $2, $3)
//       RETURNING *;`,
//       [article_id, username, body]
//     );
//   })
//   .then((result) => {
//     return result.rows[0];
//   });
// };





