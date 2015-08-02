'use strict';

//Setting up route
angular.module('connections').config(['$stateProvider',
	function($stateProvider) {
		// Connections state routing
		$stateProvider.
		state('listConnections', {
			url: '/connections',
			templateUrl: 'modules/connections/views/list-connections.client.view.html'
		}).
		state('createConnection', {
			url: '/connections/create',
			templateUrl: 'modules/connections/views/create-connection.client.view.html'
		}).
		state('viewConnection', {
			url: '/connections/:connectionId',
			templateUrl: 'modules/connections/views/view-connection.client.view.html'
		}).
		state('editConnection', {
			url: '/connections/:connectionId/edit',
			templateUrl: 'modules/connections/views/edit-connection.client.view.html'
		});
	}
]);