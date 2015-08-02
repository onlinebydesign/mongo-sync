'use strict';

//Connections service used to communicate Connections REST endpoints
angular.module('connections').factory('Connections', ['$resource',
	function($resource) {
		return $resource('connections/:connectionId', { connectionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);