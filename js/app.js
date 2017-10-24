var map;

var ViewModel = function () {

  var self = this;

  self.locationsList = ko.observableArray([]);
  self.filteredLocations = ko.observableArray([]);

  self.initMap = function() {
      var sf = {lat: 37.774929, lng: -122.419416};
      var mapCanvas = document.getElementById('map');
      var mapOptions = {
          disableDefaultUI: true,
          center: sf,
          zoom: 12
      };
      map = new google.maps.Map(mapCanvas, mapOptions);
      };

  self.initialLocations = function() {
    initialLocations.forEach(function(locationItem) {
      self.locationsList().push( new Location(locationItem));
    });
  };

  self.initMap();
  self.initialLocations();

  self.query = ko.observable('');

  self.filterLocations = ko.computed(function() {

    self.filteredLocations([]);
    var search = self.query().toLowerCase();
    console.log(search);
    for (var i = 0; i < self.locationsList().length; i++) {
      var title = self.locationsList()[i].title().toLowerCase();
      if (title.indexOf(search) >= 0 ) {
        self.filteredLocations.push(self.locationsList()[i]);
        // console.log('filtered');
        // console.log(self.filteredLocations());
        self.locationsList()[i].marker().setVisible(true);
      } else {
        self.locationsList()[i].marker().setVisible(false);
      }
    }
  });
};

  var Location = function (data) {

    var self = this;

    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.wiki = ko.observable(data.wiki);

    var marker = new google.maps.Marker({
      map: map,
      title: this.title(),
      position: new google.maps.LatLng(this.lat(), this.lng()),
      animation: google.maps.Animation.DROP,
    });

    this.marker = ko.observable(marker);

    infoWindow = new google.maps.InfoWindow();

    self.infoWindow = function () {

      var readMore = 'https://en.wikipedia.org/wiki/' + data.wiki;
      var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exchars=250&exintro=&explaintext=&titles=' + data.wiki;
      $.ajax({
          url: url,
          type: 'GET',
          data: {},
          dataType: 'jsonp'

      }).done(function(response) {
          console.log('Request done!');
          var extract = response.query.pages[Object.keys(response.query.pages)[0]].extract;
          var contentString = '<div>' + '<h2>' + data.title + '</h2>' + extract + '<p>' + '<a href="' + readMore + '" target="_blank"><b>Read more on Wikipedia</b></a></div>';
          infoWindow.setContent(contentString);

      }).fail(function() {
          console.log('Error!');
          infoWindow.setContent('<p><b>Looks like you went offline.</b></p><p>Cant fetch information. Check your connection</p>');

      });
  		infoWindow.open(map, marker);

  	};

    self.pan = function() {
      map.panTo(new google.maps.LatLng(this.lat(), this.lng()));
    };

    self.bounce = function () {
  		marker.setAnimation(google.maps.Animation.BOUNCE);
  		setTimeout(function () {
  			marker.setAnimation(null);
  		}, 700);
  	};

    this.showInfo = function () {
      self.infoWindow();
      self.bounce();
      self.pan();
    };

    marker.addListener('click', function () {
      self.showInfo();
    });
  };

function initialize() {
  ko.applyBindings(new ViewModel());
}
