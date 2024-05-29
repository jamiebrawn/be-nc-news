const db = require( "../db/connection" ) ;

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