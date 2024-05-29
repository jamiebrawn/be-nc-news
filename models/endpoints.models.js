const fs = require( "fs" ) ;

exports.readEndpoints = () => {
  return fs.promises.readFile( `${__dirname}/../endpoints.json` , "utf8" )
  .then( ( result ) => {
    return JSON.parse( result ) ;
  } ) ;
} ;