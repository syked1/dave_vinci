// JavaScript associated with setting the map for basic functionality on all screens

var markers = [];
var map;
var infowindow;
var icons = {};



function initialize() {
	var start_location = new google.maps.LatLng(51.53,-0.13);
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: start_location
    });
    
    var iconBase = 'http://maps.google.com/mapfiles/ms/icons/';
    icons = {
      pin: {
        icon: iconBase + 'pushpin_shadow.png'
      }
    };
    
    var listener = google.maps.event.addListener(map, "zoom_changed", function() { 
  	  if (map.getZoom() > 10) map.setZoom(10); 
  	  google.maps.event.removeListener(listener); 
  	});
        
 // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    if (input == !null){
        google.maps.event.addListener(map, 'click', function(event) {
            addMarker(event.latLng, map);
          });
    	var searchBox = new google.maps.places.SearchBox(input);
    	infowindow = new google.maps.InfoWindow();
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        
        
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              });
          
          	markers.push(marker);
          	
            google.maps.event.addListener(marker, 'click', function() {
            	infowindow.marker = marker;
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                  'Place ID: ' + place.place_id + '<br>' +
                  place.formatted_address + '</div>'+'<button onclick="selectMarker()" class="btn btn-info">Select</button> ');
                infowindow.open(map, this);
              });

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
          

          
        });
    }
  initPage();  
}


  // Adds a marker to the map.
function addMarker(location, map, selected = false) {
	if(window.location.pathname == "/create-update"){
		var lab = "";
	}
	else{
		var label = questionIndex + 1; //need to deal with this for update screen
		lab = label.toString();
	}
	if(selected == true){
		icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
	}
	else{
		var icon = icon;
		}
	infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      position: location,
      label: lab,
      icon: icon,
      map: map
      
    });
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
    	infowindow.marker = marker;
        infowindow.setContent('<div>Positions: ' + this.position + '<br></div>'+ '<button onclick="selectMarker()" class="btn btn-info">Select</button> ');
        infowindow.open(map, this);
      });
}



function refitMap(){
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
		 bounds.extend(markers[i].getPosition());
		}
		map.fitBounds(bounds);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
    
  }

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function selectMarker(){
	var selectedmarker = infowindow.anchor;
	deleteMarkers();
	var LATLON = { lat: selectedmarker.getPosition().lat(),
	       lng: selectedmarker.getPosition().lng() };
    var marker = new google.maps.Marker({
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        position: LATLON
      });
	markers.push(marker);
	updateLatLng(LATLON);
	
}

