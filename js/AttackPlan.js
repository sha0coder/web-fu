/*
	sha0()badchecksum.net

	ATTACK PLAN
	
	{
		url: 'http://www.test.com',
		module: 'formBrute',
		vector: 'btnSubmit',
		settings: {
			superSpeed: true,
			autoScroll: true,
			showResponses: false,
			attackDelay: 3000,
		},
		wordlists: [],
		targets: [
			{
				form: 'frmLogin', 
				action: '',
				field: 'txtUser',
				value: 'pepito',
				wordlist: '/path/wordlist',
				words: '['a','b','c',...]'
			},
			{
				form: 'frmLogin', 
				action: '',
				field: 'txtPass',
				value: '',
				wordlist: '/path/wordlist',
				words: ['a','b','c',...]
			}
		],
	}



*/

function AttackPlan() {
	this.attacks = [
		{'module':'frmBrute', 	'title':'Form Bruteforce', 'newTab':true},
		{'module':'formBruteV', 'title':'Form Visual Bruteforce', 'newTab':false},
		{'module':'formFuzz', 	'title':'Form Bruter', 'newTab':true},
		{'module':'urlBrute', 	'title':'Url Bruter', 'newTab':true},
		{'module':'urlAnalyze', 'title':'Url Analyzer', 'newTab':true},
		{'module':'dirScan', 	'title':'Directory Scanner', 'newTab':true},
		{'module':'AuthCrack', 	'title':'HTTP Auth Cracker', 'newTab':true},
		{'module':'build', 		'title':'Build', 'newTab':true},
		{'module':'portscan', 	'title':'PortScan', 'newTab':true},
	];

	this.db = {
		targets:[], 
		wordlists:[],
		url:'', 
		module:'', 
		vector:'', 
		settings: {
			superSpeed: true,
			autoScroll: true,
			showResponses: false,
			attackDelay: 0,
		}
	};

	console.log('AttackPlan object created');
}

AttackPlan.prototype = {

	setModule: function(mod) {
		for (var i=0; i<this.attacks.length; i++) {
			if (mod === this.attacks[i].module) {
				this.db.module = mod;
				return true;
			}
		}
		return false;
	},

	/*
		The vectorAttack, is the form button to fuzz (if undefined, seek the submit one)
	*/

	setWordlists: function(wl) {
		this.db.wordlists = wl;
	},

	setAttackVector: function(vector) {
		this.db.vector = vector;
	},
	
	getNumTargets: function() {
		return this.db.targets.length;
	},

	getModule: function() {
		return this.db.module;
	},

	setUrl: function(url) {
		this.db.url = url; //TODO: validar
	},

	addTarget: function(t,wl) {
		//field,form,value

		var wordlist = '';
		if (typeof wl != "undefined") {
			if (wls.def.exists(wl))
				wordlist = chrome.extension.getURL('wl/'+wl);
			else
				wordlist = 'file://'+wl;
		}

		this.db.targets.push({
			form: t.form,
			action: t.action,
			field: t.field,
			value: t.value,
			wordlist: wordlist,
			words: [],
		});
	},

	forEachTarget: function(callback) {
		if (this.db.targets.length==0)
			return;
	
		this.db.targets.forEach(function(t) {
			callback(t.id, t.wordlist);
		});
	},

	clean: function() {
		this.db.targets=[];
		this.db.url='';
		this.db.module='';
	},

	isNewTab: function() {
		var mod = this.db.module;
		for (var i=0; i<this.attacks.length; i++)
			if (this.attacks[i].module == this.db.module)
				return this.attacks[i].newTab;
		return false;
	},

	getTitle: function(module) {
		this.attacks.forEach(function(a) {
			if (a.module == module)
				return a.title;
		});
		return '';
	},

	displayTargets: function() {
		var msg = '';
		this.db.targets.forEach(function(t) {
			msg += (t.id?t.id+': ':'')+t.wl+'\n ';
		});
		var display = webkitNotifications.createNotification('img/nuke_48.png','Selected wordlists',msg);
		display.onclick = function() {
			display.close();
		}
		display.show();
	},

	getDB: function() {
		return this.db; //you must use JSON.stringify to conver to string the db.
	}, 

	setDB: function(json) {
		this.db = json;
	},

	setStringDB: function(str_json) {
		//eval('this.db = '+str_json);
	}
};

