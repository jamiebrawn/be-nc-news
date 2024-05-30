require( "jest-sorted" ) ;
const app = require( "../app" ) ;
const request = require( "supertest" ) ;
const db = require( "../db/connection" ) ;
const seed = require( "../db/seeds/seed" ) ;
const data = require( "../db/data/test-data/index" ) ;
const fs = require( "fs" ) ;


beforeEach( () => seed( data ) ) ;

afterAll( () => db.end() ) ;

describe ( "app" , () => { 
  
  describe( "GET /api/topics" , () => {

    test( "status 200: should return all topic objects in an array of correct length and with correct properties" , () => {
      
      return request( app )
			.get( "/api/topics" )
			.expect( 200 )
			.then( ( { body } )=> {

				expect( body.topics ).toHaveLength( 3 ) ;

				body.topics.forEach( ( topic ) => {
					expect( topic ).toMatchObject( {
            description : expect.any( String ) ,
            slug : expect.any( String ) 
					}) ;
				}) ;
			}) ;
    }) ;
  }) ;

  describe ( "GET /api" , () => {

    test( "200: should return a JSON of all available endpoints" , () => {
      
      return request( app )
      .get( "/api" )
      .expect( 200 )
      .then( ( { body } ) => {
        return fs.promises.readFile( `${__dirname}/../endpoints.json` , "utf8" )
        .then( ( endpoints ) => {
          expect( body ).toEqual( JSON.parse( endpoints ) ) ;
        }) ;
      }) ;
    } ) ;
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







  
  describe( "PATCH /api/articles/:article_id" , () => {
    test( "status 200: returns the article object with updated votes property" , () => {
      return request( app )
        .patch( "/api/articles/1" )
        .send ( { inc_votes : 1 } )
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
          .toBe( 101 ) ;
          expect( body.article.article_img_url )
          .toBe( "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700" ) ;
        }) ;
    }) ;
    test( "status 200: should handle negative changes" , () => {
      return request( app )
        .patch( "/api/articles/3" )
        .send ( { inc_votes : -100 } )
        .expect( 200 )
        .then( ( { body } ) => {
          expect( body.article.article_id )
          .toBe( 3 ) ;
          expect( body.article.title )
          .toBe( "Eight pug gifs that remind me of mitch" ) ;
          expect( body.article.topic )
          .toBe( "mitch" ) ;
          expect( body.article.author )
          .toBe( "icellusedkars" ) ;
          expect( body.article.body )
          .toBe( "some gifs" ) ;
          expect( body.article.created_at )
          .toBe( "2020-11-03T09:12:00.000Z" ) ;
          expect( body.article.votes )
          .toBe( -100 ) ;
          expect( body.article.article_img_url )
          .toBe( "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700" ) ;
        }) ;
    }) ;
    test( "status 200: should ignore invalid input properties" , () => {
      return request( app )
        .patch( "/api/articles/3" )
        .send ( {
          inc_votes : -100 , 
          invalid_key : "invalid_value"
        } )
        .expect( 200 )
        .then( ( { body } ) => {
          expect( body.article.votes )
          .toBe( -100 ) ;
        }) ;
    }) ;
    test( "status 404: returned with error message for valid but non-existent id" , () => {
      return request( app )
        .patch( "/api/articles/999" )
        .send ( { inc_votes : -100 } )
        .expect( 404 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "article does not exist" ) ;
        }) ;
    }) ;
    test( "status 400: responds with message for invalid id" , () => {
      return request( app )
        .patch( "/api/articles/not-an-article" )
        .send ( { inc_votes : -100 } )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;
    test( "status 400: responds with message for invalid inc_votes values" , () => {
      return request( app )
        .patch( "/api/articles/3" )
        .send ( { inc_votes : "not a number" } )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;
    test( "status 400: responds with message for missing input" , () => {
      return request( app )
        .patch( "/api/articles/3" )
        .send ()
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;
  }) ;






  describe( "GET /api/articles/:article_id/comments" , () => {
    test( "status 200: returns an array of all related comment objects with correct length and properties" , () => {
      return request( app )
      .get( "/api/articles/1/comments" )
      .expect( 200 )
      .then( ( { body } )=> {
        
        expect( body.comments ).toHaveLength( 11 ) ;

        body.comments.forEach( ( article ) => {
          expect( article ).toMatchObject( {
            comment_id : expect.any( Number ) ,
            body: expect.any ( String ) ,
            votes : expect.any( Number ) ,
            author : expect.any( String ) ,
            article_id : expect.any( Number ) ,
            created_at : expect.any( String ) ,
          }) ;
        }) ;
      }) ;
    }) ;

    test( "status 200: returns an empty array if no comments exist" , () => {
      return request( app )
      .get( "/api/articles/4/comments" )
      .expect( 200 )
      .then( ( { body } )=> {
        expect( body.comments ).toHaveLength( 0 ) ;
      }) ;
    }) ;

    test( "status 200: should sort response descending by created_at" , () => {
      
      return request( app )
			.get( "/api/articles/1/comments" )
			.expect( 200 )
			.then( ( { body } )=> {
        expect( body.comments ).toBeSorted( "created_at" , { descending : true } ) ;
			}) ;
    }) ;

    test( "status 404: returned with error message for valid but non-existent id" , () => {
      return request( app )
        .get( "/api/articles/999/comments" )
        .expect( 404 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "article does not exist" ) ;
        }) ;
    }) ;
    test( "status 400: responds with message for invalid article_id" , () => {
      return request( app )
        .get( "/api/articles/not-an-article/comments" )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;
  }) ;









  describe( "POST /api/articles/:article_id/comments" , () => {
    test( "status 201: adds new comment for an existing article_id and sends the details back" , () => {

      const newComment = {
        username: "butter_bridge",
        body: "new comment"
      };
      return request( app )
        .post( "/api/articles/1/comments" )
        .send( newComment )
        .expect( 201 )
        .then( ( { body } ) => {
          expect( body.comment.comment_id )
          .toEqual( expect.any( Number ) ) ;
          expect( body.comment.article_id )
          .toBe( 1 ) ;
          expect( body.comment.author )
          .toBe( "butter_bridge" ) ;
          expect( body.comment.body )
          .toBe( "new comment" ) ;
          expect( body.comment.votes )
          .toBe( 0 ) ;
          expect( body.comment.created_at )
          .toEqual( expect.any( String ) ) ;
        }) ;
    }) ;

    test( "status 404: returned with error message for valid but non-existent article_id" , () => {
      
      const newComment = {
        username: "butter_bridge",
        body: "new comment"
      };
      
      return request( app )
        .post( "/api/articles/999/comments" )
        .send( newComment )
        .expect( 404 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Not found" ) ;
          // .toBe( "article does not exist" )
        }) ;
    }) ;
    
    test( "status 404: returned with error message for valid but non-existent username" , () => {
      
      const newComment = {
        username: "invalid_user",
        body: "new comment"
      };
      
      return request( app )
        .post( "/api/articles/1/comments" )
        .send( newComment )
        .expect( 404 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Not found" ) ;
          // .toBe( "user does not exist" ) ;
        }) ;
    }) ;

    test( "status 400: responds with message for invalid article_id" , () => {

      const newComment = {
        username: "butter_bridge",
        body: "new comment"
      };

      return request( app )
        .post( "/api/articles/not-an-article/comments" )
        .send( newComment )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;

    test( "status 400: responds with message for missing username values" , () => {

      const newComment = {
        body: "newComment"
      };

      return request( app )
        .post( "/api/articles/1/comments" )
        .send( newComment )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;

    test( "status 400: responds with message for missing body values" , () => {

      const newComment = {
        username: "butter_bridge"
      };

      return request( app )
        .post( "/api/articles/1/comments" )
        .send( newComment )
        .expect( 400 )
        .then( ( { body } ) => {
          expect( body.msg )
          .toBe( "Bad request" ) ;
        }) ;
    }) ;

  }) ;

  describe( "GET /api/articles" , () => {

    test( "status 200: should return all article objects in an array of correct length and with correct properties" , () => {
      
      return request( app )
			.get( "/api/articles" )
			.expect( 200 )
			.then( ( { body } )=> {

				expect( body.articles ).toHaveLength( 13 ) ;

				body.articles.forEach( ( article ) => {
					expect( article ).toMatchObject( {
            article_id : expect.any( Number ) ,
            title : expect.any( String ) ,
            topic : expect.any( String ) ,
            author : expect.any( String ) ,
            created_at : expect.any( String ) ,
            votes : expect.any( Number ) ,
            article_img_url : expect.any( String ) ,
            comment_count : expect.any( Number ) 
					}) ;
				}) ;
			}) ;
    }) ;

    test( "status 200: should sort response descending by created_at" , () => {
      
      return request( app )
			.get( "/api/articles" )
			.expect( 200 )
			.then( ( { body } )=> {

        expect( body.articles ).toBeSorted( "created_at" , { descending : true } ) ;
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