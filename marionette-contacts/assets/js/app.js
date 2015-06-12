var ContactManager = new Marionette.Application();

ContactManager.navigate = function(route, options){
	options || (options = {});
	Backbone.history.navigate(route, options);
};

ContactManager.getCurrentRoute = function(){
	return Backbone.history.fragment;
}

ContactManager.on('before:start', function(){
	var RegionContainer = Marionette.LayoutView.extend({
		el: '#app-container',

		regions: {
			main: '#main-region'
		}
	});

	ContactManager.regions = new RegionContainer();
});

ContactManager.on('start', function(){
	if(Backbone.history){
		Backbone.history.start();

		if(Backbone.history.fragment === ''){
			ContactManager.trigger('contacts:list');
		}
	}
});