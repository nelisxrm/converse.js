define("converse-dependencies", [
    "jquery",
    "otr",
    "moment",
    "filesize",
    "locales",
    "backbone.browserStorage",
    "backbone.overview",
    "jquery.tinysort",
    "jquery.browser",
    "strophe",
    "strophe.muc",
    "strophe.roster",
    "strophe.vcard",
    "strophe.disco",
    "PeerTransferHandler",
    "notify",
    "visibility",
    "sound"
], function(jQuery, otr, moment, filesize) {
    return {
        'jQuery': jQuery,
        'otr': otr,
        'moment': moment,
        'filesize': filesize
    };
});
