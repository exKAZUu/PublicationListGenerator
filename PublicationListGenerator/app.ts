/// <reference path="jquery.d.ts" />
/// <reference path="sugar.d.ts" />
/// <reference path="Scripts/linq.d.ts" />

function normalize(text: string) {
    if (text.startsWith('"') && text.endsWith('"')) {
        text = text.substring(1, text.length - 1)
    }
    text = text.trim()
        .replace('\r', ' ')
        .replace('\n', ' ')
        .replace('  ', ' ')
        .replace('  ', ' ')
        .replace('  ', ' ')
    return text
}

class Author {
    firstName: string
    lastName: string

    constructor(item: string) {
        var items = item.trim().split(' ')
        this.firstName = items[0]
        this.lastName = items[1]
    }

    equals(name: string) {
        return name.replace(' ', '') == this.firstName + this.lastName
    }

    shortName() {
        var reg = new RegExp('[a-zA-Z]')
        if (this.firstName.has(reg) || this.lastName.has(reg)) {
            return this.firstName[0] + '. ' + this.lastName
        } else {
            return this.firstName + this.lastName
        }
    }

    fullName() {
        var reg = new RegExp('[a-zA-Z]')
        if (this.firstName.has(reg) || this.lastName.has(reg)) {
            return this.firstName + ' ' + this.lastName
        } else {
            return this.firstName + this.lastName
        }
    }
}

class Award {
    organization: string
    name: string

    constructor(item: string) {
        var items = item.trim().split(' ')
        this.organization = items[0]
        this.name = items[1]
    }
}

class Publication {
    authors: Author[]
    title: string
    conference: string
    abbr: string
    volume: string
    page: string
    year: number
    month: number
    location: string
    awards: Award[]
    refereed: boolean

    constructor(line: string) {
        var items = line.split('\t')
            .map(normalize)
        var i = 0
        this.authors = items[i++].split(",").map(item => new Author(item))
        this.title = items[i++]
        this.conference = items[i++]
        this.abbr = items[i++]
        this.volume = items[i++]
        this.page = items[i++]
        if (this.page.has('-')) {
            this.page = 'pp. ' + this.page
        }
        this.year = parseInt(items[i++])
        this.month = parseInt(items[i++])
        this.location = items[i++]
        this.awards = items[i++].split(',').map(item => new Award(item))
        this.refereed = items[i++] != null
    }
}

class PublicationListGenerator {
    constructor() {
    }

    generate(csv: string) {
        var lines = csv.split('\n')
        return lines.map(line => new Publication(line))
    }
}

window.onload = () => {
    var inputElem = <HTMLTextAreaElement>document.getElementById("input")
    var authorElem = <HTMLTextAreaElement>document.getElementById("author")
    var fullTemplateElem = <HTMLTextAreaElement>document.getElementById("fullTemplate")
    var shortTemplateElem = <HTMLTextAreaElement>document.getElementById("shortTemplate")
    var outputElem = <HTMLTextAreaElement>document.getElementById("output")
    var buttonElem = <HTMLButtonElement>document.getElementById("generate")

    var fullTemplate = fullTemplateElem.value
    var shortTemplate = shortTemplateElem.value
    var authorNames = Enumerable
        .from(authorElem.value.split('\n'))
        .select(name => normalize(name))

    var gen = new PublicationListGenerator()
    buttonElem.addEventListener('click', () => {
        var pubs = gen.generate(inputElem.value)
        var pubText = pubs.map((pub) => {
            var authorIndex = Enumerable.from(pub.authors)
                .indexOf(author => authorNames.any(n => author.equals(n)))
            var result = ""
            if (authorIndex >= 0 && authorIndex < pub.authors.length - 1 && shortTemplate.length > 0) {
                return 'short' + result
            }
            else {
                result = fullTemplate
                result = result.replace('%authors%', pub.authors.map(a => a.shortName()).join(', '))
                result = result.replace('%title%', pub.title)
                result = result.replace('%conference%', pub.conference)
                if (pub.abbr != undefined && pub.abbr.length > 0) {
                    result += ' (' + pub.abbr + ')'
                }
                result += ', ' + pub.page
                result += ', ' + pub.year + '.'
                return 'full' + result
            }
        }).join('\n')
        outputElem.value = pubText
    })
}