define("converse-dependencies", [
    "otr",
    "moment",
    "filesize",
    "locales",
    "backbone.localStorage",
    "backbone.overview",
    "jquery.tinysort",
    "jquery.browser",
    "strophe",
    "strophe.muc",
    "strophe.roster",
    "strophe.vcard",
    "strophe.disco",
    "peer-transfer",
    "notify",
    "visibility"
], function(otr, moment, filesize) {
    return {
        'otr': otr,
        'moment': moment,
        'filesize': filesize
    };
});
