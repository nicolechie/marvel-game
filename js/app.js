$(document).ready(function() {
	var characters = {};
	var boxCount = 0;
	var character1;

	$(document).on('click','.box', function() {
	 	console.log(boxCount);
		var characterId = $(this).attr('value');
		console.log(characterId);
      	showTotals(characterId);
		compareTotals(characterId);

		/*--- If this is the first character clicked ---*/
		if (boxCount === 0) {
			character1 = $(this);
			character1.addClass('selected');
			boxCount++;
		}
		
		/*--- If this is the second character clicked ---*/
		else if (boxCount === 1) {
		    $('.overlay').fadeIn(1000);
		    $('a.gotIt').click(function() {
  				$('.overlay').fadeOut(1000);
  				$('#characterComparison').html('');
  				boxCount = 0;
  				character1.removeClass('selected');
  			});
		}
	});

	$('.results').hide();
	$('.directions').hide();

	/*--- Display directions modal box ---*/
	$('.what').click(function(){
		$('.results').hide();
		$('.directions').show();
    	$('.overlay').fadeIn(1000);
  	});

  	/*--- Hide directions modal box ---*/
  	$('a.gotIt').click(function(){
  		$('.overlay').fadeOut(1000);
  		$('.directions').fadeOut(1000);
  		$('#characterComparison').html('');
  	});
  
    characterGetRequest();         
});

function showResults(results) {
	for (var i = 0; i < results.length; i++) {
		var imgPath = results[i].thumbnail.path;
		var lastChars = imgPath.substr(imgPath.length - 19);
		var characterName = results[i].name;
		var characterThumbnail = results[i].thumbnail.path + '/standard_fantastic' + '.' + results[i].thumbnail.extension;
		var characterThumbnailSmall = results[i].thumbnail.path + '/standard_medium' + '.' + results[i].thumbnail.extension;
		var characterId = results[i].id;
		if(lastChars !== 'image_not_available') {
			characters[characterId] = {
				name: characterName,
			 	id: characterId,
			 	thumbnail: characterThumbnail,
			 	thumbnailSmall: characterThumbnailSmall,
			 	count: null
			}
			comicGetRequest(characterId);	
		}
	}
}    

function compareTotals(characterId) {
	if (characters[characterId].count > characters[$('#countOne').attr('value')].count) {
		$('#winner').html(characters[characterId].name + ' is the winner!');
	}
	else if (characters[characterId].count === characters[$('#countOne').attr('value')].count) {
		$('#winner').html('It is a tie!');
	}
	else {
		$('#winner').html(characters[$('#countOne').attr('value')].name + ' is the winner!');
	}
}

function showTotals(characterId) {
	console.log('show totals');
	$('#characterComparison').append('<img src=' + characters[characterId].thumbnailSmall + '><p>' + characters[characterId].name + ': <span id="countOne" value=' + characterId + '>' + characters[characterId].count + '</span></p>');
	$('.results').show();
}
   
function characterGetRequest() {
	var request = { 
		apikey: 'fe53b28e7625459833f259efa7324a60',
		series: 9085
		// 354, 1991, 3621, 17296, 9085, 16452
	};

	$.ajax({
		url: 'http://gateway.marvel.com/v1/public/characters',
		data: request,
		dataType: 'json',
		type: 'GET'
	})

	.done(function(data){ //this waits for the ajax to return with a succesful promise object
	    showResults(data.data.results);
	})

	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
	// var errorElem = showError(error);
	// $('.search-results').append(errorElem);
	});
};

function comicGetRequest(characterId) {

	var request = { 
    	apikey: 'fe53b28e7625459833f259efa7324a60'
	};
	
	$.ajax({
		url: 'http://gateway.marvel.com/v1/public/characters/' + characterId + '/comics',
		data: request,
		dataType: 'json',
		type: 'GET'
	})
		.done(function(data){
			characters[characterId].count = data.data.total;
			if (characters[characterId].count > 0) {
				$('#characters').append("<div class='col-lg-2 col-md-3 col-sm-4 col-xs-6 box' value = " + characterId + "><img src=" + characters[characterId].thumbnail + "></div>");
			}
    	})
    		
		.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		// var errorElem = showError(error);
		// $('.search-results').append(errorElem);
	});
};