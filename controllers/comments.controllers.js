const { 
  selectCommentsByArticleId ,
  insertCommentByArticleId ,
  deleteCommentFromDbByCommentId
} = require( "../models/comments.models" ) ;
const { selectArticleById } = require( "../models/articles.models" ) ;
const { checkExists } = require( "../models/utils.models" );


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

  insertCommentByArticleId( article_id , username , body )
  .then( ( comment ) => {
    res
    .status( 201 )
    .send( { comment } ) ;
  })
  .catch( next ) ;
} ;

exports.deleteCommentByCommentId = ( req , res , next ) => {
  const { comment_id } = req.params;

  checkExists( "comments" , "comment_id" , comment_id )
  .then( () => {
    return deleteCommentFromDbByCommentId( comment_id )
    .then( () => {
      res
      .sendStatus( 204 ) ;
    } )
    })
  .catch( next ) ;
} ;

exports.postCommentByArticleId = ( req , res , next ) => {
  const { article_id } = req.params ;
  const { username , body } = req.body ;

  checkExists("articles", "article_id", article_id) 
  .then(() => {
    return checkExists("users", "username", username) ;
    // checkExists("users", "username", username) 
  })
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
