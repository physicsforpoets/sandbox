ContactManager.module('ContactsApp.List', function(List, ContactManager, Backbone, Marionette, $, _){
	List.Controller = {
		listContacts: function(){
			var loadingView = new ContactManager.Common.Views.Loading();
			ContactManager.regions.main.show(loadingView);

			var fetchingContacts = ContactManager.request('contact:entities');

			// Instantiate List Layout and control panel views

			var contactsListLayout = new List.Layout();
			var contactsListPanel = new List.Panel();

			$.when(fetchingContacts).done(function(contacts){

				var filteredContacts = ContactManager.Entities.FilteredCollection({
					collection: contacts
				});
				
				// Instantiate View

				var contactsListView = new List.Contacts({
					collection: filteredContacts
				});

				// On Layout 'show', attach the Control Panel and List View to the Layout

				contactsListLayout.on('show', function(){
					contactsListLayout.panelRegion.show(contactsListPanel);
					contactsListLayout.contactsRegion.show(contactsListView);
				}); // on show

				// Attach View event listeners

				contactsListPanel.on('contacts:filter', function(filterCriterion){
					filteredContacts.filter(filterCriterion);
				});

				contactsListPanel.on('contact:new', function(){
					var newContact = new ContactManager.Entities.Contact();

					var view = new ContactManager.ContactsApp.New.Contact({
						model: newContact
					});

					view.on('form:submit', function(data){
						if(contacts.length > 0){
							var highestId = contacts.max(function(c){ return c.id; }).get('id');
							data.id = highestId + 1;
						} else {
							data.id = 1;
						}

						if(newContact.save(data)){
							contacts.add(newContact);
							ContactManager.regions.dialog.empty();
							contactsListView.children.findByModel(newContact).flash('success');
						} else {
							view.triggerMethod('form:data:invalid', newContact.validationError);
						}
					});

					ContactManager.regions.dialog.show(view);
				}); // on contact:new

				contactsListView.on('childview:contact:show', function(childView, args){
					ContactManager.trigger('contact:show', args.model.get('id'));
				}); // on childview:contact:show

				contactsListView.on('childview:contact:edit', function(childView, args){
					var model = args.model;

					// Create Edit modal
					var view = new ContactManager.ContactsApp.Edit.Contact({
						model: model
					});

					// Attach model View events
					view.on('form:submit', function(data){
						if(model.save(data)){
							childView.render();
							ContactManager.regions.dialog.empty();
							childView.flash('success');
						} else {
							view.triggerMethod('form:data:invalid', model.validationError);
						}
					});

					// display modal
					ContactManager.regions.dialog.show(view);
				});

				contactsListView.on('childview:contact:delete', function(childView, args){
					args.model.destroy();
				}); // on childview:contact:delete

				ContactManager.regions.main.show(contactsListLayout);
			}); // childview:contact:edit
		}
	}
});