const db = require( "../db/connection" ) ;
const { checkExists } = require( "./utils.models" ) ;

exports.selectArticleById = ( article_id ) => {


  const commentCountQuery = `
    SELECT COUNT(*)::int AS comment_count
    FROM comments
    WHERE article_id = $1;
  `;


  return db
    .query( "SELECT * FROM articles WHERE article_id = $1;" , [ article_id ] )
    .then( ( { rows } ) => {
      const article = rows[ 0 ]
      if ( !article ) {
        return Promise.reject( { status : 404 , msg : "article does not exist" })
      }

      return db
      .query(
        `SELECT COUNT(*)::int AS comment_count
        FROM comments
        WHERE article_id = $1;` ,
        [ article_id ] 
      )
      .then(( commentCountResult ) => {
        article.comment_count = commentCountResult.rows[ 0 ].comment_count ;
        return article ;
      })
    }) ;
} ;

exports.selectArticles = async ( topic ) => {

  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id` ;

  const queryParams = [] ;

  if ( topic ) {
    queryString += ` WHERE articles.topic = $1` ;
    queryParams.push( topic ) ;
  }

  queryString += 
  ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;` ;

  const result = await db.query( queryString , queryParams ) ;
  
  if (result.rows.length === 0 && topic ) {
    await checkExists( "topics" , "slug" , topic ) ;
  }

  return result.rows;
} ;

exports.updateArticleByArticleId = ( article_id , inc_votes) => {
  return db
  .query(
    `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;` , 
    [ inc_votes , article_id ]
  )
  .then( ( { rows } ) => {
    const article = rows[ 0 ]
    if ( !article ) {
      return Promise.reject( { status : 404 , msg : "article does not exist" } ) ;
    }
    return article ;
  }) ;
} ;
