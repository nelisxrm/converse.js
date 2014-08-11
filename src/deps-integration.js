define("converse-dependencies", [
    "otr",
    "moment",
    "filesize",
    "locales",
    "backbone.browserStorage",
    "backbone.overview",
    "jquery.browser",
    "strophe",
    "strophe.muc",
    "strophe.roster",
    "strophe.vcard",
    "strophe.disco",
    "peer-wrap",
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
