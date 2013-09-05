/// <reference path="jquery.d.ts" />
/// <reference path="sugar.d.ts" />
var Author = (function () {
    function Author() { }
    return Author;
})();
var Conference = (function () {
    function Conference() { }
    return Conference;
})();
var PublicationListGenerator = (function () {
    function PublicationListGenerator() {
    }
    PublicationListGenerator.prototype.normalize = function (text) {
        if(text.startsWith('"') && text.endsWith('"')) {
            text = text.substring(1, text.length - 1);
        }
        text = text.replace("\r", " ").replace("\n", " ").replace("  ", " ").replace("  ", " ").replace("  ", " ");
        return text;
    };
    PublicationListGenerator.prototype.generate = function (csv) {
        var _this = this;
        var lines = csv.split('\n');
        return lines.map(function (line) {
            var items = line.split('\t').map(_this.normalize);
            var pub = new Conference();
            var i = 0;
            pub.authors = items[i++];
            pub.title = items[i++];
            pub.conference = items[i++];
            pub.abbr = items[i++];
            pub.location = items[i++];
            pub.page = items[i++];
            pub.year = parseInt(items[i++]);
            pub.month = parseInt(items[i++]);
            pub.refereed = items[i++] == '—L';
            return pub;
        });
    };
    return PublicationListGenerator;
})();
window.onload = function () {
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    var button = document.getElementById("generate");
    var gen = new PublicationListGenerator();
    button.addEventListener('click', function () {
        var pubs = gen.generate(input.value);
        var pubText = pubs.map(function (pub) {
            return pub.authors + ', "' + pub.title + '," ' + pub.conference + ' (' + pub.abbr + '), ' + pub.location + ', ' + 'pp.' + pub.page + ', ' + pub.year + '. ' + pub.month + '.';
        }).join('');
        output.value = pubText;
    });
};
//@ sourceMappingURL=app.js.map
