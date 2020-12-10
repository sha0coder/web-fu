//sha0()badchecksum.net

function AttackHelper () {
    this.running = false;
    this.debug = true;
    this.module = '';
    this.divContent = '';
    this.div = null;
}

AttackHelper.prototype = {

    setModule: function(module) {
        this.module = module;
    },

    dbg: function(msg) {
        if (this.debug)
            console.log(msg);
    },

    string2array: function(str) {
        var items = [];
        if (!str)
            return items;

        str += '|||';
        var spl = str.split('|||');
        for (var i=0; i<spl.length-1; i++) {
            items.push(spl[i]);
        }

        return items; 
    },

    arr2string: function(arr) {
        return arr.join('|||'); //wrapper
    },

    xssSafe: function(data) {
        return data.replace(/script/g,'scr&#105pt').replace(/\(/g,'&#40;').replace(/\)/g,'&#41;').replace(/\{/g,'&#123;').replace(/\}/g,'&#125;').replace(/%27/g,'&#39;').replace(/%22/g,'&#34;').replace(/'/g,'&#39;').replace(/"/g,'&#34;').replace(/%3c/g,'&#60;').replace(/%3e/g,'&#62;').replace(/</g,'&#60;').replace(/>/g,'&#62;').replace(/%/g,'&#37;');
    },

    getPre: function(url) {
        url = this.xssSafe(url);
        return '<pre>'+url+'</pre>';
    },

    gct: function(txt,color) {
        return '<font color="'+color+'">'+txt+'</font>';
    },

    getColoredText: function(txt,color) {
        return '<font color="'+color+'">'+txt+'</font>';
    },

    getLink2: function(link,txt) {
        return '<a target="_blank" href="'+this.xssSafe(link)+'">'+txt+'</a>';
    },

    getLink: function(url,color) {
        url = this.xssSafe(url).replace('\n','');
        return '<a target="_blank" href="'+url+'"><font color="'+color+'">'+url+'</font></a>';
    },

    write: function(msg) {
        document.write(msg+'<br>');
    },

    table: function() {
        this.divWrite('<table>');
    },

    endTable: function() {
        this.divWrite('</table>');
    },

    divClean: function() {
        this.div.innerHTML = '';
        this.divContent = '';
    },

    addRow: function(id,code,lines,words,bytes,url) {
        var row = '<tr>';
        row += '<td>'+id+'</td>';
        row += '<td>'+code+'</td>';
        row += '<td>'+lines+'</td>';
        row += '<td>'+words+'</td>';
        row += '<td>'+bytes+'</td>';
        url = 'lala';
        row += '<td><pre>'+url+'</pre></td>';
        row += '</tr>';
        this.divWrite(row);
        //this.div.innerHTML += '</table>';
    },

    divWrite: function(msg) {
        this.divContent += msg+'<br>\n';
        this.div.innerHTML = this.divContent;
    },

    sleep: function(millis) {
        var date = new Date();
        var curDate = null;
        do {
            curDate = new Date();
        } while(curDate-date < millis);
    },

    asyncHTTP: function(id, url, callback, post, user, password) {
        var request = new XMLHttpRequest();
        
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                callback({'id':id, 'url':url,'stat':request.readyState, 'code':request.status, 'data':request.responseText});
            }
        }
        request.onerror = function () {
            callback({'id':id, 'url':url,'stat':-1, 'code':404, 'data':''}); //TODO: err siempre es 404??
        }

        if (user && password)
            request.open('GET',url,true,user,password);
        else
            request.open('GET', url, true);

        if (post && post != '')
            request.send(post);
        else
            request.send();
    },

    syncHTTP: function(url) {
        var request = new XMLHttpRequest();
        try {
            request.open('GET', url, false);
            request.send();
            return {'url':url,'stat':request.readyState, 'code':request.status, 'data':request.responseText};
        } catch (e) {
            return {'url':url,'stat':0, 'code':404, 'data':''};
        }
    },

    asyncLoadFile: function(file, callback) {
        var reader = new FileReader();

        this.dbg('loading file '+file);

        reader.onload = function(e) {
            this.dbg('loaded!!!');
            callback(e.target.result);
        };

        reader.onerror = function(stuff) {
            this.dbg("error loading file "+stuff);
            this.dbg(stuff.getMessage());
        };

        var content = reader.readAsText(file);
    },

    loadWordlist: function(wl_url, callback) {
        this.dbg(wl_url);
        var resp = this.syncHTTP(wl_url);
        this.dbg(resp.data);
        callback(resp.data);
    },

    loadWordlist2: function(wl_url_u, wl_url_p) {
        var resp = this.syncHTTP(wl_url_u);
        this.wordlist = resp.data;
        resp = this.syncHTTP(wl_url_p);
        this.wordlist2 = resp.data;
    },

    finishStats: function(out, startTime, endTime, words) { //TODO: retornarlo como string o sacarlo en pop-up
        var seconds = (endTime.getTime()-startTime.getTime())/1000;
        //var out = OUT();

        if (seconds<60)
            out.addStats('Scan ended in '+seconds+' seconds.');

        else if ((seconds/60) < 60)
            out.addStats('Scan finished in '+(seconds/60)+' minutes.');

        else if ((seconds/60/60) < 24)
            out.addStats('Scan finished in '+(seconds/60/60)+' hours.');

        else
            out.addStats('Scan finished in '+(seconds/60/60/24)+' days.');

        out.addStats('Speed: '+(words/seconds)+' words per seccond.');
    },

    get_id_or_name: function(input) {
        if (input.id)
            if (input.id != '')
                return input.id;

        return input.name;
    },

    setFavicon: function(icon) {
        var link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = icon;
        document.getElementsByTagName('head')[0].appendChild(link);
    },

    submitLookup: function(f) {
        //var f = this.get_id_or_name(targets[0].form); //TODO: ¿?check si el form de un campo y de otro varian alertar
        //this.dbg('selected form: '+f);
        for (var e=0; e<document.forms[f].elements.length; e++) {
            if (document.forms[f].elements[e].type == 'submit') {
                return   document.forms[f].elements[e].id;
            } 
        }
    },

    selectedForm_old: function() {
        var f_target  = -1;
        var e_user = -1;
        var e_pass = -1;
        var e_submit = -1;

        for (var f=0; f<document.forms.length; f++) {
            for (var e=0; e<document.forms[f].elements.length; e++) {

                value = document.forms[f].elements[e].value;

                if (value == 'U') {
                    e_user = e;
                    f_target = f;

                } else if (value == 'P') {
                    e_pass = e;
                    f_target = f;

                } else if (document.forms[f].elements[e].type == 'submit') {
                    e_submit = e;
                }

                if (e_user != -1 && e_pass != -1 && e_submit != -1)
                    return {'frm':f_target, 'user':e_user, 'pass':e_pass, 'submit':e_submit};
            }
        }

        return {'frm':f_target, 'user':e_user, 'pass':e_pass, 'submit':e_submit};
    },

    form2post: function() {
        var t = this.selectedForm();

        if (t.frm == -1 || t.user == -1 || t.pass == -1) {
            alert('Attack Vector not detected!! put U on the user field and P on the password field.');
            return '';
        }

        var post = '';
        for (var e=0; e<document.forms[t.frm].elements.length; e++) {
            var id = (document.forms[t.frm].elements[e].name == ''?document.forms[t.frm].elements[e].id:document.forms[t.frm].elements[e].name);
            var value = document.forms[t.frm].elements[e].value;
            if (!value)
                value = '';

            if (e == t.user) {
                post += id+'=#USER#&';

            } else if (e == t.pass) {
                post += id+'=#PASS#&';

            } else {
                if (id != '')
                    post += id+'='+value+'&';
            }
        }

        return post;
    },

    start: function() {
        this.running = true;
        //this.setFavicon('img/nuke_48.png');
        //document.title = 'Running '+this.module;
        chrome.extension.sendMessage({'method':'attackRunning','module':this.module});
        this.divContent = '';
        this.div = document.getElementById('divHeader'); //TODO: eliminar, ahora esto se hace con out()
    },

    end: function() {
        this.running = false;
        //document.title = 'Finished '+this.module;
        chrome.extension.sendMessage({'method':'attackFinished','module':this.module});
    }
}



/* CODE TRACING */

function Trace() {
    this.state = '';
    this.debug = true;
}

Trace.prototype = {

    show: function() {
        console.log(this.state);
        return 1;
    },

    log: function(msg) {
        this.state = msg;
        if (this.debug)
            this.show();
    },

};

