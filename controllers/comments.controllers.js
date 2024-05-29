const { selectCommentsByArticleId } = require( "../models/comments.models" ) ;
const { selectArticleById } = require( "../models/articles.models" ) ;

exports.getCommentsByArticleId = ( req , res , next ) => {
  const { article_id } = req.params;

  selectArticleById( article_id )
  .then(() => {
    return selectCommentsByArticleId( article_id ) ;
  })
  .then( ( comments ) => {
    res
    .status( 200 )
    .send( { comments } ) ;
  })
  .catch( next ) ;
} ;