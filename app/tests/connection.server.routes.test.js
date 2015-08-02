'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Connection = mongoose.model('Connection'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, connection;

/**
 * Connection routes tests
 */
describe('Connection CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Connection
		user.save(function() {
			connection = {
				name: 'Connection Name'
			};

			done();
		});
	});

	it('should be able to save Connection instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Connection
				agent.post('/connections')
					.send(connection)
					.expect(200)
					.end(function(connectionSaveErr, connectionSaveRes) {
						// Handle Connection save error
						if (connectionSaveErr) done(connectionSaveErr);

						// Get a list of Connections
						agent.get('/connections')
							.end(function(connectionsGetErr, connectionsGetRes) {
								// Handle Connection save error
								if (connectionsGetErr) done(connectionsGetErr);

								// Get Connections list
								var connections = connectionsGetRes.body;

								// Set assertions
								(connections[0].user._id).should.equal(userId);
								(connections[0].name).should.match('Connection Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Connection instance if not logged in', function(done) {
		agent.post('/connections')
			.send(connection)
			.expect(401)
			.end(function(connectionSaveErr, connectionSaveRes) {
				// Call the assertion callback
				done(connectionSaveErr);
			});
	});

	it('should not be able to save Connection instance if no name is provided', function(done) {
		// Invalidate name field
		connection.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Connection
				agent.post('/connections')
					.send(connection)
					.expect(400)
					.end(function(connectionSaveErr, connectionSaveRes) {
						// Set message assertion
						(connectionSaveRes.body.message).should.match('Please fill Connection name');
						
						// Handle Connection save error
						done(connectionSaveErr);
					});
			});
	});

	it('should be able to update Connection instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Connection
				agent.post('/connections')
					.send(connection)
					.expect(200)
					.end(function(connectionSaveErr, connectionSaveRes) {
						// Handle Connection save error
						if (connectionSaveErr) done(connectionSaveErr);

						// Update Connection name
						connection.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Connection
						agent.put('/connections/' + connectionSaveRes.body._id)
							.send(connection)
							.expect(200)
							.end(function(connectionUpdateErr, connectionUpdateRes) {
								// Handle Connection update error
								if (connectionUpdateErr) done(connectionUpdateErr);

								// Set assertions
								(connectionUpdateRes.body._id).should.equal(connectionSaveRes.body._id);
								(connectionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Connections if not signed in', function(done) {
		// Create new Connection model instance
		var connectionObj = new Connection(connection);

		// Save the Connection
		connectionObj.save(function() {
			// Request Connections
			request(app).get('/connections')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Connection if not signed in', function(done) {
		// Create new Connection model instance
		var connectionObj = new Connection(connection);

		// Save the Connection
		connectionObj.save(function() {
			request(app).get('/connections/' + connectionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', connection.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Connection instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Connection
				agent.post('/connections')
					.send(connection)
					.expect(200)
					.end(function(connectionSaveErr, connectionSaveRes) {
						// Handle Connection save error
						if (connectionSaveErr) done(connectionSaveErr);

						// Delete existing Connection
						agent.delete('/connections/' + connectionSaveRes.body._id)
							.send(connection)
							.expect(200)
							.end(function(connectionDeleteErr, connectionDeleteRes) {
								// Handle Connection error error
								if (connectionDeleteErr) done(connectionDeleteErr);

								// Set assertions
								(connectionDeleteRes.body._id).should.equal(connectionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Connection instance if not signed in', function(done) {
		// Set Connection user 
		connection.user = user;

		// Create new Connection model instance
		var connectionObj = new Connection(connection);

		// Save the Connection
		connectionObj.save(function() {
			// Try deleting Connection
			request(app).delete('/connections/' + connectionObj._id)
			.expect(401)
			.end(function(connectionDeleteErr, connectionDeleteRes) {
				// Set message assertion
				(connectionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Connection error error
				done(connectionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Connection.remove().exec();
		done();
	});
});