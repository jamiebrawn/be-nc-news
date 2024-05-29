const db = require( "../db/connection" ) ;

exports.selectArticleById = ( article_id ) => {
  return db
    .query( "SELECT * FROM articles WHERE article_id = $1;" , [ article_id ] )
    .then( ( { rows } ) => {
      const article = rows[ 0 ]
      if ( !article ) {
        return Promise.reject( { status : 404 , msg : "article does not exist" })
      }
      return article;
    });
};