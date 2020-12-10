(function() {

	colors = {
		naranja: 'ffff00',
		cyan: '00ffff',
		dark:'000000',
		white:'ffffff',
		green:'34ff0c', 
		orange:'ffae00', 
		red:'ed0e0e', 
	};

	colors.byCode = {
		'2':'34ff0c', //ok verde
        '3':'ffae00', //redirection naranja 
        '4':'ed0e0e', //no access rojo
        '5':'ed0e0e'
	};

	colors.code2color = function(code) {
		return colors.byCode[Math.round(code/100,1)];
	};

})();
