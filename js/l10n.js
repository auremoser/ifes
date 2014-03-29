if(!window['l10n']) window.l10n = {};

l10n.defaultCode = 'ar';

window._ = l10n.localize  = function(string) {
    if(!this.locale || !this.locale[string]) return string;
    return this.locale[string];
};

l10n.setLocale = function(code) {
    if(!this[code]) return;
    this.locale = this[code];
};

l10n.setLocaleFromQueryString = function() {
    var code = this.getParameterByName('lang').replace(/\W/g, '');
    this.setLocale(code);
};

l10n.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};


window._ = l10n.localize.bind(l10n);