const { WordList } = require("./WordList");
const fcv = require("fast-csv");
const fs = require("fs");

const STORIES_CSV = "catstories.csv";

/*
const text = "Paragraphs are the building blocks of papers. Many students define paragraphs in terms of length: a paragraph is a group of at least five sentences, a paragraph is half a page long, etc. In reality, though, the unity and coherence of ideas among sentences is what constitutes a paragraph. A paragraph is defined as “a group of sentences or a single sentence that forms a unit” (Lunsford and Connors 116). Length and appearance do not determine whether a section in a paper is a paragraph. For instance, in some styles of writing, particularly journalistic styles, a paragraph can be just one sentence long. Ultimately, a paragraph is a sentence or group of sentences that support one main idea. In this handout, we will refer to this as the “controlling idea,” because it controls what happens in the rest of the paragraph.";

const list = new WordList();

let wordText = "";

for(let i = 0; i < text.length; i++){
    if(text.charAt(i) === " "){
        list.push(wordText);
        wordText = "";
    }else{
        wordText += text.charAt(i);
    }
}
*/
/*
//list.printWithCount();
console.log("Max: " + list.getMax());
console.log("Max: " + list.getMax(12));
console.log("Max: " + list.getMax(7));
console.log("Max: " + list.getMax(5));
console.log("Max: " + list.getMax(4));*/

//Get most frequent words

const catNames = [
  "Pakistan",
  "Aaas Paas",
  "World",
  "Khel",
  "Fun Funkar",
  "Science",
];

const countCategoryStories = () => {
  return new Promise((resolve, reject) => {
    const catCount = [0, 0, 0, 0, 0, 0];

    fcv
      .parseFile(STORIES_CSV)
      .on("error", reject)
      .on("data", (row) => {
        for (let i = 0; i < catNames.length; i++) {
          if (row[0] === catNames[i]) {
            catCount[i]++;
          }
        }
      })
      .on("end", (rowCount) => resolve(catCount));
  });
};

const countMaxAndMinStory = () => {
  return new Promise((resolve, reject) => {
    let storyLength = {
      max: Number.MIN_VALUE,
      min: Number.MAX_VALUE,
    };

    fcv
      .parseFile(STORIES_CSV)
      .on("error", reject)
      .on("data", (row) => {
        const rowLen = row[1].length;

        if (rowLen > storyLength.max) storyLength.max = rowLen;
        if (rowLen < storyLength.min) storyLength.min = rowLen;
      })
      .on("end", (rowCount) => resolve(storyLength));
  });
};

const breaktoWordsList = (text, list) => {
  let wordText = "";

  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === " ") {
      list.push(wordText);
      wordText = "";
    } else {
      wordText += text.charAt(i);
    }
  }
};

const getStoryWords = () => {
  return new Promise((resolve, reject) => {
    const list = new WordList();

    fcv
      .parseFile(STORIES_CSV)
      .on("error", reject)
      .on("data", (row) => {
        breaktoWordsList(row[1], list);
      })
      .on("end", (rowCount) => resolve(list));
  });
};

const getMaxCounts = (totalNums, list) => {
  const maxWordsArr = [];
  let max = -1;

  for (let i = 0; i < totalNums; i++) {
    const maxWord = list.getMaxWord(max);
    maxWordsArr.push(maxWord);
    max = maxWord.count;
  }

  return maxWordsArr;
};

const printCategoryCount = async () => {
  catCount = await countCategoryStories();
  console.log("Categories: Total Stories");
  for (let i = 0; i < catNames.length; i++) {
    console.log(catNames[i] + ": " + catCount[i]);
  }
};

const printMaxMinStories = async () => {
  storyLength = await countMaxAndMinStory();
  console.log("Maximium-Story-Length: " + storyLength.max);
  console.log("Minimium-Story-Length: " + storyLength.min);
};

const printStoryWords = async (unique = false, allWordsList = undefined) => {
  let allWords;
  if (allWordsList === undefined) {
    allWords = await getStoryWords();
  } else {
    allWords = allWordsList;
  }

  if (unique) allWords.printWithCount(0);
  else allWords.printWithCount();
};

const printMaxCounts = async (totalCounts, allWordsList = undefined) => {
  let allWords;
  if (allWordsList === undefined) {
    allWords = await getStoryWords();
  } else {
    allWords = allWordsList;
  }

  const wordsArr = getMaxCounts(totalCounts, allWords);

  for (let i = 0; i < wordsArr.length; i++) {
    console.log(wordsArr[i].text + ": " + wordsArr[i].count);
  }
};

/*
printCategoryCount();
printMaxMinStories();
printStoryWords(true);
console.log("Top 10 Frequent Words");
printMaxCounts(10);
*/

const printAllOps = async () => {
  await printCategoryCount();
  await printMaxMinStories();

  const allWords = await getStoryWords();

  console.log("All Unique Words: frequency");
  await printStoryWords(true, allWords);
  console.log("Top 10 Frequent Words: frequency");
  await printMaxCounts(10, allWords);
};

printAllOps();
