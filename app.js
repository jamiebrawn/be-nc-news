const cors = require('cors');
const express = require( "express" ) ;
const app = express() ;
const { 
  getTopics 
} = require( "./controllers/topics.controllers" ) ; 
const { 
  getArticleById ,
  getArticles,
  patchArticleByArticleId
} = require( "./controllers/articles.controllers" ) ;
const {
  getCommentsByArticleId ,
  postCommentByArticleId ,
  deleteCommentByCommentId
} = require( "./controllers/comments.controllers" ) ;
const { getAllUsers } = require( "./controllers/users.controllers" ) ;
const { 
  getEndpoints 
} = require('./controllers/endpoints.controllers') ;

app.use(cors());

app.use(express.json());

app.get( "/api/topics" , getTopics) ;

app.get( "/api" , getEndpoints ) ;

app.get( "/api/articles/:article_id" , getArticleById ) ;

app.patch( "/api/articles/:article_id" , patchArticleByArticleId ) ;

app.get( "/api/articles/:article_id/comments" , getCommentsByArticleId ) ;

app.post( "/api/articles/:article_id/comments" , postCommentByArticleId ) ;

app.delete( "/api/comments/:comment_id" , deleteCommentByCommentId ) ;

app.get( "/api/articles" , getArticles ) ;

app.get( "/api/users" , getAllUsers ) ;

// ERROR HANDLING

// missing endpoint 404
app.use( ( req , res , next ) => {
  console.log("Endpoint not found");
  res
  .status( 404 )
  .send( { msg : "Endpoint not found" } ) ;
} ) ;


// psql defined errors
app.use( ( err , req , res , next ) => {
  if ( 
    err.code === "23502" // not_null_violation
    || err.code === "22P02" // invalid_text_representation
    || err.code === "23505" // unique_violation
    || err.code === "23514" // check_violation
    ) {
    res
    .status( 400 )
    .send( { msg: "Bad request" } ) ;
  } else if ( 
    err.code === "23503" // foreign_key_violation
  ) {
    res
    .status( 404 )
    .send( { msg: "Not found" } ) ;
  } else {
    next( err ) ;
  }
} ) ;

// custom errors
app.use( ( err , req , res , next ) => {
  if ( err.msg ) {
    res
    .status( err.status )
    .send( { msg : err.msg } ) ;
  } else { 
    next( err ) ;
  }
} ) ;

// Final error (uh oh)
app.use( ( err , req , res , next ) => {
  console.log( err ) ;
  res
  .status( 500 )
  .send( { msg : "Internal Server Error" } ) ;
} ) ;

module.exports = app ;