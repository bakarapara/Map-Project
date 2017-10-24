var menu = document.getElementById('menu');
var drawer = document.querySelector('.side-box');

menu.addEventListener('click', function(e) {
  drawer.classList.toggle('opened');
  e.stopPropagation();
});

menu.addEventListener('click', function() {
  drawer.classList.remove('open');
});

var missingMap = function () {
  var map = document.getElementById('map');
  map.innerHTML += '<div class="error-message"><p><b>Looks like you went offline.</b></p><p>Cant fetch information. Check your connection</p></div>';
  console.log('Error loading map');
}
