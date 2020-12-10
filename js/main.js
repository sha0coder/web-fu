/*

    this js is deprecated


    Web-Fu by sha0()badchecksum.net

    TODO: 

        * CORE
            - 1. Finalizar formFuzz
            - 2. Quitar el inject 
            - 3. calcular tasa de errores o bien relanzar los intentos fallidos
            - 4. capturar btn derecho para seleccionar una wordlist para cada parámetro, se multiplexaran similar a user x pass
            - 5. Motor de detección de patrones (hash code+lines+words ordenado buscar los mas diferentes
            - 6. Pensar si se quita el authBrute (mirar de ocultar la ventana, si no se puede, se quita este scan)
            - 7. crawler recursivo infinito (¿combinarlo con dirScan?)
    
        * GUI
            - 1. Opcion de configuraciones avanzadas, para calibrar timeouts, ip del server donde se cargan las wordlists.
            - 2. Rediseñar popup.html
            - 3. Loader de wordlists a dentro del repositorio?
            - 4. Rediseñar los tabs donde se ecribe el output.
            - 5. Btn Guardar log
            - 5. Barra de progreso?

        * TEST
            - Probar en windows, android y mac
            - Testear todas las funcionalidades
*/


function say(msg) {
    chrome.tabs.executeScript(null, {code: "alert('"+msg+"');"});
}

function refreshDisplay() {
    var log = storage.getArray('log');
    o('output').html(log.join('\n'));
}



//refreshDisplay();

//init settings
o('autoScroll').o.checked = storage.getBool('autoScroll',true);
o('attackDelay').setValue(storage.get('attackDelay','0'));
o('txtRFI').setValue(storage.get('rfiUrl',''));


//exploit search
o('btnExploitSearch').click(function() {
    alert('heay');
});


//change settings
o('autoScroll').click(function() {
    storage.setBool('autoScroll', o('autoScroll').isChecked());
});

o('attackDelay').blur(function() {
    storage.set('attackDelay', o('attackDelay').getValue());
});

o('txtRFI').blur(function() {
    storage.set('rfiUrl', o('txtRFI').getValue());
});


//options
o('wordlists').click(function() {
    chrome.windows.create({url: "html/wordlists.html", type: "popup", width: 450, height:450});
});

o('clear').click(function() {
    storage.del('log');
    refreshDisplay();
});
