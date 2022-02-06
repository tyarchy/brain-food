var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector("#search");
var recentSearchesEl = document.querySelector("#recentSearches");
var categoryBtn = $("#categories");
var bookContainer = document.getElementById("book-content");
var recentSearches = JSON.parse(localStorage.getItem("recentSearches"))?JSON.parse(localStorage.getItem("recentSearches")):[];

// search box event handler - rachel
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from seach input
    var show = searchInputEl.value.trim();
    console.log(show.toLowerCase());

    if(show) {
        saveSearch(show);
        saveSearch(show);
        getApplePodShowRepos(show);
        getSubjectTitles(show);
        searchInputEl.value = "";
        displaySearches();
    } else {
        openModal();
        changeContent("Please enter a valid category");
    }
};
// search box event handler - rachel

// pull from Apple Podcasts API - lilly
var getApplePodShowRepos = function(show) {
    // format the apple api url
    var apiUrl = "https://itunes.apple.com/search?term=" + show + "&entity=podcast&attribute=keywordsTerm&crossorigin=use-credentials&type=module&limit=20";
    
    // make a request to the url
    fetch(apiUrl).then(function(response) {

        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data.results);
                displayPods(data.results)
            });
        // if request fails
        }  else {
            openModal();
            changeContent("Error: search term not found");
        }
        // if connection issue
    }).catch(function(error) {
        // this catch is chained to the end of the ".then"
        openModal('rejected', error);
        changeContent("Error: search term not found. Please try again.");
    });
};
// pull from Apple Podcasts API - lilly

// pull from Open Library API - Josh
var getSubjectTitles = function(book) {

  var apiUrl = "https://openlibrary.org/search.json?q=" + book + "&limit=20";

   fetch(apiUrl, {}).then(function(response) {
     // if request is successful
     if (response.ok) {
      response.json().then(function(data) {
        console.log(data.docs);
        displayBooks(data.docs);
      });
     } else {
      openModal();
      changeContent("Error: search term not found");
     }

    // if connection issue
    }).catch(function(error) {
      // this catch is chained to the end of the ".then"
      openModal('rejected', error);
      changeContent("Error: search term not found. Please try again.");
    });
};
// pull from Open Library API - Josh

// display book fetch results - rachel & tyler
var displayBooks = function (data) {

  $("#book-content").empty();

  for (var i = 0; i < data.length; i++) {
    var bookISBN = data[i].isbn[0];
    var bookCoverImg = "https://covers.openlibrary.org/b/isbn/" + bookISBN + "-M.jpg";
    var bookLink = "https://openlibrary.org/isbn/" + bookISBN + "";

     // book details container
    var bookDetails = document.createElement("a");
    bookDetails.setAttribute("href", bookLink);
    bookDetails.setAttribute("target", "_blank");
    bookDetails.classList = "box";

    // book author 
    var authorName = document.createElement("h1");
    authorName.textContent = data[i].author_name[0];

    // book title 
    var bookTitle = document.createElement("p");
    bookTitle.textContent = data[i].title;

    // book cover image
    var bookImg = document.createElement("img");
    bookImg.setAttribute("src", bookCoverImg);
 
    bookDetails.appendChild(bookImg);
    bookDetails.appendChild(authorName);
    bookDetails.appendChild(bookTitle);
    bookContainer.appendChild(bookDetails);
    };
};
// display book results - rachel & tyler

// function to display podcasts to html - tyler
var displayPods = function(shows) {

    $("#podcasts").empty();
      
    for (let i = 0; i < shows.length; i++) {
        const element = shows[i];
        
        var podcastContainer = document.getElementById("podcasts");

        var image = document.createElement("img");
        image.setAttribute("src", shows[i].artworkUrl100);

        var artist = document.createElement("h1");
        artist.textContent = shows[i].artistName;

        var title = document.createElement("p");
        title.textContent = shows[i].collectionName;
    
        var podcast = document.createElement("a");
        podcast.setAttribute("href", shows[i].trackViewUrl);
        podcast.setAttribute("target", "_blank");
        podcast.classList = "box";

        podcast.appendChild(image);
        podcast.appendChild(artist);
        podcast.appendChild(title);
        podcastContainer.appendChild(podcast);
    };
};
// function to display podcasts to html - tyler

// modals - jessica
// open modal
var openModal = function() {
    var modal = document.querySelector(".modal");
    modal.classList.add('is-active');
}

// change modal text
var changeContent = function(innerText) {
    var modalText = document.querySelector("#modal-text")
    modalText.innerHTML = innerText;
}

// modal trigger
document.addEventListener('DOMContentLoaded', () => {
// Functions to close a modal
function closeModal($el) {
  $el.classList.remove('is-active');
}

function closeAllModals() {
  (document.querySelectorAll('.modal') || []).forEach(($modal) => {
    closeModal($modal);
  });
}

// Add a click event on buttons to open a specific modal
(document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    console.log($target);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});
// modals - jessica

// Save recent searches to local storage - jessica
var saveSearch = function(search) {
  if (recentSearches.indexOf(search)=== -1) {
      recentSearches.push(search)
  
      if (recentSearches.length > 10) {
          recentSearches.shift();
      }

      document.getElementById("recentSearches").innerHTML = recentSearches;
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
};

// Save recent searches to local storage - jessica


// Display array from local storage - jessica & lilly
var displaySearches = function() {
  // if there are no searches, set tasks to an empty array and return out of the function
  if (!recentSearches) {
      return false;
  } else {
  // add UL
  var recentSearchesListEl = document.createElement("div");
  recentSearchesListEl.setAttribute("id", "item");

  // loop through savedSearches array
  for (var i = 0; i < recentSearches.length; i++) {    
    //pass each task object into the html ul section
    var search = document.createElement("button");
    search.setAttribute("value", recentSearches[i]);
    search.textContent = recentSearches[i];

    search.classList = "button is-rounded is-fullwidth";


    recentSearchesListEl.appendChild(search);
    recentSearchesEl.appendChild(recentSearchesListEl);  
  }
};

// make recent searches clickable and display results on page - lilly
$("#item").on("click", "button", function () {
  var buttonText = $(this).attr("value");
  console.log(buttonText);
  recentSearchLoad(buttonText);
});
// make recent searches clickable and display results on page - lilly

var recentSearchLoad = function(load) {
  // get value from seach input

  if(load) {
      getApplePodShowRepos(load);
      getSubjectTitles(load);
      searchInputEl.value = "";
  } else {
      openModal();
      changeContent("Please enter a valid category");
  }
};
// Display array from local storage - jessica & lilly

// category button event listener - rachel
categoryBtn.on("click", function(event) {
  // when any of the category buttons are clicked, the precise one will be identified
  if (event.target.nodeName == "BUTTON") {
      var button = event.target.textContent;
      var category = button.toLowerCase();
      console.log(category);
   
    }
  getApplePodShowRepos(category);
  getSubjectTitles(category);
  });
};

// category button event listener - rachel
searchFormEl.addEventListener("submit", formSubmitHandler);

// display recent searchs on page at page load
displaySearches(recentSearches);
