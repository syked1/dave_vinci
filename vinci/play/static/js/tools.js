// functions that may be useful across multiple screens


function inBoundary(lat_User, lon_User, ref_Lat, ref_Lon){
	var user_vector;
	
	function deg2rad(reference_Lat){
		return (Math.PI * ref_Lat)/180;		
	}

	var latitude_radians =  deg2rad(ref_Lat);
	
	var metre_per_degree_latitude = 111132.954 - (559.822 * Math.cos(2 * latitude_radians)) + (1.175 * Math.cos(4 * latitude_radians)) - (0.0023 * Math.cos(6 * latitude_radians));
    var metre_per_degree_longitude = (111412.84 * Math.cos(latitude_radians)) - (93.5 * Math.cos(3 * latitude_radians)) - (0.118 * Math.cos(5 * latitude_radians));

    var boundary_extent = 100;
	

	
	TL_corner = [-boundary_extent, boundary_extent];
	TR_corner = [boundary_extent, boundary_extent];
	BR_corner = [boundary_extent, -boundary_extent];
	BL_corner = [-boundary_extent, -boundary_extent];
	
	var Boundary = [TL_corner, TR_corner, BR_corner, BL_corner];
	
	function getvectorfromLatLon (lat_User, lon_User){
		var x = (lon_User - ref_Lon) * metre_per_degree_longitude;
	   var y = (lat_User - ref_Lat) * metre_per_degree_latitude;        
	   return [x, y];
	   }
	
    user_vector = getvectorfromLatLon(lat_User, lon_User);    
    
    var n = Boundary.length;
    var inside = false;

    var p1 = Boundary[0];
    var p1x = p1[0];
    var p1y = p1[1];
    var p2, p2x, p2y;
    var X = user_vector[0];
    var Y = user_vector[1];
    

    for (var i = 1; i<=n; i++){
    	p2 = Boundary[i%n];
    	p2x = p2[0];
    	p2y = p2[1];
    	
    	if (Y > Math.min(p1y, p2y)){
    		if (Y <= Math.max(p1y, p2y)){
    			if ( X <= Math.max(p1x, p2x)){
    				var toggle = false;
    				if (p1y != p2y){
    					var xinters = (Y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x;
    					if (X <= xinters){toggle = true;}
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

async function geolocator(target){
	var watchID;
	var geoloc;
	var targetfound = false;
	
	var options = {
			  enableHighAccuracy: true,
			  timeout: 5000,
			  maximumAge: 0
			};
	
	function success(pos) {
		  UserCoords = pos.coords;
		  targetfound = inBoundary(UserCoords.latitude, UserCoords.longitude, target.latitude, target.longitude)
		  if (targetfound == true){
			  geoloc.clearWatch(watchID);
			  updateJSON();
		  }
	}
	
	function error(err) {
		  console.warn('ERROR(' + err.code + '): ' + err.message);
		}
	
	function closegeolocation(){
		
	}
	
	if (navigator.geolocation){
		
		geoloc = navigator.geolocation;
		watchID = geoloc.watchPosition(success, error, options);		
	}
	else {
		custom_alert("Geolocation Not Supported","Warning");
	}
}

function custom_alert(output_msg, title_msg)
{
    if (!title_msg)
        title_msg = 'Alert';

    if (!output_msg)
        output_msg = 'No Message to Display.';

    $("<div></div>").html(output_msg).dialog({
        title: title_msg,
        resizable: false,
        modal: true,
        buttons: {
            "Ok": function() 
            {
                $( this ).dialog( "close" );
            }
        }
    });
}



async function post_correct(question_id) {
    
    let url = 'http://localhost:8080/correct?id=' + question_id
    
    const response = await fetch(url, {credentials: 'same-origin'});
    json = await response.json();
    return json
    
}

