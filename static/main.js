function nextSlide() {
   var current = document.getElementById("carousel").lastElementChild;
   current.parentElement.prepend(current);
}

function previousSlide() {
   var current = document.getElementById("carousel").firstElementChild;
   current.parentElement.append(current);
}