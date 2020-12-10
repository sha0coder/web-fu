/*
	Extending chrome contextmenu functionalities
*/


function get_id_or_name(input) {
	if (input.id)
		if (input.id != '')
			return input.id;

	if (input.name)
		if (input.name != '')
			return input.name;

	return '';
}

document.addEventListener("mousedown", function(event) {
	if (event.button == 2) {
		try { 

			var db = {
				method:'rightClick',
				url:window.location.href,
				inputId:'',
				formId:'',
				action:'',
				value:'',
				cookies:document.cookie
			};

			if (event.target) {
				db.inputId = get_id_or_name(event.target);
				db.value = event.target.value;

				if (event.target.form) {
					db.formId = get_id_or_name(event.target.form);
					db.action = event.target.form.action;
				}
			}

			chrome.extension.sendMessage(db);

			//TODO:  evt.relatedTarget || evt.toElement;
	
		} catch(e) {
			console.log('hook: sendMessage() failed');
		}
	}
}, true);


