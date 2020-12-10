/*
        sha0()badchecksum.net

        TODO: en los links, poner un menu de UrlFuzz, en los botones un menu de 
*/

// var attackPlan = {'targets':[{'wordlist':'', 'id':''}], 'url':null, 'module':null};

//TODO: ¿visualizar el attack plan antes de atacar y pedir confirmación?
//TODO: pequeño frame con los stats? cada vez k entres en una pag con el mismo domain, a lo tuenti-admin


////////// RIGHT CLICK - SELECT WORDLIST ////////////


var tab_url = '';
var attackPlan;
var interval;
var all_the_links;

/* Notifications: */

function say(msg) {
    chrome.tabs.executeScript(null, {code:'alert("'+msg+'");'});
}

alert=say;

function display(title,msg) {
    try {
        var display = webkitNotifications.createNotification('img/nuke_48.png',title,msg);
        display.onclick = function() {
            display.close();
        }
        display.show();
    } catch(e) {
        console.log('webkitNotifications not present');
    }
}


logger = {
    enabled: false,
    listening: false,
    filter: ''
};

logger.start = function() {
    logger.enabled = true;
    if (!logger.listening) {
        chrome.webRequest.onBeforeRequest.addListener(logger.hook,{urls: ["*://*/*"]},  ["requestBody"]);
        //var domain = target.url.split('/')[2];
        //chrome.webRequest.onBeforeRequest.addListener(logger.hook,{urls: ["*://"+domain+"/"+"*"]},  ["requestBody"]);
    }
};

logger.setFilter = function(filter) {
    logger.filter = filter;
};

logger.stop = function() {
    enabled = false;
};

logger.hook = function(o) {
    if (!logger.enabled)
        return;

    if (o.type == 'xmlhttprequest') // to avoid conflicks with get/post cracker
        return;

    if (logger.filter)
        if (o.url.split('/')[2] != logger.filter)
            return;

    msg = {
        method: 'httphook',
        url: o.url,
        data: ''
    };

    if (o.requestBody)
        msg.data = logger.buildsPost(o.requestBody.formData);

    chrome.extension.sendMessage(msg);
};

logger.buildsPost = function(o) {
    var post = '';
    for (k in o) {
        post += k + '=' + o[k] + '&'
    }
    return post;
};


interceptor = {
    msg: {},
    ret: {},
    lock: false
};

interceptor.start = function(domain) {
    chrome.webRequest.onBeforeRequest.addListener(interceptor.hook,{urls: ["*://"+domain+"/"+"*"]},  ["blocking","requestBody"]);
};

interceptor.hook = function(msg) {

    if (msg.type == 'main_frame' || msg.type == 'sub_frame') {

        interceptor.ret = {};
        interceptor.msg = msg;
        
        // stop listener
        chrome.webRequest.onBeforeRequest.removeListener(interceptor.hook);

        showModalDialog('/html/interceptor.html',this,'status:no;dialogHeight:430;dialogWidth:700;dialogTop:0px;dialogLeft:0px;');
        console.log(interceptor.ret);
        return interceptor.ret;
    } else {
        console.log('race');
        return {cancel: false};
        //while (lock);
    }

};


////////////////////////////////

function separator() {
    chrome.contextMenus.create({
        'type':'separator',
        'title':'separator',
        'contexts':['editable','link','page','all']
    });
}

function entry(title,context,callback) {
    chrome.contextMenus.create({
        'title': title,
        'contexts': context,
        'onclick': function (info,tab) { if (callback) callback(info,tab,title); }
    });
}

function fillTextbox(data) {
    if (target.field == '') {
        say("Can't write in this field");
    } else {
        chrome.tabs.executeScript(null, {code:'var evil="'+data+'";var id = document.getElementById("'+target.field+'"); if (id) {id.value=evil;} else {document.getElementsByName("'+target.field+'")[0].value=evil;}'});
    }
}


function generateContextMenus() {
    try {

        /*
            Links -> wordlists -> fuzz
            Text -> wordlist
            Page -> FormV/Form/Dirb/
            Page -> wordlists
        */

        chrome.contextMenus.removeAll();

        entry('Remove Selections',['editable'],function(info,tab,title) {
            return attackPlan.clean();
        });

        entry('danger bytes',['editable'],function(info,tab,title) {
            //chrome.tabs.executeScript(null, {code:'var evil="\'\x5c\'\\\"\ª!|\\º$·%/()?¿¡^*+`\'ç}{][-_.:,;<><!--";var id = document.getElementById("'+target.field+'"); if (id) {id.value=evil;} else {document.getElementsByName("'+target.field+'")[0].value=evil;}'});
            fillTextbox("\'\x5c\'\\\"\ª!|\\º$·%/()?¿¡^*+`\'ç}{][-_.:,;<><!--");
        });

        entry('all encoded bytes',['editable'],function(info,tab,title) {
            //chrome.tabs.executeScript(null, {code:'var evil="%00%01%02%03%04%05%06%07%08%09%0a%0b%0c%0d%0e%0f%10%11%12%13%14%15%16%17%18%19%1a%1b%1c%1d%1e%1f%20%21%22%23%24%25%26%27%28%29%2a%2b%2c%2d%2e%2f%30%31%32%33%34%35%36%37%38%39%3a%3b%3c%3d%3e%3f%40%41%42%43%44%45%46%47%48%49%4a%4b%4c%4d%4e%4f%50%51%52%53%54%55%56%57%58%59%5a%5b%5c%5d%5e%5f%60%61%62%63%64%65%66%67%68%69%6a%6b%6c%6d%6e%6f%70%71%72%73%74%75%76%77%78%79%7a%7b%7c%7d%7e%7f%80%81%82%83%84%85%86%87%88%89%8a%8b%8c%8d%8e%8f%90%91%92%93%94%95%96%97%98%99%9a%9b%9c%9d%9e%9f%a0%a1%a2%a3%a4%a5%a6%a7%a8%a9%aa%ab%ac%ad%ae%af%b0%b1%b2%b3%b4%b5%b6%b7%b8%b9%ba%bb%bc%bd%be%bf%c0%c1%c2%c3%c4%c5%c6%c7%c8%c9%ca%cb%cc%cd%ce%cf%d0%d1%d2%d3%d4%d5%d6%d7%d8%d9%da%db%dc%dd%de%df%e0%e1%e2%e3%e4%e5%e6%e7%e8%e9%ea%eb%ec%ed%ee%ef%f0%f1%f2%f3%f4%f5%f6%f7%f8%f9%fa%fb%fc%fd%fe%ff"; var id = document.getElementById("'+target.field+'"); if (id) { id.value=evil;} else {document.getElementsByName("'+target.field+'")[0].value=evil;}'});
            fillTextbox("%00%01%02%03%04%05%06%07%08%09%0a%0b%0c%0d%0e%0f%10%11%12%13%14%15%16%17%18%19%1a%1b%1c%1d%1e%1f%20%21%22%23%24%25%26%27%28%29%2a%2b%2c%2d%2e%2f%30%31%32%33%34%35%36%37%38%39%3a%3b%3c%3d%3e%3f%40%41%42%43%44%45%46%47%48%49%4a%4b%4c%4d%4e%4f%50%51%52%53%54%55%56%57%58%59%5a%5b%5c%5d%5e%5f%60%61%62%63%64%65%66%67%68%69%6a%6b%6c%6d%6e%6f%70%71%72%73%74%75%76%77%78%79%7a%7b%7c%7d%7e%7f%80%81%82%83%84%85%86%87%88%89%8a%8b%8c%8d%8e%8f%90%91%92%93%94%95%96%97%98%99%9a%9b%9c%9d%9e%9f%a0%a1%a2%a3%a4%a5%a6%a7%a8%a9%aa%ab%ac%ad%ae%af%b0%b1%b2%b3%b4%b5%b6%b7%b8%b9%ba%bb%bc%bd%be%bf%c0%c1%c2%c3%c4%c5%c6%c7%c8%c9%ca%cb%cc%cd%ce%cf%d0%d1%d2%d3%d4%d5%d6%d7%d8%d9%da%db%dc%dd%de%df%e0%e1%e2%e3%e4%e5%e6%e7%e8%e9%ea%eb%ec%ed%ee%ef%f0%f1%f2%f3%f4%f5%f6%f7%f8%f9%fa%fb%fc%fd%fe%ff");
        });

        entry('xssql',['editable'],function(info,tab,title) {
            fillTextbox("\\\"><h1>X</h1>'or''='");
        });

        entry('script',['editable'],function(info,tab,title) {
            fillTextbox("<script>alert(6);</script>");
        });

        separator();

        entry('Crack', ['link'], function(info,tab,mode) {
            attackPlan.addTarget(target);
            attackPlan.setWordlists(wls.getDef());
            attackPlan.setUrl(info.linkUrl);
            if (attackPlan.setModule('urlBrute'))
                doAttack(attackPlan);
        });

        
        entry('Crack', ['page'], function(info,tab,mode) {
            attackPlan.addTarget(target);
            attackPlan.setWordlists(wls.getDef());
            attackPlan.setUrl(info.pageUrl);
            if (attackPlan.setModule('urlBrute'))
                doAttack(attackPlan);
        });

        entry('Analyze', ['link'], function(info,tab,mode) {
            attackPlan.addTarget(target);
            attackPlan.setUrl(info.linkUrl);
            if (attackPlan.setModule('urlAnalyze'))
                doAttack(attackPlan);
        });

        entry('Analyze', ['page'], function(info,tab,mode) {
            attackPlan.addTarget(target);
            attackPlan.setUrl(info.pageUrl);
            if (attackPlan.setModule('urlAnalyze'))
                doAttack(attackPlan);
        });

        entry('Build',['page','link'], function(info,tab,mode) {
            attackPlan.addTarget(target);
            attackPlan.setUrl(info.pageUrl);
            if (attackPlan.setModule('build'))
                doAttack(attackPlan);
        });

        entry('Intercept',['page'], function(info,tab,title) {
            interceptor.start(target.url.split('/')[2]);
        });

        entry('Port Scan',['page','link'], function(info,tab,title) {
            attackPlan.addTarget(target);
            attackPlan.setUrl(info.pageUrl);
            if (attackPlan.setModule('portscan'))
                doAttack(attackPlan);
        });

        entry('links to logger', ['page'], function(info,tab,mode) {
           chrome.tabs.executeScript(tab.id, {file:'/js/urlcollector.js'});
        });

        entry('log this domain', ['page'], function(info,tab,mode) {
           logger.setFilter(target.url.split('/')[2]);
        });

        
        //Default wordlists
        var dwl = wls.getDef();
        for (var i=0; i < dwl.length; i++) {
            /*entry(dwl[i], ['link'], function(info,tab,wordlist) {
                attackPlan.addTarget(target, wordlist);
                attackPlan.setUrl(info.linkUrl);
                if (attackPlan.setModule('urlBrute'))
                    doAttack(attackPlan);
            });*/
            entry(dwl[i], ['editable'], function(info,tab,wordlist) {
                attackPlan.setUrl(info.pageUrl);
                attackPlan.addTarget(target, wordlist);
            });
            /*entry(dwl[i], ['page'], function(info,tab,wordlist) {
                attackPlan.setUrl(info.pageUrl);
                attackPlan.addTarget(target, wordlist);
                if (attackPlan.setModule('urlBrute'))
                    doAttack(attackPlan);
            });*/
        }


        //User Wordlists
        var uwl = wls.getUser();
        for (var i=0; i < uwl.length; i++) {
            /*entry(uwl[i], ['link'], function(info,tab,wordlist) {
                attackPlan.addTarget(target, wordlist);
                attackPlan.setUrl(info.linkUrl);
                if (attackPlan.setModule('urlBrute'))
                    doAttack(attackPlan);
            });*/
            entry(uwl[i], ['editable'], function(info,tab,wordlist) {
                attackPlan.setUrl(target.url);
                attackPlan.addTarget(target, wordlist);
            });
            /*entry(uwl[i], ['page'], function(info,tab,wordlist) {
                attackPlan.addTarget(target, wordlist);
                attackPlan.setUrl(info.pageUrl);
                if (attackPlan.setModule('urlBrute'))
                    doAttack(attackPlan);
            });*/
        }

        separator();

        entry('Visual Crawl', ['page'], function(info,tab,mode) {
            crawler.on();
            crawler.tabid = tab.id;
            chrome.tabs.executeScript(tab.id, {file:'/js/urlcollector.js'});
        });

        entry('Visual Crack (experimental)', ['page','image'], function(info,tab,title) {
            if (attackPlan.getNumTargets() == 0)
                return alert('Select the wordlists first.\nRight click on user and pass to select them.');

                attackPlan.setAttackVector(target.field);
                if (attackPlan.setModule('frmBrute'))
                    frmBrute.start();
        });

        /*
        entry('Form Fuzz', ['page','image'], function(info,tab,title) {
            if (attackPlan.getNumTargets() == 0)
                return alert('Select the wordlists first.\nRight click on user and pass to select them.');

            attackPlan.setAttackVector(target.vector);
            if (attackPlan.setModule('formFuzz'))
                doAttack(attackPlan);
        });*/





        // Aditional features

        separator();

        entry('Lock Session',['page'], function(info,tab,title) {
            chrome.tabs.create({url:target.url, active:false, pinned:true}, function(tab) {
                chrome.tabs.executeScript(tab.id, {file:'/js/attacks/lockSession.js'});
            });
            display('Lock Session enabled','refreshing url every minute');
        });

        entry('Open all links',['link'], function(info,tab,title) {
            chrome.tabs.executeScript(tab.id, {file:'/js/getLinks.js'});
        });

        /* añadir las  cookies desde el editor
        entry('Set Cookie','page', function(info,tab,title) {
            chrome.tabs.executeScript(tab.id, {code:'document.cookie=prompt("Cookie","");'});
        });*/

        entry('Notes',['page'], function(info,tab,title) {
            target.tab = tab.id;
            chrome.windows.create({url: "/html/notes.html", type: "popup", width: 850, height:450});
        });

        entry('Cookie Editor',['page'], function(info,tab,title) {
            target.tab = tab.id;
            chrome.windows.create({url: "/html/cookies.html", type: "popup", width: 850, height:450});
        });

        entry('Open SubUrls',['page'], function(info,tab,title) {
            chrome.tabs.executeScript(tab.id, {file:'/js/openSubUrls.js'});
        });
        

        // OPCIONES DE SELECCION DE TEXTO TODO:revisar params en todos los eventos del menu, title??
        entry('Encode base64',['selection'],function(info,tab,title) {
            var b64 = new Base64();
            say(b64.encode(info.selectionText));
        });
        entry('Decode base64',['selection'],function(info,tab,title) {
            var b64 = new Base64();
            say(b64.decode(info.selectionText.replace(/\n$/,'')));
        });
        entry('Url escape',['selection'],function(info,tab,title) {
            say(escape(info.selectionText));
        });
        entry('Url unscape',['selection'],function(info,tab,title) {
            say(unescape(info.selectionText));
        });
        entry('Url encode',['selection'],function(info,tab,title) {
            var encoded = '';
            for (var i=0; i<info.selectionText.length; i++) {
                encoded += '%'+info.selectionText.charCodeAt(i).toString(16);
            }
            say(encoded);
        });
        entry('Url decode',['selection'],function(info,tab,title) {
            var spl = info.selectionText.split('%');
            var decode = '';
            for (var i=1; i<spl.length; i++) {
                decode += String.fromCharCode('0x'+spl[i]);
            }
            say(decode);
        });
    
    } catch(e) {
        alert('err loading menu '+e);
        alert(chrome.runtime.lastError.message);
    }
}

function initBackgroundComponents() {
    try {
        chrome.browserAction.onClicked.addListener(function(){
           chrome.tabs.create({url: '/html/main.html', active: true, pinned: false});
        });
        chrome.extension.onMessage.addListener(comm.handler);
        attackPlan = new AttackPlan();
        generateContextMenus();
        logger.start();

    } catch(e) {
        alert('err initiazliation '+e);
        alert(chrome.runtime.lastError.message);
    }
}

initBackgroundComponents();
