//Simple getter
function get(id) {
   return document.getElementById(id);
}

//Form Validation
function validateNotEmpty(input, feedback, inputID) {
   var value = input.value.trim();
   if (!value.length > 0)
   {
     get(feedback).style.visibility = "visible";
     get(inputID).className += "input-invalid";
   }
   else
   {
      get(feedback).style.visibility = "hidden";
      get(inputID).classList.remove('input-invalid');
   }
}

// Shake recipe icon
function saveRecipe() {
   var icon = get("recipe-icon");
   icon.className += " recipe-shake";
}

//Carousel
carousel = {};
carousel.element = get("carousel");
carousel.images = ['food1.jpg', 'food2.jpg',  'food3.jpg', 'food4.jpg'];
carousel.next = function() {
  console.log("next function activated");
   this.images.unshift(this.images.pop());
   this.render()
}
carousel.prev = function() {
   this.images.push(this.images.shift());
   this.render();

}
carousel.render = function() {
   if (!this.element) { return; }
   this.element.innerHTML = '';
   for (var i=0; i < this.images.length; i++) {
      const image = this.images[i];
      this.element.innerHTML += '<a href="#" class="carousel-item"><img src="/static/' + image + '"></a>';
   }
}

carousel.render();

//Book
book = {};
book.show = function(index) {
  var pages = document.getElementsByClassName("book");
  for (var i=0; i<pages.length; i++)
  {
    pages[i].style.display = "none";
  }
  var book = get("book-" + index)
  if (!book) return;
  book.style.display = "flex";
}
book.index = 1;
book.next = function() {
  var pages = document.getElementsByClassName("book");
  var totalPages = pages.length;
  this.index++;
  if (this.index > totalPages)
    this.index = totalPages;
  this.show(this.index);
}
book.prev = function() {
  this.index--;
  if (this.index < 1)
    this.index = 1;
  this.show(this.index);
}
book.show(1);

//get("carousel").ontouchstart = this.next;

// welcome alert
function welcomeAlert() {
  if (window.location.pathname == "/")
  {
      alert("Welcome! We hope you find a recipe you like.");
  }
}

//Local Storage and Favorites Tab
favorites = {};
favorites.names = {};
favorites.load = function() {
   this.names = JSON.parse(localStorage.getItem("favorites")) || {};
}
// Save favorites to local storage
favorites.save = function() {
   localStorage.setItem("favorites", JSON.stringify(this.names));
}
// Add a favorite to the favorite.names object and save to local storage
favorites.add = function(name) {
   this.names[name] = true;
   this.save();

   //get("addFavorites").innerHTML = '<span>| Added</span>';
}
// Remove from favorites and save to locale storage
favorites.remove = function(name) {
   delete this.names[name];
   this.save();
   this.render();
}
favorites.renderRecipe = function(name, recipe) {
   ingredients = recipe.ingredients.replace(/\\n/g, "<br>").replace(/\\r/g, "").replace(/\\t/g, "\t");
   return `
      <h3>${name}<a id="removeFavorites" href="#" onclick="window.favorites.remove('${name}')">| Remove from Favorites</a></h3>
      <img src="${recipe['image'] || ''}">
      <p><strong>Ingredients:</strong></p>
      <p>${ingredients}</p>
      <p><strong>Directions:</strong></p>
      <p>${recipe['directions']}</p>
      <hr>
   `;
}
favorites.render = function() {
   var element = get("favorites");
   if (!element) { return; }

   element.innerHTML = '';

   var keys = Object.keys(this.names);
   for (var i=0; i < keys.length; i++)
   {
      name = keys[i];
      recipe = recipes[name];

      element.innerHTML += this.renderRecipe(name, recipe);
   }
}

favorites.load();
favorites.render();

//Star Favorites
function addStar(id) {
   var cvs = document.createElement("canvas");
   cvs.id = "mycanvas";
   cvs.setAttribute("height", "20px");
   cvs.setAttribute("width", "25px");
   var list = get(id);
   if (!list) return;
   list.insertBefore(cvs, list.childNodes[0]);

   var canvas = cvs;
   var ctx = canvas.getContext('2d');
   function star(ctx) {
      ctx.clearRect(0, 0, 200, 200);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.moveTo(10.8, 0.0);
      ctx.lineTo(14.1, 7.0);
      ctx.lineTo(21.8, 7.83);
      ctx.lineTo(16.2, 13.1);
      ctx.lineTo(17.5, 20.5);
      ctx.lineTo(10.8, 17.0);
      ctx.lineTo(4.12, 20.5);
      ctx.lineTo(5.5, 13.1);
      ctx.lineTo(.1, 7.8);
      ctx.lineTo(7.5, 6.8);
      ctx.lineTo(10.8, 0);
      ctx.closePath();
      ctx.fill();
   }
   deg = 0;
   star(ctx);
}

var favs = Object.keys(favorites.names);
for (i=0; i<favs.length; i++)
{
   var name = favs[i].replace(/ /g, '-');
   addStar(name);
}

//Search Similar recipes
function displayResults(items, id) {
  var prevResults = get('search-results');
  if (prevResults)
  {
    prevResults.parentElement.removeChild(prevResults);
  }
  console.log(items, id);
  var button = get(id);
  var html = '';
  for (var i=0; i < items.length; i++) {
    var item = items[i];
    html += `<a target="_blank" href="${item.link}">${item.title}</a><br><p>${item.snippet}</p>`
  }
  button.insertAdjacentHTML('afterend', `<div id="search-results">${html}</div>`);
}
function searchRecipes(name, id) {
  var key = window.gapi;
  var cx = window.gcx;
  var url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${name}`;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var items = JSON.parse(this.responseText).items;
      console.log(items);
      displayResults(items, id);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();

  // var items = [{
  //     title: 'Quick and Easy Pizza',
  //     link: "https://www.allrecipes.com/recipe/20171/quick-and-easy-pizza-crust/",
  //     snippet: "A quick chewy pizza crust can be made in 30 minutes with just basic pantry ingredients like yeast, flour, vegetable oil, sugar, and salt."
  //   },
  //   {
  //     title: 'Quick and Easy Sauce',
  //     link: "https://www.allrecipes.com/recipe/20171/quick-and-easy-pizza-crust/",
  //     snippet: "A quick sauce."
  //   }];
}

// remove add to favorites link if already in favorites list
//   document.get(addFavorites).style.visibility = "hidden";
