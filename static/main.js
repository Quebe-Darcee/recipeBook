function get(id) {
   return document.getElementById(id);
}

function validateNotEmpty(input, feedback) {
   var value = input.value.trim();
   if (!value.length > 0)
   {
      get(feedback).style.visibility = "visible";
   }
   else
   {
      get(feedback).style.visibility = "hidden";  
   } 
}

// function nextSlide() {
//    var current = document.getElementById("carousel").lastElementChild;
//    current.parentElement.prepend(current);
// }

// function previousSlide() {
//    var current = document.getElementById("carousel").firstElementChild;
//    current.parentElement.append(current);
// }

carousel = {};
carousel.element = get("carousel");
carousel.images = ['food1.jpg', 'food2.jpg',  'food3.jpg', 'food4.jpg'];
carousel.next = function() {
   this.images.unshift(this.images.pop());
   this.render()
}
carousel.prev = function() {
   this.images.push(this.images.shift());
   this.render();
}
carousel.render = function() {
   this.element.innerHTML = '';
   for (var i=0; i < this.images.length; i++) {
      const image = this.images[i];
      this.element.innerHTML += '<a href="#" class="carousel-item"><img src="/static/' + image + '"></a>';
   }
}

window.carousel = carousel;
carousel.render();



// function Carousel(element, images) {
//    this.element = element;
//    this.images = images;
//    this.next = function() {};
//    this.prev = function() {};
//    this.render = function() {};
// }


