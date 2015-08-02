'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Connection = mongoose.model('Connection'),
	_ = require('lodash');

/**
 * Create a Connection
 */
exports.create = function(req, res) {
	var connection = new Connection(req.body);
	connection.user = req.user;

	connection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(connection);
		}
	});
};

/**
 * Show the current Connection
 */
exports.read = function(req, res) {
	res.jsonp(req.connection);
};

/**
 * Update a Connection
 */
exports.update = function(req, res) {
	var connection = req.connection ;

	connection = _.extend(connection , req.body);

	connection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(connection);
		}
	});
};

/**
 * Delete an Connection
 */
exports.delete = function(req, res) {
	var connection = req.connection ;

	connection.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(connection);
		}
	});
};

/**
 * List of Connections
 */
exports.list = function(req, res) { 
	Connection.find().sort('-created').populate('user', 'displayName').exec(function(err, connections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(connections);
		}
	});
};

/**
 * Connection middleware
 */
exports.connectionByID = function(req, res, next, id) { 
	Connection.findById(id).populate('user', 'displayName').exec(function(err, connection) {
		if (err) return next(err);
		if (! connection) return next(new Error('Failed to load Connection ' + id));
		req.connection = connection ;
		next();
	});
};

/**
 * Connection authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.connection.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
