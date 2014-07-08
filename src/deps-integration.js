define("converse-dependencies", [
    "otr",
    "moment",
    "filesize",
    "locales",
    "backbone.localStorage",
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
], function(otr, moment, filesize) {
    return {
        'otr': otr,
        'moment': moment,
        'filesize': filesize
    };
});
