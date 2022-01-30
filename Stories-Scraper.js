const fcv = require("fast-csv");
const fs = require("fs");
const { got } = require("got-scraping");
const Cheerio = require("cheerio");
const StackList = require("./StackList");

const LINKS_CSV = "catlinks.csv";
const STORIES_CSV = "catstories.csv";

const loadCheerio = async (url) => {
  const response = await got(url);
  return Cheerio.load(response.body);
};

// -> document.querySelector("#main-wrapper > div > div > div.e1j2237y3.bbc-1n11bte.e57qer20 > main");

const createFcvWriter = (headersArr) => {
  const ws = fs.createWriteStream(STORIES_CSV, { flags: "a" });
  const fcvStream = fcv.format({
    headers: headersArr,
    includeEndRowDelimiter: true,
    quote: true,
  });
  fcvStream.pipe(ws);

  return fcvStream;
};

const writeLinksToList = () => {
  return new Promise((resolve, reject) => {
    //Stores links in the list
    const list = new StackList();

    fcv
      .parseFile(LINKS_CSV)
      .on("error", reject)
      .on("data", (row) => {
        list.push(row);
      })
      .on("end", (rowCount) => {
        //console.log(`Parsed ${rowCount} rows`);
        resolve(list);
      });
  });
};

const scrapAndSaveStory = async (rowArr, selector, fcvStream) => {
  const $ = await loadCheerio(rowArr[1]);
  fcvStream.write([rowArr[0], $(selector).text()]);
};

const scrapeBBCStories = async () => {
  try {
    if (await fs.existsSync(LINKS_CSV)) {
      //if (true || (await fs.existsSync(STORIES_CSV))) {

      //Selector for selecting the text
      const textSelector =
        "#main-wrapper > div > div > div.e1j2237y3.bbc-1n11bte.e57qer20 > main p";

      const list = await writeLinksToList();

      console.log("Start Scraping Stories");

      //Create a write stream
      const fcvStream = createFcvWriter(["Category", "Story"]);

      for(let i = 0; i < list.size; i++){
        await scrapAndSaveStory(list.pop(), textSelector, fcvStream);
        //console.log(i + " Story Saved !");
      }

      console.log("Done Scraping Stories");
      //} else {console.log(`First Delete ${STORIES_CSV} File`);}
    } else {
      console.log(`${LINKS_CSV} File Doesn't Exist`);
    }
  } catch (err) {
    console.log("Error@ScrapeBBCStories: " + err.message);
  }
};

module.exports = {
  scrapeBBCStories,
};

//console.log(row[1]);
//const $ = await loadCheerio(row[1]);
//fcvStream.write([row[0], $(textSelector).text()]);
