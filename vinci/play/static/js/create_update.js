var questionIndex = 0;
var UserCoords = {};
var target = {
		  latitude : 0,
		  longitude: 0
		};

var labelIndex = 0;
var start_location = new google.maps.LatLng(51.53,-0.13);	

      
 
$(document).ready(function(){
	initialize();
	google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
      });
	
	
	//When document is ready, set the form submit to ajax post the new question and get 
	$("#question").submit(function (event){
        event.preventDefault();
        create_question(trail_id)
	});
	
	$('input[type=checkbox]').change(
		    function(){
		        if (this.checked) {
		            $("#loc_ans_toggler").show();
		        }
		        else{$("#loc_ans_toggler").hide();}
		    });
});


async function create_question(trail_id) {
//This funnction posts the new question to create it and then overwirtes the question
// json object.
//
let url = 'http://localhost:8080/create-question?id=' + trail_id;
let formData = $('form').serialize()
// Add headers
var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

const response = await fetch(url, {
                          headers: headers,
                          credentials:'same-origin',
                          method: "post", 
                          body: formData
                        })
json = await response.json()
questions = json;
return questions
}

function updateJSON(){
	if (questionLocationCheck == true){
		questions[questionIndex].fields.discovered = true;
		updateQuestions();	
	}
	else if (answerLocationCheck = true){
		var questionID = questions[questionIndex].pk;		
		post_correct(questionID).then(updateQuestions());	
	}
}

function update(){
	
	questionLocationCheck = false;
	answerLocationCheck = false;
//Check values for field names here	
	if (questions[questionIndex].fields.discovered == true){
		if(questions[questionIndex].fields.location_answer == true){
			answerLocationCheck = true;
			target.latitude = questions[questionIndex].fields.answer_latitude;
			target.longitude = questions[questionIndex].fields.answer_longitude;
					
		}
		else{
			target.latitude = "";
			target.longitude = "";
		}
		
	}
	else{
		questionLocationCheck = true;	
		target.latitude = questions[questionIndex].fields.latitude;
		target.longitude = questions[questionIndex].fields.longitude;
		
	}	
}

$(document).on('submit','#qform',function(e){
	e.preventDefault();
	var answer = $(this).find('.answer').val();
	if (answer == questions[questionIndex].fields.answer){		
		var questionID = questions[questionIndex].pk;		
		post_correct(questionID).then(updateQuestions());
	}
});



$(function(){
	$(document).on("click",".qbox", function(event) {
		var target = $(event.target);
	      if(target.is(".answer") || target.is("#submit")) return;
	      else {$(this).find(".toggler").toggle();}		
	  } );
	});

$(function(){
	var dialog, form;
	
	$( "#InputCoords" ).click( function() {
		document.getElementById('TLat').innerHTML = target.latitude;
		document.getElementById('TLon').innerHTML = target.longitude;
		dialog.dialog( "open" );
	  } );
	
	function updateLatLon(){
		UserCoords.latitude = document.getElementById("Ulat").value;
		UserCoords.longitude = document.getElementById("Ulon").value;
		let found = inBoundary(UserCoords.latitude, UserCoords.longitude, target.latitude, target.longitude);
		if (found == true){
			  updateJSON();
		}
	}	

	dialog = $( "#dialog-form" ).dialog({
	    autoOpen: false,
	    height: 400,
	    width: 350,
	    modal: true,
	    position: {
	    	   my: "center",
	    	   at: "center",
	    	   of: window},
	    buttons: {
	      "Submit LatLon": function(){
	    	  $(this).dialog('close');
	    	  updateLatLon();
	      },
	      Cancel: function() {
	        dialog.dialog( "close" );
	      }
	    }
	  });

});


