const express = require('express') ;
const app = express() ;
const {
  getTopics
} = require( "./controllers/topics.controllers" ) ; 

app.get( "/api/topics" , getTopics) ;






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