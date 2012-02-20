$.domReady(function() {

  window.filter = new BayesFilter();
  
  window.filter.train("A simple document containing some random words", "good");
  window.filter.train("Animals: Cat, Dog, Capybara, Penguin.", "good");
  window.filter.train("The quick brown fox jumps over the lazy dog.", "good");
  window.filter.train("Do you want Viagra, Cialis or any other penis enhancing drugs?", "bad");
  window.filter.train("How many SEO experts does it take to change a lightbulb lightbulbs free lightbulbs xxx breasts sex", "bad");
  window.filter.train("You have girlfriend Vietnam? Me so horny. Me love you long time.", "bad");

  var trainButton = $("#train");

  trainButton.bind("click", function(){
    alert("yay");
  });
});
