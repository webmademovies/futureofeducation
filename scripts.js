	var cTime; //time index
	var cycleCount = 0;
	
	var keyFrames = [8, 29, 51, 72, 94]; //in seconds
	
	var flickrImages = [];
	var hashtagTweets = [];
	
	

$(document).ready(function() {
			
	var video = document.getElementById("player");
	
	video.addEventListener("timeupdate", function() {
		if(cTime != parseInt(video.currentTime)){
			cTime = parseInt(video.currentTime);
			$('#console').html(cTime);
			located = $.inArray(cTime, keyFrames);
			if(located > -1) {
				$.placeImage(flickrImages[located]);
			}
		}
	}, false);
	
	getFlickrImages = function(){
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
		  {
		    tags: "drumbeat",
		    tagmode: "any",
		    format: "json"
		  },
		  function(data) {
		    $.each(data.items, function(i,item){
				bigphoto = (item.media.m).replace("_m.jpg", ".jpg");
				flickrImages[i] = $("<img/>").attr("src", bigphoto);
		      if ( i == 5 ) return false;
		    });
		  });
	}

	var gJs = function(url){
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.src = url;
		head.insertBefore(script, head.firstChild);
	}
	
	
	gJs('http://search.twitter.com/search.json?q=futureofeducation&callback=tCw');
  getFlickrImages();

});



var tCw = function (response){
	var results = response.results;
	 $.each(results, function(i, post) {
		hashtagTweets[i] = post.text;
      });

}

jQuery.placeImage = function (img) {


	var image = $('<figure></figure>').appendTo('body');
	image.append(img);
	
	
	var width_body = $('body').width();
	var width_image = $(image).width();
	var pos_x = (width_body/2) - (width_image/2);
	
	var randomnumber = Math.floor(Math.random()*6);
	
	randomnumber = (randomnumber%2) ? randomnumber : '-'+randomnumber;

	$(image).hide().css('left', pos_x);
	
	$(image).fadeIn(1000).delay(4000).fadeOut('slow');

}

jQuery.placeTweet = function(key){
	var color = Math.floor(Math.random()*4);
	var playerPosition = $('#player').position();
	if(key%2 == 0){
		var posX = playerPosition.left - 250;
	} else {
		var posX = playerPosition.left + $('#player').width();
	}
	
	var posY=Math.floor(Math.random()*$('body').height());
	
	if(hashtagTweets[key] != undefined){
		$('<div />').attr('class', 'tweet'+color).css('top',posY).css('left',posX).appendTo('body').hide().fadeIn('slow').html(hashtagTweets[key]).delay(6000).fadeOut('normal');		
	}
	
}


var cycletweets = function(){
	
	len = hashtagTweets.length;
	
	if(cycleCount<len){
		cycleCount++;
	} else {
		cycleCount = 0;	
	}
	
	$.placeTweet(cycleCount);
	setTimeout(cycletweets,4000);
}

setTimeout(cycletweets, 5000);
