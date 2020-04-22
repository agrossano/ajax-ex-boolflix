$(document).ready(function () {

  //riferimento sorgente template handlebars
  var source = $("#movie-template").html();
  //compilo template handlebars
  var template = Handlebars.compile(source);

  $("button").click(function () {
    $(".movie__box").html("")
    // pulisco div film
    var searchInput = $("input").val(); //salvo stringa campo input
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: "5fad9047b6dddb7c700edc20ddb983a9",
        query: searchInput // query ricercata come output da mandare all'api
      },
      success: function (data) {
        movieList = data.results; // array ottenuto dalla chiamata all'api
        appendObj(movieList)
      },
      error: function (error) {
        alert("errore");
      },

    });

    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
        api_key: "5fad9047b6dddb7c700edc20ddb983a9",
        query: searchInput // query ricercata come output da mandare all'api
      },
      success: function (data) {
        tvList = data.results; // array ottenuto dalla chiamata all'api
        appendObj(tvList)
      }
    });

  });



  //FUNZIONI

  function appendObj(objList) {

    for (var i = 0; i < objList.length; i++) {
      var title, originalName;
      currentObj = objList[i];
      if (objList === movieList) {
        title = "title";
        originalName = "original_title"
      } else {
        title = "name"
        originalName = "original_name"
      };

      var context = {
        title: currentObj[title],
        originalTitle: currentObj[originalName],
        language: flags(currentObj.original_language),
        vote: vote(currentObj.vote_average)
      };
      //stampo i film a schermo
      var html = template(context);
      $(".movie__box").append(html)
    };
  };


  function flags(lang) {
    var flagsList = [
      'en',
      'it'
    ]
    if (flagsList.includes(lang)) {
      return "<img class='language' src='img/" + lang + ".png'";
    } else {
      return lang;
    };
  };


  function vote(rating) {
    var totStar = "";
    voto = Math.ceil(rating / 2);
    for (var i = 0; i < 5; i++) {
      if (i <= voto) {
        totStar += "<i class='fas fa-star'></i>";
      } else {
        totStar += "<i class='far fa-star'></i>";
      };
    };
    return totStar;

  };



});