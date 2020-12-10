/*
	by sha0()badchecksum.net
	Attack API!!

	TODO:
		- pasive scanner
		- multi wordlist loader (bi-dimensional array)
*/

// Attack db




// Attack db Helpers


/*
function serializeAttackPlan(attackPlan) {
	var aplan =  "var attackPlan = {'wordlists':[";
	
	for (var i=0; i<attackPlan.wordlists.length; i++)
		aplan += attackPlan.wordlists[i]+',';
	
	aplan[aplan.length-1] = "]";
	aplan += ",'url':"+(attackPlan.url?"'"+attackPlan.url+"'":"null");
	aplan += ",'target':"+(attackPlan.target?"'"+attackPlan.target+"'":"null");
	aplan += ",'module':'"+attackPlan.module+"'};";
	alert(aplan);
	return aplan;
}*/

// Inject the attack to a tab

function doAttack(attackPlan) {
	
	//chrome.contextMenus.removeAll();
	var module = "/html/attacks/"+attackPlan.getModule()+".html";

	console.log('module:'+module);

	if (attackPlan.isNewTab()) {
		chrome.tabs.create({'url':module,'active':true,'pinned':false});

	} else {
		var ap = attackPlan.getDB();

		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.executeScript(tab.id, {file: '/js/attacks/AttackHelper.js'}, function () {
				chrome.tabs.executeScript(tab.id, {file: '/js/attacks/'+ap.module+'.js'}, function() {
					//chrome.tabs.sendMessage(tab.id, {'method':'run','module':ap.module,'attackPlan':ap,'wordlist1':wordlist1, 'wordlist2':wordlist2});
	            	//attackPlan.clean();
	            });	
			});
		});
	}
}

// Waiting for finished attacks
