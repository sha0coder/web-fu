
comm = {
        send: null,

        init: function() {
                /*
                chrome.extension.sendMessage({
                                method: 'httphook',
                                action: 'ping'
                }, comm.handle);*/

        },

        handle: function(msg,sender,send) {
                if (msg.method != 'httphook')
                    doHook();
        },

        btn: null
};


orig = {
    open: XMLHttpRequest.prototype.open,
    setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
    send: XMLHttpRequest.prototype.send,
    submit: HTMLFormElement.prototype.submit
};

frmUtil = {

    form2post: function(frm) {
       var post = '';
        for (var i=0; i<frm.length; i++) {
            post += (frm[i].id?frm[i].id:frm[i].name)+'='+frm[i].value+'&';
        }
        return post;
    },

    getURL: function(frm) {
        if (frm.action && typeof frm.action === 'string' && frm.action != '') 
            return frm.action;
        return window.location.href;
    }

};

var hook = {


    open: function(method, url) {
        chrome.extension.sendMessage({
                'method':'httphook',
                'url':url
        });
        orig.open.apply(this, arguments);
        console.log('httpHook url:'+url);
    },
    setRequestHeader: function(header, value) {
        chrome.extension.sendMessage({
                'method':'httphook',
                'header':header.toString()+':'+value.toString()
        });
        orig.setRequestHeader.apply(this, arguments);
    },
    send: function(data) {
        if (data)
            chrome.extension.sendMessage({
                'method':'httphook',
                'data':data
            });
        orig.send.apply(this, arguments);
    },
    submit: function () {
        console.log('submit!!');
        chrome.extension.sendMessage({
                'method':'httphook',
                'url':this.action,
                'data':frmUtil.form2post(this)
        });
        //orig.submit.apply(this, arguments);
    },
    clickEvent: function (event) {
        //if ((event.target.nodeName == 'INPUT' && event.target.type && event.target.type.toUpperCase() == 'SUBMIT') || (event.target.nodeName == 'BUTTON' && (!event.target.type || (event.target.type.toUpperCase() != 'BUTTON' && event.target.type.toUpperCase() != 'RESET')))) {

        var btn = event.target;
        if (btn.href) {
        //if (btn.type && btn.type.toLowerCase() != 'submit' && btn.href) {
            chrome.extension.sendMessage({
                method:'httphook',
                url: btn.href
            });
        }
    },
    submitEvent: function (event) {
        var frm = event.target;
        var msg = {
            method:'httphook'
        };

        
        msg.url = frmUtil.getURL(frm);


        if (frm.method.toLowerCase() == 'post') {
            msg.data = frmUtil.form2post(frm);

       } else if (frm.method.toLowerCase() == 'get') {

            if (msg.url.search('\\?')<0)
                msg.url += '?'+frmUtil.form2post(frm);
            else
                msg.url += '&'+frmUtil.form2post(frm);
        }
        
        chrome.extension.sendMessage(msg);
    },

    uninstall: function() {
        XMLHttpRequest.prototype.open = orig.open;
        XMLHttpRequest.prototype.setRequestHeader = orig.setRequestHeader;
        XMLHttpRequest.prototype.send = orig.send;
        HTMLFormElement.prototype.submit = orig.sutmit;
        window.removeEventListener('click',hook.clickEvent, true);
        window.removeEventListener('submit',hook.submitEvent, true);
        console.log('HTTP Hooks removed!');
    },

    install: function() {
        //HTMLFormElement.prototype.submit = hook.submit;
        if (!HTMLFormElement)
            console.log('no existe HTMLFormElement');
        console.log(HTMLFormElement);

       // document.writeln('<sc'+'ript> HTMLFormElement.prototype.submit = function() {console.log("yeah!!");} </scri'+'pt>');

        HTMLFormElement.prototype.submit = function() {console.log('yeah!!');}
        XMLHttpRequest.prototype.open = hook.open;
    	//XMLHttpRequest.prototype.setRequestHeader = hook.setRequestHeader;
        XMLHttpRequest.prototype.send = hook.send;
    	window.addEventListener('click', hook.clickEvent, true);
        window.addEventListener('submit', hook.submitEvent, true);
        console.log('HTTP Hooks Installed!');
    }
};

comm.init();
hook.install(); 

