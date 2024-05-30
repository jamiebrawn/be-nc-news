
const db = require( "../db/connection") ;

exports.checkExists = async ( table , column , value ) => {
  const queryStr = format( "SELECT * FROM %I WHERE %I = $1;" , table , column ) ;
  const dbOutput = await db.query( queryStr , [ value ] ) ;
  if ( dbOutput.rows.length === 0 ) {
    return Promise.reject( { 
      status : 404 , 
      msg : `${ table.slice( 0 , -1 ) } does not exist` 
    } ) ;
  }
} ;

// exports.checkExists = ( table , column , value)  => {
//   // console.log(typeof(value))
//   return db
//   .query( `SELECT * FROM ${table} WHERE ${column} = $1`, [value] )
//   .then( ( dbOutput ) => {
//     // console.log(dbOutput.rows , `<<<checkExists ${value}`)
//     if (dbOutput.rows.length === 0) {
//       return Promise.reject( {
//         status : 404 ,
//         msg : `${table.slice(0, -1)} does not exist`
//       } ) ;
//     }
//     return dbOutput.rows
//   })
// };