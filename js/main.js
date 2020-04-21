$(document).ready(function () {

  //riferimento sorgente template handlebars
  var source = $("#movie-template").html();
  //compilo template handlebars
  var template = Handlebars.compile(source);

  $("button").click(function () {
    $(".movie-box").html("") // pulisco div film
    var searchInput = $("input").val(); //salvo stringa campo input
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      dataType: "json",
      data: {
        api_key: "5fad9047b6dddb7c700edc20ddb983a9",
        query: searchInput // query ricercata come output da mandare all'api
      },
      success: function (data) {
        movieList = data.results; // array ottenuto dalla chiamata all'api
        console.log(movieList);

        // ciclo sull'array
        for (var i = 0; i < movieList.length; i++) {
          currentMovie = movieList[i]; // variabile di riferimento ai singoli oggetti / film
          // salvo parametri che voglio estrapolare da ogni singolo oggetto / film
          var context = {
            title: currentMovie.title,
            originalTitle: currentMovie.original_title,
            language: currentMovie.original_language,
            vote: currentMovie.vote_average
          };
          //stampo i film a schermo
          var html = template(context);
          $(".movie-box").append(html)
        }
      },

      error: function (error) {
        alert("errore");
      },

    });
  });




});