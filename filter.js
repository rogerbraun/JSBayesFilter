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
  this.klasses = {};
  this.data = {};
  this.assumedProbability = 0.5;
  this.assumedProbabilityWeight = 1;
  this.documentCount = 0;


  // Helpers
  this.helpers = {};

  this.helpers.getWordSet = function(text) {
    var split = text.split(/\W/); // Split on everything that isn't a word character. TODO: Rethink for utf-8
    split = split.filter(function(word){return word != ""}); // Remove empty strings
    split = split.map(function(word){return word.toLowerCase()}); // Make everything lowercase
    split = split.uniq(); // Get only unique words
    return split;
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
    if(oldKlasses[klass]){
      oldKlasses[klass] += 1;
    } else {
      oldKlasses[klass] = 1;
    }
    return oldKlasses;
  }


  // Functions
  
  this.wordCount = function(word, klass) {
    word = word.toLowerCase();
    if(this.data[word] && this.data[word][klass]){
      return this.data[word][klass];
    } else {
      return 0;
    }
  }

  this.totalWordCount = function(word) {
    word = word.toLowerCase();
    var count = 0;
    if(this.data[word]){
      for(klass in this.data[word]){
        count += this.data[word][klass]; 
      }
    }
    return count;
  }
  
  this.wordProbability = function(word, klass) {
    word = word.toLowerCase();
    if(this.data[word] && this.data[word][klass]) { // Word must exist and class must exist
      var wordCount = this.data[word][klass];
      var klassCount = this.klasses[klass];
      return wordCount / klassCount;
    } else {
      return 0;
    }
  }

  this.weightedProbability = function(word, klass) {
    word = word.toLowerCase();
    var unweightedProbability = this.wordProbability(word, klass);
    var totalWordCount = this.totalWordCount(word);
    return ((this.assumedProbability * this.assumedProbabilityWeight) + (totalWordCount * unweightedProbability)) / (this.assumedProbabilityWeight + totalWordCount);
  }

  this.documentProbability = function(dokument, klass) {
    var probability = 1;
    var words = this.helpers.getWordSet(dokument);
    for(i = 0; i < words.length; i++){
      var word = words[i];
      probability = probability * this.weightedProbability(word, klass);
    }     
    return probability;
  }

  this.categoryProbability = function(dokument, klass) {
    var documentProbability = this.documentProbability(dokument, klass);
    var categoryProbability = this.data[klass] / this.documentCount; // think of new name
    return documentProbability * categoryProbability;
  }

  this.train = function(text, klass) {
    var words = this.helpers.getWordSet(text);
    this.data = this.helpers.addWordSet(this.data, words, klass);
    this.klasses = this.helpers.addKlass(this.klasses, klass);  
    this.documentCount += 1;
    return this;
  };

}
