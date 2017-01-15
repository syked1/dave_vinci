var questionIndex = 0;
var questionLocationCheck = false;
var answerLocationCheck = false;
var UserCoords = {};
var target = {
		  latitude : 0,
		  longitude: 0
		};
var start_location = { lat: questions[0].fields.latitude,
	       lng: questions[0].fields.longitude };

$(document).ready(function(){
	initialize();
	google.maps.event.addDomListener(window, 'load', initialize);
	updateQuestions();	
});

function updateQuestions(){
	//might be able to do something here to work from the question index so not all the questions and markers are updated
	$("#questions").html("");
	deleteMarkers();
	
	for (var i=0; i< questions.length; i++){
	    // Add a marker at the center of the map.
		var question_location = { lat: questions[i].fields.latitude,
			       lng: questions[i].fields.longitude };
		questionIndex = i;
	    addMarker(question_location, map);
	    
	    
	    if (questions[i].fields.correct == true){
	    	rendercorrectQuestion(i);	
	    }
	    else if(questions[i].fields.discovered == true){
	    	renderdiscoveredQuestion(i);
	    	break;
	    }
	    else{
	    	questionLocationCheck = true;
	    	break;
	    }
		
	}
	$('.toggler').hide();
	if (questionIndex > 0){
		refitMap();
	}	
	play();
}

function rendercorrectQuestion(j){	

		$('#questions').prepend('<div class="qbox" type="submit"> '+
				'<input id="qselect" type="submit" value="Question '+ (j+1) + '">'+
				   '<div class="toggler">'+
				   	'<div id="effect" class="ui-widget-content ui-corner-all">'+
						'<div id="qDetails" class="question">'+
						   	'<p><strong>Clue.</strong>'+ questions[j].fields.question  +'</p>'+
						    '<p><strong>A.</strong>'+ questions[j].fields.answer  +'</p>' +	
					    '</div>'+
					'</div>'+
				'</div>'+
		   '</div>'
		);			
	
}

function renderdiscoveredQuestion(k){
	
	if (questions[k].fields.locationanswer == true){
		$('#questions').prepend('<div class="qbox" type="submit"> '+
				'<input id="qselect" type="submit" value="Question '+ (k+1) + '">'+
				   '<div class="toggler">'+
				   	'<div id="effect" class="ui-widget-content ui-corner-all">'+
						'<div id="qDetails" class="question">'+
						   	'<p><strong>Clue.</strong>'+ questions[k].fields.question  +'</p>'+
						   	'<p><strong>A.</strong>'+ questions[k].fields.answer  +'</p>'+
					    '</div>'+
					'</div>'+
				'</div>'+
		   '</div>'
		);	
	}
	else{
		$('#questions').prepend('<div class="qbox" type="submit"> '+
				'<input id="qselect" type="submit" value="Question '+ (k+1) + '">'+
				   '<div class="toggler">'+
				   	'<div id="effect" class="ui-widget-content ui-corner-all">'+
						'<div id="qDetails" class="question">'+
						   	'<form id="qform" method="post">' +
						   	'<p><strong>Clue.</strong>'+ questions[k].fields.question  +'</p>'+
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

function play(){
	
	questionLocationCheck = false;
	answerLocationCheck = false;
//Check values for field names here	
	if (questions[questionIndex].fields.discovered == true){
		if(questions[questionIndex].fields.location_answer == true){
			answerLocationCheck = true;
			target.latitude = questions[questionIndex].fields.answer_latitude;
			target.longitude = questions[questionIndex].fields.answer_longitude;
			//geolocator(target);			
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
		//geolocator(target);
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


// Spoofing functions - These can be removed when app is functioning with geolocation

$(function(){
	$( "#QDiscover" ).click( function(e) {
		e.preventDefault();
		questions[questionIndex].fields.discovered = true;
		updateQuestions();		
	  } );
});

$(function(){
	$( "#ADiscover" ).click( function(e) {
		e.preventDefault();
		var questionID = questions[questionIndex].pk;		
		post_correct(questionID).then(updateQuestions());	
	  } );
});

$(function(){
	$( "#QUndiscover" ).click( function(e) {
		e.preventDefault();
		questions[questionIndex].fields.discovered = false;
		updateQuestions();		
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


