/* global s */
/*jshint maxcomplexity:false */
ShoanyApp.module('Track.OmniTrack', function(OmniTrack){
	'use strict';

	var varMap = {
			accountType: 'eVar13',
			appVersion: 'eVar26',
			assetId: 'eVar14', // title refID
			authStatus: 'eVar3', // Authenticated / Unauthenticated
			channel: 'eVar22',
			channelSection: 'eVar2', // [Channel] | [Section]
			linearTitleVersion: 'eVar23',
			loggedIn: 'eVar15', // true / false
			mediaTitle: 'eVar1',
			mediaType: 'eVar5', // vod / linear
			mso: 'eVar17',
			msoUserId: 'eVar16',
			pageName: 'eVar20',
			program: 'eVar11',
			registrationDate: 'eVar24',
			tveUserId: 'eVar8',
			visitorId: 'eVar19'
		},
		eventMap = {
			authFail: 'event13',
			login: 'event12',
			pageLoad: 'event3',
			pcPromt: 'event14',
			registrationComplete: 'event18',
			registrationStart: 'event15'
		};

	var vars = {},
		events = {};

});