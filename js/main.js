$(document).ready(function () {

  //riferimento sorgente template handlebars
  var source = $("#movie-template").html();
  //compilo template handlebars
  var template = Handlebars.compile(source);
  var movieList, tvList;
  var url = "https://api.themoviedb.org/3/search/movie"
  //salvo stringa campo input
  var apyKey = "5fad9047b6dddb7c700edc20ddb983a9"




  $("button").click(movieSearch);


  $("input").keypress(function (e) {
    if (e.which == 13) {
      movieSearch();
    };
  });



  var movieGenresList = loadGenres("https://api.themoviedb.org/3/genre/movie/list", apyKey, "movie");
  var tvGenresList = loadGenres("https://api.themoviedb.org/3/genre/tv/list", apyKey, "tv");

  //FUNZIONI


  function movieSearch() {
    $(".movie__box").html("");
    var query = $("input").val();
    apiCall("https://api.themoviedb.org/3/search/movie", apyKey, query, "movies");
    apiCall("https://api.themoviedb.org/3/search/tv", apyKey, query, "tv");
  }


  function loadGenres(urlGenre, apyKey, type) {
    $.ajax({
      type: "get",
      url: urlGenre,
      data: {
        api_key: apyKey,
      },
      success: function (data) {
        genere = data;
        if (type === "movie") {
          return movieGenresList = genere;
        } else {
          return tvGenresList = genere;
        }
      }
    });
  };


  function apiCall(url, apiKey, query, listType) {
    $.ajax({
      url: url,
      method: "GET",
      data: {
        api_key: apiKey,
        query: query // query ricercata come output da mandare all'api
      },
      success: function (data) {
        objList = data.results; // array ottenuto dalla chiamata all'api
        appendObj(objList, listType)
      },
      error: function (error) {
        alert("errore");
      },
    });
  };



  // funzione che riceve rispettivamente lista oggetti di film e serie tv dalle due chiamate api
  function appendObj(objList, listType) {
    for (var i = 0; i < objList.length; i++) {

      var title, originalName;
      currentObj = objList[i];
      // adegua i nomi dei valori delle chiavi a seconda se viene ricevuta una lista di "movie" o di "tv"
      if (listType === "movies") {
        title = "title";
        originalName = "original_title"
        urlActors = "https://api.themoviedb.org/3/movie/"
      } else {
        title = "name"
        originalName = "original_name"
        urlActors = "https://api.themoviedb.org/3/tv/"
      };

      actors(currentObj.id, urlActors)

      //lista di chiave-valore da ricavare dall'oggetto
      var context = {
        title: currentObj[title],
        originalTitle: currentObj[originalName],
        language: flags(currentObj.original_language),
        vote: vote(currentObj.vote_average),
        cover: coverUrl(currentObj.poster_path),
        overview: truncate(currentObj.overview),
        genre: genre(currentObj.genre_ids, listType, movieGenresList, tvGenresList),
        idmovie: currentObj.id
      };



      //stampo il film/serie tv dell'iterazione attuale
      var html = template(context);
      $(".movie__box").append(html);



      //rimuovi titolo originale se uguale al titolo
      if (currentObj[title] === currentObj[originalName]) {
        $('.originale:contains(' + currentObj[originalName] + ')').remove();
      };
    };



  };

  //funzione che interroga l'api per ricevere la lista attori
  function actors(idObject, urlActors) {
    $.ajax({
      type: "get",
      url: urlActors + idObject + "/credits",
      data: {
        api_key: apyKey,
      },
      success: function (data) {
        for (var i = 0; i < 5; i++) {
          if (data.cast[i]) {
            $("#" + idObject).find('.actors').append(data.cast[i].name + " ")
          };
        };
      }
    });
  };


  function genre(currentGenreIds, listType, movieGenresList, tvGenresList) {
    //console.log(movieGenresList.genres[1]);
    console.log(currentGenreIds);
    //console.log(listType);
    if (listType === "movies") {
      var generiFilm = " ";
      //se l'id del film corrente include l'id della lista dei film

      for (let i = 0; i < movieGenresList.genres.length; i++) {
        if (currentGenreIds.includes(movieGenresList.genres[i].id)) {

          console.log(movieGenresList.genres[i].id);

          //console.log(currentGenre, movieGenresList.genres[i].name);
          //console.log('movie')
          generiFilm += movieGenresList.genres[i].name

          return generiFilm
        }
      }
    } else {
      for (var i = 0; i < tvGenresList.genres.length; i++) {
        if (currentGenreIds.includes(tvGenresList.genres[i].id)) {
          //console.log(currentGenre, tvGenresList.genres[i].name);
          //console.log('tv')
          return tvGenresList.genres[i].name
        };
      };
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


  //funzione che compone l'url del poster
  function coverUrl(posterPath) {
    var fullUrl = '<img src="https://image.tmdb.org/t/p/w342/' + posterPath + '"alt="" />'
    if (posterPath !== null) {
      return fullUrl;
    }
    return '<img src="img/no_poster.png" alt="">';
  }


  //funzione che tronca il testo della "overview"
  function truncate(input) {
    if (input.length > 200)
      return input.substring(0, 200) + '...';
    else
      return input;
  };
});