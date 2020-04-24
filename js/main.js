$(document).ready(function () {

  //riferimento sorgente template handlebars
  var source = $("#movie-template").html();
  //compilo template handlebars
  var template = Handlebars.compile(source);
  var movieList, tvList;

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

  // funzione che riceve rispettivamente lista oggetti di film e serie tv dalle due chiamate api
  function appendObj(objList) {
    for (var i = 0; i < objList.length; i++) {
      var title, originalName;
      currentObj = objList[i];
      // adegua i nomi dei valori delle chiavi a seconda se viene ricevuta una lista di "movie" o di "tv"
      if (objList === movieList) {
        title = "title";
        originalName = "original_title"
      } else {
        title = "name"
        originalName = "original_name"
      };




      //lista di chiave-valore da ricavare dall'oggetto
      var context = {
        title: currentObj[title],
        originalTitle: currentObj[originalName],
        language: flags(currentObj.original_language),
        vote: vote(currentObj.vote_average),
        cover: coverUrl(currentObj.poster_path),
        overview: truncate(currentObj.overview)
      };


      //stampo il film/serie tv dell'iterazione attuale
      var html = template(context);
      $(".movie__box").append(html)

      //rimuovi titolo originale se uguale al titolo
      if (currentObj[title] === currentObj[originalName]) {
        $('.originale:contains(' + currentObj[originalName] + ')').remove();
      }



    };
  };


  // Funzione gestione lingua che riceve il codice lingua dalla chiamata della funzione 
  function flags(lang) {
    // salvo lista lingua gestite
    var flagsList = [
      'en',
      'it'
    ]
    //se la lista delle lingue disponibili include il codice lingua ricevuto dalla chiamata, ritorna stringa html con lingua parametrizzata nella stringa html
    if (flagsList.includes(lang)) {
      return "<img class='language' src='img/" + lang + ".png'";
    } else {
      return lang; // altrimenti ritorna semplicemente il codice lingua
    };
  };


  //Funzione stelle che riceve il voto in decimali dalla chiamata della funzione
  function vote(rating) {
    voto = Math.ceil(rating / 2); // il voto in quinti corrisponde al voto passato alla funzione in decimali diviso due e arrotondato per eccesso all’unità successiva
    var totStar = ""; // inizializzo variabile contenente stringa tag stelle HTML

    //se l'iterazione attuale è uguale o minore al voto, aggiungi una stella piena al totale delle stelle
    for (var i = 0; i < 5; i++) {
      if (i <= voto) {
        totStar += "<i class='fas fa-star'></i>";
        //altrimenti aggiungi una stella vuota al totale stelle
      } else {
        totStar += "<i class='far fa-star'></i>";
      };
    };
    //ritorna totale stelle
    return totStar;

  };

  function coverUrl(posterPath) {
    var fullUrl = '<img src="https://image.tmdb.org/t/p/w342/' + posterPath + '"alt="" />'
    if (posterPath !== null) {
      return fullUrl;
    }
    return '<img src="img/no_poster.png" alt="">';
  }


  function truncate(input) {
    if (input.length > 200)
      return input.substring(0, 200) + '...';
    else
      return input;
  };




});