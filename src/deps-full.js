define("converse-dependencies", [
    "otr",
    "moment",
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
    "strophe.ibb",
    "strophe.outofband",
    "strophe.si-filetransfer"
], function(otr, moment) {
    return {
        'otr': otr,
        'moment': moment
    };
});
