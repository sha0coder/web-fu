/*
	Web-Fu
	sha0()badchecksum.net

	gauss
*/

(function() {
	gauss = {};
	gauss.vector = [];
	gauss.normal = [];
	gauss.err = [];

	gauss.clear = function(obj) {
		gauss.vector = [];
		gauss.normal = [];
		gauss.err = [];
	}

	gauss.add = function(obj) {
		gauss.vector = gauss.vector.concat(obj);
	};

	gauss.mean = function() {
		var sum=0;
		for (var i=gauss.vector.length-1; i>=0; --i) {
			sum += gauss.vector[i];
		}
		return sum/gauss.vector.length;
	};
	
	gauss.stderr = function() {
		var sum = 0;
		var mean = gauss.mean();
		for (var i=gauss.vector.length-1; i>=0; --i) {
			sum += Math.pow((gauss.vector[i]-mean),2);
		}

		return Math.sqrt(sum/(gauss.vector.length-1));
	};

	gauss.classify = function() {
		var stderr = gauss.stderr();
		var mean = gauss.mean();
		console.log('err: '+stderr);

		for (var i=0; i<gauss.vector.length; ++i) {
			var d = Math.abs(gauss.vector[i]-mean);

			if (d>stderr) {
				console.log('suspicious: '+i+' '+gauss.vector[i]+' d:'+d);
				gauss.err.push(i);
			} else
				gauss.normal.push(i);
		}
	};

})();

