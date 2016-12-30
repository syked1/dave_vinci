var json = '{{ question_json | escapejs }}';
//var questions = JSON.parse(json);
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
//Dummy variables for questions
var num_questions = 3;
var latitude = 54.444;
var longitude = 120.39;


$(document).ready(function(){
	initialize();
	google.maps.event.addDomListener(window, 'load', initialize);
	
	for (var i=0; i<=labelIndex; i++){
		
		
		//logic in here to go through the questions in the JSON and check if they have been completed or not
		
		
		$('#questions').prepend('<div class="qbox" type="submit"> '+
									'<input id="qselect" type="submit" value="Question '+ (i+1) + '">'+
									   '<div class="toggler">'+
									   	'<div id="effect" class="ui-widget-content ui-corner-all">'+
											'<div id="qDetails" class="question">'+
											   	'<form method="post">' +
											   	'<p><strong>Q.</strong> XYZ</p>'+
											   	'<label type="answer" >A. </label>' +
											    '<span><input class="answer" name="a_value" type="text" /></span>' +	
											   	'<input id="submit" type="submit" value="SUBMIT">'+
											   	'</form>'+
										    '</div>'+
										'</div>'+
									'</div>'+
							   '</div>'
							);						
	}	
	
	$('.toggler').hide();
});


function initialize() {
//    var start_location = { lat: questions[0].fields.latitude,
//       lng: questions[0].fields.longitude };
	var start_location = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: start_location
    });

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, map);
    });

    // Add a marker at the center of the map.
    addMarker(start_location, map);
}


  // Adds a marker to the map.
function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
      position: location,
      label: labels[labelIndex++ % labels.length],
      map: map
    });
}


$( function() { 
    // Set effect from select menu value
    $( ".qbox" ).on( "click", function(e) {
      if($(e.target).is(".answer")) return;
      $(this).find(".toggler").toggle();
    });
  } );

function inBoundary(lat, long){
	
	
	
}

function latlonVectorMachine(lat, lon){
	
	
	
}

function vectorLatLonMachine(x,y){
	
	
}