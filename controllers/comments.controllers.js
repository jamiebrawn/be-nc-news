const { 
  selectCommentsByArticleId ,
  insertCommentByArticleId 
} = require( "../models/comments.models" ) ;
const { selectArticleById } = require( "../models/articles.models" ) ;
const { checkExists } = require( "../models/utils.models" ) ;


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

exports.postCommentByArticleId = ( req , res , next ) => {
  const { article_id } = req.params ;
  const { username , body } = req.body ;

  if ( !username || !body ) {
    throw( { status : 400 , msg : "Bad request" } );
  }

  Promise.all([
    checkExists( "articles" , "article_id" , article_id ),
    checkExists( "users",  "username" , username )
  ])
  .then(() => {
    return insertCommentByArticleId( article_id , username , body ) ;
  })
  .then( ( comment ) => {
    res
    .status( 201 )
    .send( { comment } ) ;
  })
  .catch( next ) ;
} ;