


(function() {

	notes = {
		savefreq: 2000,
		interval: null,


		start: function() {
			notes.interval = setInterval(function() {notes.save()}, notes.savefreq);
			o('btnClear').click(notes.clear);
			o('btnClose').click(notes.end);
			notes.sync();
		},

		end: function() {
			notes.save();
			clearInterval(notes.interval);
			window.close();
		},

		sync: function() {
			o('editor').set(storage.get('notes',''));
		},

		save: function() {
			storage.set('notes',o('editor').get());
			//console.log('saved.');
		},

		clear: function() {
			storage.set('notes','');
			notes.sync();
		},

	};


	notes.start();

})();
