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
  }) ;

  describe( "GET /api/articles/:article_id" , () => {
    test( "status 200: returns a single article object" , () => {
      return request( app )
        .get( "/api/articles/1" )
        .expect( 200 )
        .then( ( { body } ) => {
          expect( body.article.article_id )
          .toBe( 1 ) ;
          expect( body.article.title )
          .toBe( "Living in the shadow of a great man" ) ;
          expect( body.article.topic )
          .toBe( "mitch" ) ;
          expect( body.article.author )
          .toBe( "butter_bridge" ) ;
          expect( body.article.body )
          .toBe( "I find this existence challenging" ) ;
          expect( body.article.created_at )
          .toBe( "2020-07-09T20:11:00.000Z" ) ;
          expect( body.article.votes )
          .toBe( 100 ) ;
          expect( body.article.article_img_url )
          .toBe( "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700" ) ;
        }) ;
    }) ;
    test( "status 404: returned with error message for valid but non-existent id" , () => {
      return request( app )
        .get( "/api/articles/999" )
        .expect( 404 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "article does not exist" ) ;
        }) ;
    }) ;
    test( "status 400: responds with message for invalid id" , () => {
      return request( app )
        .get( "/api/articles/not-an-article" )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;
  }) ;

  describe ( "missing endpoints" , () => {
    test( "404: should return a 404 status and message if endpoint does not exist" , () => {
      
      return request( app )
      .get( "/api/not-a-route" )
      .expect( 404 )
      .then( ( { body } ) => {
        expect( body.msg ).toBe( "Endpoint not found" ) ;
      }) ;
    }) ;
  }) ; 
}) ;