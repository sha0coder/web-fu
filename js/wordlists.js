/*
	Wordslits Pannel
	@sha0coder
*/

(function() {

	wordlists = {
		out: {},
		add: null,
		files: null,
		btn: {}
	};

	wordlists._refreshMenus = function() {
		chrome.extension.sendMessage({method: "refreshMenus"});
	};

	wordlists.list = function() {
		wordlists.out.def.value = wls.getDef().toString();
		wordlists.out.user.value = wls.getUser().toString();
	};

	wordlists.loadObjects = function() {
		wordlists.out.def = document.getElementById('txtDefaultWordlists');
		wordlists.out.user = document.getElementById('txtUserWordlists');
		wordlists.btn.del = document.getElementById('btnDeleteWordlists');
		wordlists.btn.add = document.getElementById('btnAddWordlist');
		wordlists.add = document.getElementById('txtAddWordlist');
		//wordlists.files = document.getElementById('files');
	};

	//unused
	wordlists.loadFiles = function(evt) {
		var files = evt.target.files; 

        	for (var i = 0, f; f = files[i]; i++) {
			alert(f.path);
			alert(f.value);

          		var reader = new FileReader();
          
			reader.onload = (function(theFile) {
				return function(e) {
					alert(e.target.result);
				};
			})(f);

			reader.readAsText(f,'UTF-8');
		}

	};

	wordlists.initEvents = function() {
		wordlists.btn.del.onclick = function() {
			wls.del();
			wordlists._refreshMenus();
			wordlists.list();
		};
		wordlists.btn.add.onclick = function() {
			var file = wordlists.add.value;
			wls.add(file.trim());
			wordlists.add.value = '';

			wordlists._refreshMenus();
			wordlists.list();
		};
		//wordlists.files.addEventListener('change', wordlists.loadFiles, false);
	};

	wordlists.init = function() {
		wordlists.loadObjects();
		wordlists.initEvents();
		wordlists.list();
	};

 })();

wordlists.init()
