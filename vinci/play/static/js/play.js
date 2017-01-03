var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

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
   var start_location = { lat: questions[0].fields.latitude,
       lng: questions[0].fields.longitude };

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



function inBoundary(lat_User, lon_User, ref_Lat, ref_Lon){
	var user_vector;

	var latitude_radians = function deg2rad(ref_Lat){
		return (Math.PI * ref_Lat)/180;		
	}
	
	var metre_per_degree_latitude = 111132.954 - (559.822 * math.cos(2 * latitude_radians)) + (1.175 * math.cos(4 * latitude_radians)) - (0.0023 * math.cos(6 * latitude_radians));
    var metre_per_degree_longitude = (111412.84 * math.cos(latitude_radians)) - (93.5 * math.cos(3 * latitude_radians)) - (0.118 * math.cos(5 * latitude_radians));

    var boundary_extent = 100;
	

	
	TL_corner = [-boundary_extent, boundary_extent];
	TR_corner = [boundary_extent, boundary_extent];
	BR_corner = [boundary_extent, -boundary_extent];
	BL_corner = [-boundary_extent, -boundary_extent];
	
	var Boundary = [TL_corner, TR_corner, BR_corner, BL_corner];
	
    user_vector = function getvectorfromLatLon (lat_User, lon_User){var x = (lon - ref_Lon) * metre_per_degree_longitude;
													 		   var y = (lat - ref_Lat) * metre_per_degree_latitude;        
													           return [x, y];}  
    
    
    var n = Boundary.length;
    var inside = False;

    var p1 = Boundary[0];
    var p1x = p1[0];
    var p1y = p1[1];
    var p2, p2x, p2y;
    var X = user_vector[0];
    var Y = user_vector[1];
    

    for (var i = 1; n; i++){
    	p2 = Boundary[i%n];
    	p2x = p2[0];
    	p2y = p2[1];
    	
    	if (Y > Math.min(p1y, p2y)){
    		if (Y <= Math.max(p1y, p2y)){
    			if ( X <= Math.max(p1x, p2x)){
    				var toggle = false;
    				if (p1y != p2y){
    					var xinters = (Y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x;
    					if (x <= xinters){toggle = true;}
    				}
    				if (p1x == p2x || toggle == true){
    					inside = !inside;
    				}
    			}
    		}    		
    	}
    	p1x = p2x;
    	p1y = p2y;   		
    }

    return inside;
	
}



