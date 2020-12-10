/*
	sha0@bachecksum.net
	
	Component intercomunication.
	commHandler()

*/

var target = {    //TODO: unificar con ap  field -> id
    url:'',
    field:'',
    value:'',
    form:'',
    action:'',
    cooks:'',
    tab:'',
};

comm = {
    auditUrls: []
};


crawler = {
    enabled: false,
    tabid: -1,
    pending: new Queue(),
    crawled: new Queue(),
    on: function() {
        crawler.enabled = true;
    },
    off: function() {
        crawler.enabled = false;
    },
    stats: function() {
        console.log('pending: '+crawler.pending.size());
        console.log('crawled: '+crawler.crawled.size());
    },
    clear: function() {
        crawler.pending.clear();
        crawler.crawled.clear();
    },
    pop: function() {
        var url = crawler.pending.pop();
        crawler.crawled.push(url);
        return url;
    }
};

comm.parseRFI = function(wordlist) {
    var words = [];
    var rfi = storage.get('rfiUrl','');
    for (var i=0; i<wordlist.length; i++) {
        if (wordlist[i].search('##RFI##') < 0) {
            words.push(wordlist[i]);
        } else {
            if (rfi) {
                words.push(wordlist[i].replace('##RFI##',rfi+'?'));
            }
        }
    }
    return words;
};

comm.loadWordlists = function(ap) {
    console.log('loading wordlists ...');
    ap.targets[0].words = wls.loadFile(ap.targets[0].wordlist).split('\n');
    ap.targets[0].words.pop();
    ap.targets[0].words = comm.parseRFI(ap.targets[0].words);
    console.log('wordlist1 loaded '+ap.targets[0].words.length+' words.');

    if (ap.targets.length > 1) {
        ap.targets[1].words = wls.loadFile(ap.targets[1].wordlist).split('\n');
        ap.targets[1].words.pop();
        ap.targets[1].words = comm.parseRFI(ap.targets[1].words);
        console.log('wordlist2 loaded '+ap.targets[1].words.length+' words.');
    }
};

comm.setSettings = function(ap) {
    //  Settings
    //ap.settings.showResponses = storage.getBool('showResponses');
    ap.settings.attackDelay = storage.get('attackDelay',0);
    ap.settings.autoScroll = storage.getBool('autoScroll',true);
    //ap.settings.superSpeed = storage.getBool('superSpeed');
};

comm.log={};

comm.log.start = function(module,data) {
    if (data)
        storage.log(module+' started: '+data);
    else
        storage.log(module+' started.');

    display('Attack Running',module);
};

comm.log.finish = function(module,data) {
    if (data)
        storage.log(module+' finished: '+data);
    else
        storage.log(module+' finished.');

    display('Attack Finished',module);
};

comm.handler = function(msg,sender,send) {
    try {
        switch(msg.method) { // what -> method who->module

            case 'log':
            storage.log(msg.log);

            case 'rightClick':
                target.url = msg.url;       //TODO: unificar nombres de campos para asignar target = msg
                target.field = msg.inputId;
                target.form = msg.formId;
                target.value = msg.value;
                target.action = msg.formAction;
                target.cooks = msg.cookies;
                tab_url = msg.url;
                break;

            case 'refreshMenus':
                generateContextMenus();
                break;

            case 'display':
                display(msg.title,msg.body);
                break;

            case 'attackRunning':
                comm.log.start(msg.module,msg.url);
                break;

            case 'attackFinished':
                comm.log.finish(msg.module,msg.url);
                break;

            case 'getAllTheLinks':
                for (var i=0; i<msg.links.length; i++)
                    chrome.tabs.create({url:msg.links[i],active:false});
                break;

            case 'getUrl':
                send({method:'url', url:target.url});
                break;

            case 'getCookies':
                send({method:'cookies',cookies:target.cooks});
                break;

            case 'setCookies':
                msg.cookies = msg.cookies.replace(/"/g,"'");
                chrome.tabs.executeScript(target.tab, {code:'document.cookie="'+msg.cookies+'";'});
                break;

            case 'auditReady':
                chrome.extension.sendMessage({
                    method: 'audit',
                    urls: comm.auditUrls
                });
                break;

            case 'doAudit':
                comm.auditUrls = msg.urls;
                chrome.tabs.create({'url':'/html/attacks/audit.html','active':true,'pinned':false});
                break;

            case 'attackReady':
                var ap = attackPlan.getDB(); //json version of AttackPlan object data
                attackPlan = new AttackPlan(); //clean attack plan

                if (ap.targets.length < 1) {
                    say('select a wordlist first');
                    return;
                }

                comm.loadWordlists(ap);
                comm.setSettings(ap);

                console.log('attack module injected, sending data to the module ...');
                send({
                    method: 'run',
                    module: ap.module,
                    attackPlan: ap
                });
                break;

            case 'massLogger':
                if (crawler.enabled) {
                    msg.urls.forEach(function(url) {
                        if (!crawler.crawled.exists(url) && !crawler.pending.exists(url)) {
                            crawler.pending.push(url);
                        }
                    });

                    if (crawler.pending.empty())
                        return;

                    var url = crawler.pending.pop();
                    crawler.crawled.push(url);

                    crawler.stats();
                    
                    chrome.tabs.update(crawler.tabid, {url:url}, function(tab) {
                        //setTimeout(function() {
                            chrome.tabs.executeScript(tab.id, {file:'/js/urlcollector.js'});
                        //},5);
                    });
                }
                break;

            case 'clearCrawler':
                crawler.clear();
                break;

            case 'crawlerGiveMeUrl':
                if (crawler.enabled)
                    send({method:'crawler', url:''});
                else
                    send({method:'crawler', url:crawler.pop()});
                break;

        }

    } catch (e) {
        console.dir(e);
        console.log('err: COMM');
    } 
};

