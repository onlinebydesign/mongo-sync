'use strict';

(function() {
	// Connections Controller Spec
	describe('Connections Controller Tests', function() {
		// Initialize global variables
		var ConnectionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Connections controller.
			ConnectionsController = $controller('ConnectionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Connection object fetched from XHR', inject(function(Connections) {
			// Create sample Connection using the Connections service
			var sampleConnection = new Connections({
				name: 'New Connection'
			});

			// Create a sample Connections array that includes the new Connection
			var sampleConnections = [sampleConnection];

			// Set GET response
			$httpBackend.expectGET('connections').respond(sampleConnections);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.connections).toEqualData(sampleConnections);
		}));

		it('$scope.findOne() should create an array with one Connection object fetched from XHR using a connectionId URL parameter', inject(function(Connections) {
			// Define a sample Connection object
			var sampleConnection = new Connections({
				name: 'New Connection'
			});

			// Set the URL parameter
			$stateParams.connectionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/connections\/([0-9a-fA-F]{24})$/).respond(sampleConnection);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.connection).toEqualData(sampleConnection);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Connections) {
			// Create a sample Connection object
			var sampleConnectionPostData = new Connections({
				name: 'New Connection'
			});

			// Create a sample Connection response
			var sampleConnectionResponse = new Connections({
				_id: '525cf20451979dea2c000001',
				name: 'New Connection'
			});

			// Fixture mock form input values
			scope.name = 'New Connection';

			// Set POST response
			$httpBackend.expectPOST('connections', sampleConnectionPostData).respond(sampleConnectionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Connection was created
			expect($location.path()).toBe('/connections/' + sampleConnectionResponse._id);
		}));

		it('$scope.update() should update a valid Connection', inject(function(Connections) {
			// Define a sample Connection put data
			var sampleConnectionPutData = new Connections({
				_id: '525cf20451979dea2c000001',
				name: 'New Connection'
			});

			// Mock Connection in scope
			scope.connection = sampleConnectionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/connections\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/connections/' + sampleConnectionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid connectionId and remove the Connection from the scope', inject(function(Connections) {
			// Create new Connection object
			var sampleConnection = new Connections({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Connections array and include the Connection
			scope.connections = [sampleConnection];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/connections\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleConnection);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.connections.length).toBe(0);
		}));
	});
}());