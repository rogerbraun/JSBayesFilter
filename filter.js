// Add mysteriously missing functions

Array.prototype.contains = function(element) {
  return this.some(function(cmpElement){
    return element === cmpElement;
  });  
}

Array.prototype.uniq = function(){
  return this.reduce(function(result, element){
    if(!result.contains(element)){
      result.push(element);
    }
    return result;
  }
  ,[]);
}

BayesFilter = function() {

  // Variables
  this.klasses = [];
  this.data = {};
  this.documentCount = 0;


  // Helpers
  this.helpers = {};

  this.helpers.getWordSet = function(text) {
    var split = text.split(/\W/); // Split on everything that isn't a word character. TODO: Rethink for utf-8
    split = split.filter(function(word){return word != ""}); // Remove empty strings
    split = split.map(function(word){return word.toLowerCase()}); // Make everything lowercase
    split = split.uniq(); // Get only unique words
    return split
  };

  this.helpers.addWordSet = function(oldData, words, klass) {
    // How do I clone objects?
    var newData = oldData;
    for(var i = 0; i < words.length; i++){
      word = words[i]; 
      if(newData[word]) {
        if(newData[word][klass]){
          newData[word][klass] += 1;
        } else {
          newData[word][klass] = 1;
        }
      } else {
        newData[word] = {};
        newData[word][klass] = 1;
      } 
    }
    return newData;
  }

  this.helpers.addKlass = function(oldKlasses, klass) {
    // How do I clone arrays? Not needed as I reduce it, producing a new array.
    oldKlasses.push(klass);
    return oldKlasses.uniq();
  }

  // Functions
  this.train = function(text, klass) {
    var words = this.helpers.getWordSet(text);
    this.data = this.helpers.addWordSet(this.data, words, klass);
    this.klasses = this.helpers.addKlass(this.klasses, klass);  
    this.documentCount += 1;
  };

}
