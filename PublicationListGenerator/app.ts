/// <reference path="jquery.d.ts" />
/// <reference path="sugar.d.ts" />

class Author {
    firstName: string;
    lastName: string;
}

class Conference {
    authors: string;
    title: string;
    conference: string;
    abbr: string;
    location: string;
    page: string;
    year: number;
    month: number;
    refereed: bool;
}

class PublicationListGenerator {
    constructor() {
    }

    normalize(text: string) {
        if (text.startsWith('"') && text.endsWith('"')) {
            text = text.substring(1, text.length - 1);
        }
        text = text.replace("\r", " ")
            .replace("\n", " ")
            .replace("  ", " ")
            .replace("  ", " ")
            .replace("  ", " ");
        return text;
    }

    generate(csv: string) {
        var lines = csv.split('\n');
        return lines.map((line: string) => {
            var items = line.split('\t')
                .map(this.normalize);
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
    }
}

window.onload = () => {
    var input = <HTMLTextAreaElement>document.getElementById("input");
    var output = <HTMLTextAreaElement>document.getElementById("output");
    var button = <HTMLButtonElement>document.getElementById("generate");
    var gen = new PublicationListGenerator();
    button.addEventListener('click', () => {
        var pubs = gen.generate(input.value);
        var pubText = pubs.map((pub) => {
            return pub.authors + ', "' + pub.title + '," ' + pub.conference + ' (' + pub.abbr + '), '
                + pub.location + ', ' + 'pp.' + pub.page + ', ' + pub.year + '. ' + pub.month + '.';
        }).join('');
        output.value = pubText;
    });
}