'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var connections = require('../../app/controllers/connections.server.controller');

	// Connections Routes
	app.route('/connections')
		.get(connections.list)
		.post(users.requiresLogin, connections.create);

	app.route('/connections/:connectionId')
		.get(connections.read)
		.put(users.requiresLogin, connections.hasAuthorization, connections.update)
		.delete(users.requiresLogin, connections.hasAuthorization, connections.delete);

	// Finish by binding the Connection middleware
	app.param('connectionId', connections.connectionByID);
};
