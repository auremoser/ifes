if(!window['l10n']) window.l10n = {};

l10n.defaultCode = 'ar';

// Function that translates input string to whatever
// language is set. If source string is not found in the locale
// file, it is returned without translation.

window._ = l10n.localize  = function(string) {
    if(!this.locale || typeof !this.locale[string] === 'undefined') return string;
    return this.locale[string];
};
// Set the active locale code, here we use 'ar', or 'en'
// arabic and english for test.
l10n.setLocale = function(code) {
    if(!this[code]) return;
    this.code = [code]; // add in to flip axis
    this.locale = this[code];
};
// On initial load, we look for a query string parameter with key "lang"
l10n.setLocaleFromQueryString = function() {
    var code = this.getParameterByName('lang').replace(/\W/g, '');
    this.setLocale(code);
};
// Helper method
l10n.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
// Expose a global shortcut to the localize function aliased to "_",
// so calling _("All") is the same as l10n.localize("All")
window._ = l10n.localize.bind(l10n);