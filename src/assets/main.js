/**
 * Queue Model for jCube.
 *
 * Note que Queue executa somente uma vez.
 * Para persistência, utilize jCube.init.push(fx) e jCube.init.execute(root)
 * Ou Queue.push([fx, root, true]).
 *
 * @update 2018/08/17
**/
var Queue   = Queue || [];
var Actions = Actions || {};
Queue.views = [];
Queue.execute = function(root) {
    root = (root || document.body);

    var htmlContent = root.innerHTML.toLowerCase(),
        len         = this.length,
        crr         = null;
    for (var i = 0; i < len; i++) {
        crr = this[i];
        if (typeof crr === 'function') {
            crr(root, htmlContent);
        } else {
            crr[0](root, htmlContent);
            Queue.views.push(crr[0]);
        }
    }

    Queue.length = 0;
};
Queue.obstinate = function(root) {
    Queue.execute.call(Queue.views, root);
};
Queue.push = function(fx) {
    Array.prototype.push.call(this, fx);
    this.execute();
};
GetHttpVariables = (function(){return(function(loc){var vars={};loc=(loc||window.location)+"";if(loc.contains("?")===true){var queryString=loc.substring(loc.indexOf("?")+1).split("&");for(var i=0,length=queryString.length,crr;i<length;i++){crr=[queryString[i].substringIndex("="),queryString[i].substringIndex("=",-1)];if(crr[0].substring((crr[0].length-2))==='[]'){if(typeof vars[crr[0].substring(0,(crr[0].length-2))]!=='object'){vars[crr[0].substring(0,(crr[0].length-2))]=[];};vars[crr[0].substring(0,(crr[0].length-2))].push(crr[1]);}else{crr.name=crr[0];crr.value=crr[1];vars[crr[0]]=crr[1];}}};vars.get=function(name){if(!name){return loc.substring(loc.indexOf("?")+1);};return this[name]||null;};return vars;});})();
function Request(options) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let content = '';

        if (typeof options === 'string') {
            options = {
                url: options,
            };
        }

        if (options.posts !== undefined) {
            Object.keys(options.posts).forEach(key => {
                content += "&"+ key +"="+ encodeURIComponent(options.posts[key]);
            });
        }

        if (options.gets !== undefined) {
            options.url += (options.url.indexOf("?") === -1) ? "?" : "&";
            Object.keys(options.gets).forEach(key => {
                options.url += "&"+ key +"="+ encodeURIComponent(options.gets[key]);
            });
        }

        if (options.url.indexOf('format=') === -1) {
            options.url += (options.url.contains('?') === true ? '&' : '?') + 'format=JSON';
        }

        options.method = options.method || "GET";
        xhr.open(options.method.toUpperCase(), options.url);
        if (options.headers !== undefined) {
            Object.keys(options.headers).forEach(key => {
                xhr.setRequestHeader(key, options.headers[key]);
            });
        }

        if (['POST', 'UPDATE', 'PUT', 'PATCH'].contains(options.method.toUpperCase()) === true) {
            xhr.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
        }

        for (var i in options) {
            if (xhr[i] === undefined) {
                xhr[i] = options[i];
            }
        }
        xhr.onload = ()  => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (typeof options.onComplete === 'function') {
                    options.onComplete.call(xhr, xhr.response);
                }
                resolve.call(xhr, xhr.response);
            } else {
                if (typeof options.onLoading === 'function') {
                    options.onLoading.call(xhr, xhr.response);
                }
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => {
            if (typeof options.onError === 'function') {
                options.onComplete.call(xhr, xhr.response);
            }
            reject(xhr.statusText);
        };
        xhr.onabort = () => {
            if (typeof options.onAbort === 'function') {
                options.onAbort.call(xhr, xhr.response);
            }
            reject(xhr.statusText);
        };

        xhr.send(content);
    });
}
Array.prototype.contains=function(obj,index){index=index<0?Math.max(this.length+index,0):0;for(var i=index||0,len=this.length;i<len;i++){if(this[i]===obj){return true}}return false};
Array.prototype.each=function(callback){
    for(var i=0,len=this.length;i<len;i++){
        callback.call(this[i],this[i],i,this)
    }
    return this;
};
String.prototype.contains=function(s,index){return this.indexOf(s,index||0)>-1};
String.prototype.substringIndex=function(delim,n){var delimPos=this.indexOf(delim);n=n||0;if(delimPos==-1){return this+"";}if(n>-1){for(var i=1;i<n;i++){delimPos=this.indexOf(delim,delimPos+1);if(delimPos==-1){delimPos=this.length;break;}}return this.substring(0,delimPos);}else{var str=this;n=Math.abs(n);for(var i=0;i<n;i++){delimPos=str.lastIndexOf(delim);str=str.substring(0,delimPos);}delimPos++;return this.substring(delimPos+delim.length-1);}return this;};
String.prototype.parseProperties = function(delimiter){
    delimiter = delimiter || ';';

    var options = {};
    this.split(delimiter).each(function(){
        var name  = this.substring(0, this.indexOf('=')).trim();
        var value = this.substring(this.indexOf('=') + 1).trim();

        if (name === '' && value.length > 0) {
            options[value] = true;
        } else {
            if (value === 'false') {
                value = false;
            } else if (value === 'true') {
                value = true;
            }

            options[name] = value;
        }
    });

    return options;
};
HTMLElement.prototype.getParent = function(selector){
    if (selector) {
        var obj	= this;
        while ((obj = obj.parentNode)) {
            if (selector.charAt(0) === '.' && obj.classList.contains(selector.substring(1)) === true) {
                return obj;
            } else if (selector.charAt(0) === '#' && (obj.id||'').split(' ').contains(selector.substring(1)) === true) {
                return obj;
            } else if (/^[a-z]/.test(selector.toLowerCase()) === true && obj.nodeName.toLowerCase().split(' ').contains(selector.toLowerCase()) === true) {
                return obj;
            } else if (/^[a-z]*\[(\w+)/.test(selector.toLowerCase()) === true) {
                var reg = selector.match(/^([a-z]*)\[([a-zA-Z0-9\-_]+)/);
                if (reg.length > 2 && typeof reg[2] === 'string') {
                    if ((reg[1].length === 0 || obj.nodeName.toLowerCase().split(' ').contains(reg[1].toLowerCase()) === true) && obj.getAttribute(reg[2]) !== null) {
                        return obj;
                    }
                }
            }
        }

        return null;
    }
    return this.parentNode;
};
/**
 * Trata um URL substituindo, adicionando e excluindo as variáveis GET.
 *
 * @param string  name       Nome da variável.
 * @param string  value      Valor da variável.
 * @param boolean resetIndex Indica se variáveis index e limit devem ser redefinidas. Default: false.
 * @param boolean toggle     Caso seja true e a variável exista em location, será removida. Default false.
 * @param string  loc        Localização URL. Normalmente, a.href ou window.location.href.
 *
 * @return string URL alterado.
 */
function ParseAutoGet(name, value, resetIndex, toggle, loc) {
    loc = (loc || '') +'';
    var vars  = GetHttpVariables(loc);
    var found = false;

    if (resetIndex === true || resetIndex === 1) {
        vars.index = 1;
    }

    if (typeof vars[name] === undefined) {
        vars[name] = [];
    }

    var results = [];
    for (var i in vars) {
        if (typeof vars[i] === 'string') {
            if (i === name) {
                found = true;
                if (toggle === false || value !== vars[i]) {
                    results.push([name, value]);
                }
            } else {
                results.push([i, vars[i]]);
            }
        }
    }

    if (found === false) {
        results.push([name, value]);
    }

    var sVars	= '?';
    results.each(function(){
        if (this[1] && !(this[0]=='pagina' && this[1]==1) ) {
            sVars	+= '&'+ this[0] +'='+ this[1];
        }
    });
    loc	= loc.substringIndex('?') + sVars;
    if (loc.endsWith('/?') === true) {
        loc	= loc.substringIndex('/?') + '/';
    }

    if (loc.endsWith('?') === true) {
        loc	= loc.substring(0, loc.length-1);
    }

    loc	= loc.replace('?&', '?');
    if (loc === '') {
        loc	= './';
    }

    return loc;
};
Queue.push(function(root, contentHTML){// DATA-PARSE-AUTO-GET.
    if (contentHTML.contains('data-parse-auto-get') === true) {
        var Callback = function(){
            let options = (this.getAttribute('data-parse-auto-get') || '').parseProperties();
            if (this.nodeName === 'A') {
                this.href = ParseAutoGet(options.name, options.value, options.resetIndex, options.toggle || false);
            } else {
                window.location.href = ParseAutoGet(this.name, this.value, options.resetIndex, options.toggle || false);
            }
        };
        document.querySelectorAll('[data-parse-auto-get]').forEach(item => {
            if (item.nodeName === 'A') {
                item.addEventListener('click', Callback);
            } else {
                item.addEventListener('change', Callback);
            }
        });
    }
});
Queue.push(function(){// DATA-BUTTON-TOGGLE-SET: Deixa ativo os botões, de acordo com a qsa.
    let gets  = GetHttpVariables();
    document.querySelectorAll('[data-button-toggle-set]').forEach(item=>{
        let name  = item.getAttribute('data-button-toggle-set'),
            isSet = gets[name] !== undefined;
        item.querySelectorAll('a').forEach(eA=>{
            let href        = (eA.getAttribute('href') + '&').toLowerCase(),
                getVarValue = (gets[name] || '').toLowerCase();
            if (isSet === false) {
                if (href.contains(`?${name}=&`) === true) {
                    eA.classList.add('selected');
                } else {
                    eA.classList.remove('selected');
                }
            } else if (href.contains(`?${name}=${getVarValue}`) === true) {
                eA.classList.add('selected');
            } else if (isSet === true) {
                eA.classList.remove('selected');
            }
        });
    });
});
