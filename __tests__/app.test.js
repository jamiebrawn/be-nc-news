const app = require( "../app" ) ;
const request = require( "supertest" ) ;
const db = require( "../db/connection" ) ;
const seed = require( "../db/seeds/seed" ) ;
const data = require ( "../db/data/test-data/index" ) ;


beforeEach( () => seed( data ) ) ;

afterAll( () => db.end() ) ;

describe ( "app" , () => { 
  
  describe( "GET /api/topics" , () => {

    test( "status 200: should return all topic objects in an array of correct length and with correct properties" , () => {
      
      return request( app )
			.get( "/api/topics" )
			.expect( 200 )
			.then( ( { body } )=> {

				expect(body.topics).toHaveLength( 3 ) ;

				body.topics.forEach( ( topic ) => {
					expect( topic ).toMatchObject( {
            description : expect.any( String ) ,
            slug : expect.any( String ) 
					}) ;
				}) ;
			}) ;
    }) ;
  })
  describe ( "missing endpoints" , () => {
    test( "404: should return a 404 status and message if endpoint does not exist" , () => {
      
      return request( app )
      .get( "/api/not-a-route" )
      .expect( 404 )
      .then( ( { body } ) => {
        expect( body.msg ).toBe( "Endpoint not found" ) ;
      });
    } )
  }) 
})