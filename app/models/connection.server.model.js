'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Connection Schema
 */
var ConnectionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Connection name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    sourceSSHConnection: String,
    destinationSSHConnection: String,
    sourceMongoConnection: {
        type: String,
        require: 'Please fill Source Mongo Connection string'
    },
    destinationMongoConnection: {
        type: String,
        require: 'Please fill Destination Mongo Connection string'
    },
    operations: {
        type: String,
        default: 'iud',
        require: 'Please fill allowed CRUD operations (i=insert, u=update, d=delete)'
    },
    sync: {
        type: Boolean,
        default: true
    },
    paths: {
        type: Schema.Types.Mixed,
        required: 'Please fill path(s) in this format: ["database.collection"]'
    },
    overrideName: String, // The name of the variable to check for overriding all operations
    lastoplog: Number

});

mongoose.model('Connection', ConnectionSchema);