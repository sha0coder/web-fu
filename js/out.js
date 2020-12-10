/*	
	Web-Fu
	out, the output data interface

	sha0()badchecksum.net
*/

(function() {
	
	out = {
		table: {},
		divHeader: document.getElementById('divHeader'),
		tblData: document.getElementById('tblData'),
		divStats: document.getElementById('divStats'),
		txtUrl: document.getElementById('txtUrl'),
		txtPost: document.getElementById('txtPost'),
		divProgress: document.getElementById('divProgress')
	};

	if (!out.divHeader || !out.tblData || !out.divStats || !out.txtUrl)
		alert('out() init failure.');


	Array.prototype.exists = function(item) {
		for (var i=this.length-1; i>=0; --i)
 			if (this[i] == item)
 				return true;
		return false;
	};

	out.getUrl = function() {
		return out.txtUrl.value;
	};

	out.setUrl = function(url) {
		out.txtUrl.value = url;
	};

	out.setPost = function(post) {
		out.txtPost.value = post;
	},

	out.getPost = function() {
		return out.txtPost.value;
	},

	out.add =  function(data,div) {
		div.innerHTML += data;
	};

	out.addHeader = function(data) {
		out.divHeader.innerHTML += data+'<br>';
	};

	out.clearHeader = function() {
		out.divHeader.innerHTML = '';
	};

	out.table.addRow = function(code,lines,words,bytes,url) {
		var tr = out.tblData.insertRow(-1);
		var td = [];

		for (var i=0; i<5; i++)
			td[i] = tr.insertCell(i);

		td[0].innerHTML = code;
		td[1].innerText = lines;
		td[2].innerText = words;
		td[3].innerText = bytes;
		td[4].innerHTML = url;
	};

	out.table.del = function() {
		while (out.tblData.hasChildNodes()) {
   			out.tblData.removeChild(out.tblData.firstChild);
		}
	};

	out.table.clear = function() {
		while (out.tblData.hasChildNodes()) {
   			out.tblData.removeChild(out.tblData.firstChild);
		}
	};

	out.addStats = function(data) {
		out.divStats.innerHTML += data+'<br>';
	};

	out.clearStats = function() {
    	out.divStats.innerHTML = '';	
    };

	out.xssSafe = function(data) {
        return data.replace(/script/g,'scr&#105pt').replace(/\(/g,'&#40;').replace(/\)/g,'&#41;').replace(/\{/g,'&#123;').replace(/\}/g,'&#125;').replace(/%27/g,'&#39;').replace(/%22/g,'&#34;').replace(/'/g,'&#39;').replace(/"/g,'&#34;').replace(/%3c/g,'&#60;').replace(/%3e/g,'&#62;').replace(/</g,'&#60;').replace(/>/g,'&#62;').replace(/%/g,'&#37;');
    };

    out.getPre = function(url) {
        url = this.xssSafe(url);
        return '<pre>'+url+'</pre>';
    };

    out.gct = function(txt,color) {
        return '<font color="'+color+'">'+txt+'</font>';
    };

    out.getColoredText = function(txt,color) {
        return '<font color="'+color+'">'+txt+'</font>';
    };

    out.getLink2 = function(link,txt) {
        return '<a target="_blank" href="'+out.xssSafe(link)+'">'+txt+'</a>';
    };

    out.getLink = function(url,color) {
        url = out.xssSafe(url).replace('\n','');
        return '<a target="_blank" href="'+url+'"><font color="'+color+'">'+url+'</font></a>';
    };



    out.finishStats = function(startTime, endTime, words) {
    	//TODO: retornarlo como string o sacarlo en pop-up
        
        var seconds = (endTime.getTime()-startTime.getTime())/1000;

        if (seconds<60)
            out.addStats('Scan ended in '+seconds+' seconds.');

        else if ((seconds/60) < 60)
            out.addStats('Scan finished in '+(seconds/60)+' minutes.');

        else if ((seconds/60/60) < 24)
            out.addStats('Scan finished in '+(seconds/60/60)+' hours.');

        else
            out.addStats('Scan finished in '+(seconds/60/60/24)+' days.');

        out.addStats('Speed: '+(words/seconds)+' words per seccond.');
    };

    out.setProgress = function(p) {
    	out.divProgress.innerHTML = p;
    };

})();

