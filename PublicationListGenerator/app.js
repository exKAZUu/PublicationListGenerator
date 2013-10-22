/// <reference path="jquery.d.ts" />
/// <reference path="sugar.d.ts" />
/// <reference path="Scripts/linq.d.ts" />
function normalize(text) {
    if (text.startsWith('"') && text.endsWith('"')) {
        text = text.substring(1, text.length - 1);
    }
    text = text.trim().replace('\r', ' ').replace('\n', ' ').replace('  ', ' ').replace('  ', ' ').replace('  ', ' ');
    return text;
}

var Author = (function () {
    function Author(item) {
        var items = item.trim().split(' ');
        this.firstName = items[0];
        this.lastName = items[1];
    }
    Author.prototype.equals = function (name) {
        return name.replace(' ', '') == this.firstName + this.lastName;
    };

    Author.prototype.shortName = function () {
        var reg = new RegExp('[a-zA-Z]');
        if (this.firstName.has(reg) || this.lastName.has(reg)) {
            return this.firstName[0] + '. ' + this.lastName;
        } else {
            return this.firstName + this.lastName;
        }
    };

    Author.prototype.fullName = function () {
        var reg = new RegExp('[a-zA-Z]');
        if (this.firstName.has(reg) || this.lastName.has(reg)) {
            return this.firstName + ' ' + this.lastName;
        } else {
            return this.firstName + this.lastName;
        }
    };
    return Author;
})();

var Award = (function () {
    function Award(item) {
        var items = item.trim().split(' ');
        this.organization = items[0];
        this.name = items[1];
    }
    return Award;
})();

var Publication = (function () {
    function Publication(line) {
        var items = line.split('\t').map(normalize);
        var i = 0;
        this.authors = items[i++].split(",").map(function (item) {
            return new Author(item);
        });
        this.title = items[i++];
        this.conference = items[i++];
        this.abbr = items[i++];
        this.volume = items[i++];
        this.page = items[i++];
        if (this.page.has('-')) {
            this.page = 'pp. ' + this.page;
        }
        this.year = parseInt(items[i++]);
        this.month = parseInt(items[i++]);
        this.location = items[i++];
        this.awards = items[i++].split(',').map(function (item) {
            return new Award(item);
        });
        this.refereed = items[i++] != null;
    }
    return Publication;
})();

var PublicationListGenerator = (function () {
    function PublicationListGenerator() {
    }
    PublicationListGenerator.prototype.generate = function (csv) {
        var lines = csv.split('\n');
        return lines.map(function (line) {
            return new Publication(line);
        });
    };
    return PublicationListGenerator;
})();

window.onload = function () {
    var inputElem = document.getElementById("input");
    var authorElem = document.getElementById("author");
    var fullTemplateElem = document.getElementById("fullTemplate");
    var shortTemplateElem = document.getElementById("shortTemplate");
    var outputElem = document.getElementById("output");
    var buttonElem = document.getElementById("generate");

    var fullTemplate = fullTemplateElem.value;
    var shortTemplate = shortTemplateElem.value;
    var authorNames = Enumerable.from(authorElem.value.split('\n')).select(function (name) {
        return normalize(name);
    });

    var gen = new PublicationListGenerator();
    buttonElem.addEventListener('click', function () {
        var pubs = gen.generate(inputElem.value);
        var pubText = pubs.map(function (pub) {
            var authorIndex = Enumerable.from(pub.authors).indexOf(function (author) {
                return authorNames.any(function (n) {
                    return author.equals(n);
                });
            });
            var result = "";
            if (authorIndex >= 0 && authorIndex < pub.authors.length - 1 && shortTemplate.length > 0) {
                return 'short' + result;
            } else {
                result = fullTemplate;
                result = result.replace('%authors%', pub.authors.map(function (a) {
                    return a.shortName();
                }).join(', '));
                result = result.replace('%title%', pub.title);
                result = result.replace('%conference%', pub.conference);
                if (pub.abbr != undefined && pub.abbr.length > 0) {
                    result += ' (' + pub.abbr + ')';
                }
                result += ', ' + pub.page;
                result += ', ' + pub.year + '.';
                return 'full' + result;
            }
        }).join('\n');
        outputElem.value = pubText;
    });
};
//# sourceMappingURL=app.js.map
