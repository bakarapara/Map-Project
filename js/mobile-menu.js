var menu = document.getElementById('menu');
var drawer = document.querySelector('.side-box');

menu.addEventListener('click', function(e) {
  drawer.classList.toggle('opened');
  e.stopPropagation();
});

menu.addEventListener('click', function() {
  drawer.classList.remove('open');
});
