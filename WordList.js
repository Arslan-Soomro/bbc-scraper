class Word {
  text;
  count;
  next;
  constructor(str) {
    this.text = str;
    this.count = 0;
    this.next = null;
  }
}

class WordList {
  head;
  size = 0;

  isEmpty() {
    return this.head == undefined;
  }

  isLastWord(item) {
    return item.next == undefined;
  }

  searchText(str, returnNext = false) {
    if (!this.isEmpty()) {
      let cur = this.head;

      //Returns a node before the one we are trying to find
      for (let i = 0; i < this.size; i++) {
        if (cur.next && cur.next.text == str) {
          if (returnNext) return cur.next;

          return cur;
        }
        cur = cur.next;
      }
    }

    return undefined;
  }

  //Pushes Word Object into WordList
  pushi(item) {
    if (this.isEmpty()) {
      this.head = item;
      this.size++;
    } else {
      if (this.head?.text != undefined && item.text != this.head.text) {
        item.next = this.head;
        this.head = item;
        this.size++;
      }
    }
  }

  //It should first search for that object and then push
  //Creates a word object from str and then pushes it to wordList
  push(str) {
    //this.pushi(new Word(str));
    const searchedWord = this.searchText(str, true);
    if (searchedWord != undefined) {
      searchedWord.count++;
    } else {
      this.pushi(new Word(str));
    }
  }

  delete(str) {
    const searchedWord = this.searchText(str);
    if (searchedWord != undefined) {
      const temp = searchedWord.next;
      searchedWord.next = searchedWord.next.next;
      return temp;
    }
    return undefined;
  }

  //Returns a word object
  popi() {
    if (!this.isEmpty()) {
      const temp = this.head;
      if (this.head && this.head.next) this.head = this.head.next;
      else this.head = undefined;

      if (this.size > 0) this.size--;

      return temp;
    } else {
      console.log("@pop: List already empty");
    }

    return undefined;
  }

  //Returns a word's text
  pop() {
    if (!this.isEmpty()) {
      const temp = this.head?.text;
      if (this.head && this.head.next) this.head = this.head.next;
      else this.head = undefined;

      if (this.size > 0) this.size--;

      return temp;
    } else {
      console.log("@pop: List already empty");
    }

    return undefined;
  }

  //maxCount the count will not exceed this
  getMaxWord(maxCount = -1) {
    if(!this.isEmpty()){
        let cur = this.head;
        
        let maxWord = cur;

        for(let i = 0; i < this.size; i++){
            if(maxCount > 0 && cur.count < maxCount && cur.count > maxWord.count) maxWord = cur;
            else if(maxCount < 0 && cur.count > maxWord.count) maxWord = cur;

            cur = cur.next;
        }

        return maxWord;
    }
    return null;
  }

  print(limit = -1) {
    if (!this.isEmpty()) {
      let cur = this.head;
      while (cur) {
        if(limit >= 0 && cur.count == limit) console.log(cur.text);
        else if (limit < 0) console.log(cur.text);
        if (this.isLastWord(cur)) {
          break;
        }

        cur = cur.next;
      }
    } else {
      console.log("@print: List is empty.");
    }
  }

  printObjs() {
    if (!this.isEmpty()) {
      let cur = this.head;
      while (cur) {
        console.log(cur);
        if (this.isLastWord(cur)) {
          break;
        }

        cur = cur.next;
      }
    } else {
      console.log("@print: List is empty.");
    }
  }

  printWithCount(limit = -1) {
    if (!this.isEmpty()) {
      let cur = this.head;
      while (cur) {
        if(limit >= 0 && cur.count == limit) console.log(cur.text + ": " + cur.count)  
        else if(limit < 0) console.log(cur.text + ": " + cur.count);
        if (this.isLastWord(cur)) {
          break;
        }

        cur = cur.next;
      }
    } else {
      console.log("@print: List is empty.");
    }
  }
}

module.exports = {
  WordList,
};
