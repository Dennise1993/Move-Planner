var stViewRootUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400';
var nyArticleUrl= 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
var apiKey = '69968af057bb46c0b828b77bc501fab3';
var wikiRootUrl = 'https://en.wikipedia.org/w/api.php';

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text('');
    $nytElem.text('');

    // load streetview
    var streetName = $('#street').val();
    var cityName = $('#city').val();
    var location=streetName + ', ' + cityName;
    console.log(location);
    var stViewUrl = (stViewRootUrl + '&location=' + location);

    $greeting.text('So, you want to live at '+location+'?');

    $body.append('<img class="bgimg">');
    $('.bgimg').attr('src', stViewUrl);

    $.getJSON(nyArticleUrl, {
    	'api-key': apiKey,
    	'q': cityName,
    	'sort': 'newest'
    	}, 
    	function(data) {
    		$nytHeaderElem.text('New York Times Articles About '+cityName);
    		var articles = [];
    		//console.log(data.response.docs);
    		$.each(data.response.docs, function(i, doc) {
    			var aTag = '<a href="'+doc.web_url+'">'+doc.headline.main+'</a>';
    			var pTag = '<p>'+doc.snippet+'</p>';
    			var article = aTag + pTag;
    			articles.push(article);
    		});
    		$nytElem.append(articles.join(''));
    })
    .fail(function() {
    	$nytHeaderElem.text('New York Times Articles couldn\'t be loaded!');
    });

    //handle the error if jsonp failed
    var wikiRequestTimeout = setTimeout(function() {
    	$wikiElem.text("failed to get wikipedia resources");
    }, 3000);

    $.ajax(wikiRootUrl, {
    	'dataType': 'jsonp',
    	'data': {
	    	'format': 'json',
	    	'action':'opensearch',
	    	'search':cityName
    	},
    	'success': function(data) {
    		//console.log(data);
    		var articleList = data[1];

    		articleList.forEach(function(arti) {
    			var url = 'http://en.wikipedia.org/wiki/'+ arti;
    			$wikiElem.append('<li><a href="'+url+'">'+arti+'</a></li>');
    		});

    		//clear error handler if it is successful
    		clearTimeout(wikiRequestTimeout);
    	}

    });

    return false;
};

    //load articles


$('#form-container').submit(loadData);
