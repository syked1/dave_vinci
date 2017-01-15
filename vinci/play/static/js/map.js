// JavaScript associated with setting the map for basic functionality on all screens

var markers = [];
var map;


function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: start_location
    });
    
    var listener = google.maps.event.addListener(map, "zoom_changed", function() { 
  	  if (map.getZoom() > 10) map.setZoom(10); 
  	  google.maps.event.removeListener(listener); 
  	});
}


  // Adds a marker to the map.
function addMarker(location, map) {
	var label = questionIndex + 1;
	var lab = label.toString();
    var marker = new google.maps.Marker({
      position: location,
      label: lab,
      map: map
    });
    markers.push(marker);
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



