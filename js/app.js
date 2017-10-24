var map;

var initialLocations = [
    {title:'San Francisco Museum of Modern Art', lat: 37.785718, lng: -122.401051, wiki:'San_Francisco_Museum_of_Modern_Art'},
    {title:'de Young Museum', lat: 37.771469, lng: -122.468676, wiki:'De_Young_(museum)'},
    {title:'Fine Arts Museums of San Francisco', lat: 37.771516, lng: -122.468647, wiki:'Fine_Arts_Museums_of_San_Francisco'},
    {title:'Asian Art Museum', lat: 37.780164, lng: -122.416199, wiki:'Asian_Art_Museum_(San_Francisco)'},
    {title:'Legion of Honor', lat: 37.784466, lng: -122.500842, wiki:'Legion_of_Honor_(museum)'},
    {title:'Beat Museum', lat: 37.798065, lng: -122.406226, wiki:'Beat_Museum'},
    {title:'California Academy of Sciences', lat: 37.769865, lng: -122.466095, wiki:'California_Academy_of_Sciences'},
    {title:'San Francisco Museum and Historical Society', lat: 37.782722, lng: -122.407235, wiki:'San_Francisco_Museum_and_Historical_Society'},
    {title:'Contemporary Jewish Museum', lat: 37.786009, lng: -122.403701, wiki:'Contemporary_Jewish_Museum'},
    {title:'The Walt Disney Family Museum', lat: 37.801455, lng: -122.4586561, wiki:'Walt_Disney_Family_Museum'},
    {title:'Musée Mécanique', lat: 37.809340, lng: -122.416061, wiki:'Musée_Mécanique'}
];

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
        self.locationsList()[i].marker().setMap(map);
      } else {
        self.locationsList()[i].marker().setMap(null);
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
