const Cheerio = require("cheerio");
const { got } = require("got-scraping");
const fcv = require("fast-csv");
const path = require("path");
const fs = require("fs");
const res = require("express/lib/response");

const PAGE_URL = "https://www.bbc.com";
const LINKS_CSV = "catlinks.csv";

//All Categories
const catNames = [
    "Pakistan",
    "Aaas Paas",
    "World",
    "Khel",
    "Fun Funkar",
    "Science"
]

const catLinks = [
    "https://www.bbc.com/urdu/topics/cjgn7n9zzq7t", // Pakistan
    "https://www.bbc.com/urdu/topics/cl8l9mveql2t", // Aaas Paas
    "https://www.bbc.com/urdu/topics/cw57v2pmll9t", // World
    "https://www.bbc.com/urdu/topics/c340q0p2585t", // Khel
    "https://www.bbc.com/urdu/topics/ckdxnx900n5t", // Fun Funkar
    "https://www.bbc.com/urdu/topics/c40379e2ymxt", // Science
];

// cats/page/:pageNumber -> For Navigating through different pages of a category

const loadCheerio = async (url) => {
    const response = await got(url);
    return Cheerio.load(response.body);
}

const scrapStoryLinks = async (catUrl) => {
    const scrapedHrefs = [];
    //Link Selector -> a.qa-story-cta-link
    const linkSelector = "a.qa-story-cta-link";
    const $ = await loadCheerio(catUrl);

    $(linkSelector).each((index, element) => {
        //console.log("Link: " + PAGE_URL + $(element).attr('href'));
        scrapedHrefs.push(PAGE_URL + $(element).attr('href'));
    });

    return scrapedHrefs;
}

const WriteprefixArr = (prefix, arr, fcv_stream) => {
    for(let i = 0; i < arr.length; i++){
        arr[i] = [prefix, arr[i]];
        fcv_stream.write(arr[i]);
    };
    return arr;
}

const delFile = async (filename) => {
    await fs.unlinkSync('catlinks.csv');
}

const scrapeBBCLinks = async (req, res) => {
    //First Delete Previous generated Links Fils then scrap
    if(await fs.existsSync(LINKS_CSV)){ 
        console.log(`First Delete Previous ${LINKS_CSV} File`);
        //await delFile(LINKS_CSV);
        return ;
    
    }

    console.log("Scraping Links Started");

    //Total pages to scrap of each category
    const pagesToScrap = 10;

    //Create a readstream to save links
    const ws = fs.createWriteStream(LINKS_CSV, {flags: 'a'});
    const fcvStream = fcv.format({headers: ['Category', 'Link'], includeEndRowDelimiter: true, quote: true});
    fcvStream.pipe(ws);

    //Extract and Save Links
    for(let i = 0; i < catLinks.length; i++){
        for(let j = 0; j < pagesToScrap; j++){
            links = await scrapStoryLinks(catLinks[i] + "/page/" + (j + 1)); //because j starts from 0 but pages start from 1
            WriteprefixArr(catNames[i], links, fcvStream);
            //console.log(links);
            links = [];
        }
    }

    console.log("Done Scraping Links");
    //End Writing Streams
    fcvStream.end();
    ws.end();

    if(res) res.end();

};

module.exports = {
    scrapeBBCLinks
}

/*
Helper Code
    const $ = Cheerio.load("<a href='why.jpeg'>Hello World</a><a href='hi.jpeg'>Damn!</a>");
    $('a').each((index, element) => {
        console.log("Text: " + $(element).text());
        console.log("Link: " + $(element).attr('href'));
    })
*/

/*
Checks if a file is empty
if (fs.exists('path/to/file')) {
    if (fs.read('path/to/file').length === 0) {
        //Code to be executed if the file is empty
    } else {
        return JSON.parse(fs.read('path/to/file'));
    }
}

*/

/*
Helper Code

    flag a for appending w for writing

    let ws = fs.createWriteStream('catlinks.csv', {flags: 'a'});
    await fcv.write(rows, {includeEndRowDelimiter: true, headers: true}).pipe(ws);
    ws.end();

*/

//await writeToPath(path.resolve(__dirname, 'tmp.csv'), rows, {flags: 'a'});