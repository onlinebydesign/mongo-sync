'use strict';

// Connections controller
angular.module('connections').controller('ConnectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Connections',
	function($scope, $stateParams, $location, Authentication, Connections) {
		$scope.authentication = Authentication;

		// Create new Connection
		$scope.create = function() {
			// Create new Connection object
			var connection = new Connections ({
				name: this.name
			});

			// Redirect after save
			connection.$save(function(response) {
				$location.path('connections/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Connection
		$scope.remove = function(connection) {
			if ( connection ) { 
				connection.$remove();

				for (var i in $scope.connections) {
					if ($scope.connections [i] === connection) {
						$scope.connections.splice(i, 1);
					}
				}
			} else {
				$scope.connection.$remove(function() {
					$location.path('connections');
				});
			}
		};

		// Update existing Connection
		$scope.update = function() {
			var connection = $scope.connection;

			connection.$update(function() {
				$location.path('connections/' + connection._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Connections
		$scope.find = function() {
			$scope.connections = Connections.query();
		};

		// Find existing Connection
		$scope.findOne = function() {
			$scope.connection = Connections.get({ 
				connectionId: $stateParams.connectionId
			});
		};
	}
]);