var questionIndex = 0;
var target = {
		  latitude : 0,
		  longitude: 0
		};
var targetselected = false;
var question;

{
	showCompleteQuestions();	
}
 
$(document).on('submit','#question',function(e){
	e.preventDefault();
	if (targetselected == false){
		custom_alert("Please use the map to select a location","Warning");
	}
	else{
		deleteMarkers();
		targetselected = false;
		$("#question")[0].reset();
		create_question(trail_id).then(showCompleteQuestions());
	}

});

async function create_question(trail_id) {
//This funnction posts the new question to create it and then overwrites the question
// json object.
//
let url = 'http://localhost:8080/create-question?id=' + trail_id; // Something needed in here to submit a question based on its questionIndex so that questions can be edited
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

function showCompleteQuestions(){
	for (var i=0; i< questions.length; i++){
		$("#completeQuestions").html("");
		deleteMarkers();
		for (var i=0; i< questions.length; i++){
			questionIndex = i+1;
			$('#completeQuestions').append(	'<button class="item" type="submit" value="'+ i + '"> Question' + (i+1) + '</button>'				   
			);		
	}	
}
}



$(function(){
	var dialog, form;
	
	$(".item").click(function(e){
		e.preventDefault();
		var target = e.target;
		questionIndex = Number(target.value);
		question = questions[questionIndex];
		document.getElementById('QClue').innerHTML = question.fields.question;
		document.getElementById('QAnswer').innerHTML = question.fields.answer;
		dialog.dialog( "open" );
		

	});
	
	function editQuestion(){
		deleteMarkers();
		document.getElementById("id_question").innerHTML = question.fields.question
		document.getElementById("id_answer").innerHTML = question.fields.answer
		var pin_location = { lat: question.fields.latitude,
			       lng: question.fields.longitude };
	    addMarker(pin_location, map, selected = true);	
	    updateLatLng(pin_location);
	    refitMap();
	}


	dialog = $( "#dialog-Qform" ).dialog({
	    autoOpen: false,
	    height: 400,
	    width: 350,
	    modal: true,
	    position: {
	    	   my: "center",
	    	   at: "center",
	    	   of: window},
	    buttons: {
	      "Edit": function(){
	    	  $(this).dialog('close');
	    	  editQuestion();
	      },
	      Cancel: function() {
	        dialog.dialog( "close" );
	      }
	    }
	  });

});

function updateLatLng(LatLon){
	target["latitude"] = LatLon["lat"];
	target["longitude"] = LatLon["lng"];
	targetselected = true;	
}

//$(function(){
//$(document).on("click",".qbox", function(event) {
//	var target = $(event.target);
//      if(target.is(".answer") || target.is("#submit")) return;
//      else {$(this).find(".toggler").toggle();}		
//  } );
//});


//$('input[type=checkbox]').change(
//function(){
//    if (this.checked) {
//        $("#loc_ans_toggler").show();
//    }
//    else{$("#loc_ans_toggler").hide();}
//});
