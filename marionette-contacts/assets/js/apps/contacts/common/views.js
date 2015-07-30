ContactManager.module('ContactsApp.Common.Views', function(Views, ContactManager, Backbone, Marionette, $, _){
	Views.Form = Marionette.ItemView.extend({
		template: '#contact-form',

		events: {
			'click button.js-submit': 'submitClicked'
		},

		submitClicked: function(e){
			e.preventDefault();
			var data = Backbone.Syphon.serialize(this);
			this.trigger('form:submit', data);
		},

		onRender: function(){
			if(!this.options.asModal){
				var $title = $('<h1>', { text: this.title });
				this.$el.prepend($title);
			}
		},

		onShow: function(){
			if(this.options.asModal){
				this.$el.dialog({
					modal: true,
					title: this.title,
					width: 'auto'
				});
			}
		},

		onFormDataInvalid: function(errors){
			var $view = this.$el;

			var clearFormErrors = function(){
				var $form = $view.find('form');
				$form.find('.error').each(function(){
					$(this).remove();
				});
				$form.find('.form-group.has-error').each(function(){
					$(this).removeClass('has-error');
				});
			}

			var markErrors = function(value, key){
				var $controlGroup = $view.find('#contact-' + key).parent();
				var $errorEl = $('<span>', {class: 'help-block error', text: value});
				$controlGroup.append($errorEl).addClass('has-error');
			}

			clearFormErrors();
			_.each(errors, markErrors);
		}
	});
});