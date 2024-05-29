const express = require( "express" ) ;
const app = express() ;
const { getTopics } = require( "./controllers/topics.controllers" ) ; 
const { 
  getArticleById ,
  getArticles
} = require( "./controllers/articles.controllers" ) ;
const { getCommentsByArticleId } = require( "./controllers/comments.controllers" ) ;
const { getEndpoints } = require('./controllers/endpoints.controllers') ;

app.get( "/api/topics" , getTopics) ;

app.get( "/api" , getEndpoints ) ;

app.get( "/api/articles/:article_id" , getArticleById ) ;

app.get( "/api/articles/:article_id/comments" , getCommentsByArticleId ) ;

app.get( "/api/articles" , getArticles ) ;

// ERROR HANDLING

// missing endpoint 404
app.use( ( req , res , next ) => {
  res
  .status( 404 )
  .send( { msg : "Endpoint not found" } ) ;
} ) ;


// psql defined errors
app.use( ( err , req , res , next ) => {
  if ( err.code === '23502' || err.code === '22P02') {
    res
    .status( 400 )
    .send( { msg: 'Bad request' } ) ;
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
  .send( { msg : "Internal Server Error"} ) ;
} ) ;

module.exports = app ;