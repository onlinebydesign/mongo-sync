'use strict';

// Configuring the Articles module
angular.module('connections').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Connections', 'connections', 'dropdown', '/connections(/create)?');
		Menus.addSubMenuItem('topbar', 'connections', 'List Connections', 'connections');
		Menus.addSubMenuItem('topbar', 'connections', 'New Connection', 'connections/create');
	}
]);