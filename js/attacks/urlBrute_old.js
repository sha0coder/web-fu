//sha0()badchecksum.net
//TODO: utilizar sistema experto
//TODO: soportar las custom wordlists.
//TODO: 



(function() {
    ap = {};
    urlBrute = {
        name: 'urlBrute',
        total: 0,
        isPost: false,
        progress: 0,
        startTime: null,
        endTime: null,
        attacks: {
            urls: [],
            resp: []
        },
        finished: false
    };
   
    urlBrute.init = function() {
        o('btnStart').hide();
        o('btnFalsePositive').hide();

        o('btnRender').click(urlBrute.render);
        o('btnStart').click(urlBrute.start);
        o('btnFalsePositive').click(urlBrute.fpReductor);
        o('fWordlist').change(urlBrute.onNewFileSelected);
        o('selWordlist').change(urlBrute.onFileSelected);

        urlBrute.commInit();
    };

    urlBrute.commInit = function() {
        chrome.extension.sendMessage({method:'attackReady',module: urlBrute.name}, urlBrute.comm);
    };

    urlBrute.comm = function(msg) {
        if (msg.method == 'run') {
            if (msg.module == urlBrute.name) {
                ap = msg.attackPlan;

                var spl = ap.url.split('##post##');
                urlBrute.isPost = (spl.length>1);

                if (urlBrute.isPost) {
                    o('txtPost').show();
                    o('txtUrl').set(spl[0]);
                    o('txtPost').set(spl[1]);
                } else {
                    o('divPost').hide();
                    o('divPost').absolute();
                    o('txtUrl').set(ap.url);
                }

                o('selWordlist').addAll(ap.wordlists);
                engine.setDelay(ap.settings.attackDelay);
            }
        }
    };

    // file uploader
    urlBrute.onNewFileSelected = function(e) {
        var reader = new FileReader();
        var filename = this.files[0].name;

        reader.onload = function(e) {
            ap.targets[0].words = e.target.result.split('\n');
            ap.targets[0].words.pop();

            o('selWordlist').set(0);
            o('btnStart').show();
            console.log(' '+ap.targets[0].words.length+' words loaded.');
        };

        reader.onerror = function() {
            alert('error loading '+filename);
        };
        reader.readAsText(this.files[0]);
    };

    // combo seleccionar fichero
    urlBrute.onFileSelected = function(obj) {
        var fullpath = chrome.extension.getURL('wl/'+o('selWordlist').getSelectedText()); //TODO: soportar las custom wordlists.


        if (o('selWordlist').getSelected() == 0) {
            o('btnStart').hide();
            o('btnStart').absolute();
            return;
        }

        ap.targets[0].words = urlBrute.loadFile(fullpath).split('\n');
        ap.targets[0].words.pop();

        o('fWordlist').set('');
        o('btnStart').show();
        console.log(' '+ap.targets[0].words.length+' words loaded.');
    };

    urlBrute.loadFile = function(file) {
        var request = new XMLHttpRequest();
        try {
            request.open('GET', file, false);
            request.send();
            return request.responseText;

        } catch (e) {
            return '';
        }
    };
    
    urlBrute.render = function() {
        if (urlBrute.isPost)
            winPost.go(o('txtUrl').get(), o('txtPost').get());
        else
            window.open(out.getUrl());
    };

    urlBrute.start = function() {
        var url = out.getUrl();

        if (url.length < 7)
            alert('invalid url');

        o('btnStart').hide();
        o('btnStart').absolute();
        o('divFile').hide();
        o('divFile').absolute();

        ap.url = url;
        if (urlBrute.isPost)
            ap.post = o('txtPost').get();
        urlBrute.run();
    };

    
    urlBrute.run = function() {
        chrome.extension.sendMessage({
            method: 'attackRunning',
            module: urlBrute.name,
            url: ap.url
        });

        out.addHeader(ap.targets[0].words.length+' words loaded.');
        //out.table.addRow('Code','Lines','Words','Bytes','URL');
        urlBrute.total = ap.targets[0].words.length;
        urlBrute.progress = 0;
        urlBrute.startTime = new Date();

        engine.on('data', urlBrute.parseResponse);
        engine.on('end', urlBrute.finish);

        if (o('cbCombo').isChecked())
            engine.setComboMode();

        if (urlBrute.isPost)
            engine.ngSuperPost(ap.url, ap.post, ap.targets[0].words);
        else
            engine.ngSuperGet(ap.url, ap.targets[0].words);

        /*
        if (ap.settings.superSpeed)
            http.testGet(ap.url, ap.targets[0].words);
        else
            http.get(ap.url, ap.targets[0].words);*/

    };

    urlBrute.parseResponse = function(resp) {
        try {
            urlBrute.progress++;
            var p = Math.round(urlBrute.progress*100/urlBrute.total,0);
            if (p>100) //ugly temporary fix
                p=100;
            //out.setProgress(''+p+'%');
            pb.draw(p);

            if (resp.code != 404 && resp.data.length>0) {
                var lines = resp.data.split('\n').length;
                var words = resp.data.split(' ').length;
                var bytes = resp.data.length;

                if (resp.url[resp.url.length-1] == '/')
                    if (urlBrute.attacks.urls.exists(resp.url))
                        return;

                urlBrute.attacks.urls.push(resp.url+(urlBrute.isPost?' '+resp.post:''));
                urlBrute.attacks.resp.push({
                    code: resp.code,
                    lines: lines,
                    words: words,
                    bytes: bytes,
                });

                out.table.addRow(
                    out.getColoredText(resp.code,colors.code2color(resp.code)), 
                    lines,
                    words,
                    bytes,
                    out.getLink(resp.url+(urlBrute.isPost?'##post##'+resp.post:''), colors.code2color(resp.code))
                );
                if (ap.settings.autoScroll)
                    window.scrollBy(0,100);
            }
        } catch(e) {
            console.log('err: parseResponse()');
            console.dir(e);
        }
    };

    urlBrute.finish = function() {
        urlBrute.endTime = new Date();
        out.finishStats(urlBrute.startTime, urlBrute.endTime, urlBrute.total);
        if (ap.settings.autoScroll)
            window.scrollBy(0,100);
        
        o('btnFalsePositive').show();
        chrome.extension.sendMessage({
            method: 'attackFinished',
            module: urlBrute.name,
            url: ap.url
        });
    };

    urlBrute.fpReductor = function() {
        o('btnFalsePositive').hide();
        o('btnFalsePositive').absolute();

        gauss.clear();
        for (var i=0; i<urlBrute.attacks.urls.length; ++i) {
            var j = (urlBrute.attacks.resp[i].code + urlBrute.attacks.resp[i].lines*1000 + urlBrute.attacks.resp[i].words);
            gauss.add(j);
        }

        gauss.classify();
        out.table.del();

        for (var i=0; i<gauss.err.length; i++) {
            var resp = urlBrute.attacks.resp[gauss.err[i]];
            var url = urlBrute.attacks.urls[gauss.err[i]];

            out.table.addRow(
                out.getColoredText(resp.code,colors.code2color(resp.code)), 
                resp.lines,
                resp.words,
                resp.bytes,
                out.getLink(url, colors.code2color(resp.code))
            );
        }

    };

})();


urlBrute.init();
