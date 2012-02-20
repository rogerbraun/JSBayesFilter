$.domReady(function() {

  window.filter = new BayesFilter();
  
  window.filter.train("A simple document containing some random words", "good");
  window.filter.train("Animals: Cat, Dog, Capybara, Penguin.", "good");
  window.filter.train("The quick brown fox jumps over the lazy dog.", "good");
  window.filter.train("Do you want Viagra, Cialis or any other penis enhancing drugs?", "bad");
  window.filter.train("How many SEO experts does it take to change a lightbulb lightbulbs free lightbulbs xxx breasts sex", "bad");
  window.filter.train("You have girlfriend Vietnam? Me so horny. Me love you long time.", "bad");

  var currentData = $("#currentData")[0];
  var trainData = $("#trainingData")[0];
  currentData.value = JSON.stringify(window.filter.data, undefined, 2);

  var trainButton = $("#train");
  var classifyButton = $("#classify");
  
  classifyButton.bind("click", function(){
    var results = $("#results")[0];
    var classificationData = $("#classificationData")[0].value;
    var good = filter.categoryProbability(classificationData, "good");
    var bad = filter.categoryProbability(classificationData, "bad");
    if(good > bad) {
      results.innerHTML = "<h3>It's good!</h3>";
    } else {
      results.innerHTML = "<h3>It's bad!</h3>";
    }
    results.innerHTML += "Bad: " + bad + ", Good: " + good + "."; 
  });

  trainButton.bind("click", function(){
    var good = $("#goodClass")[0].checked;
    var klass = ""
    if(good){
      klass = "good";
    } else {
      klass = "bad";
    }
    
    var trainingData = $("#trainingData")[0].value;
    window.filter.train(trainingData, klass);
    currentData.value = JSON.stringify(window.filter.data, undefined, 2);
  });
});
