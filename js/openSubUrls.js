
(function() {

	var url = window.location.href;
	var parts = url.split('/');

 	for (var i = parts.length-1; i>1; i--) {
        var newUrl = '';

        for (var j=0; j<i; j++) {
            newUrl += parts[j] + '/';
        }

        window.open(newUrl);
	}

})();