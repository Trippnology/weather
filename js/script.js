// Matchbox scripts
jQuery(document).ready(function($) {
	$.ajax({
		type: "GET",
		url: "proxy.php",
		dataType: "xml",
		//async: false,
		success: function(xml) {
			//$(xml).find('current_observation').each(function(){
			//	var id = $(this).attr('station_id');
			//	var title = $(this).find('title').text();
			//	var imgurl = $(this).find('url').text();
			//	$('<img>').attr('src': imgurl).addClass('pull-right').appendTo('.station-info');
			//	//$('<h1></h1>').html().appendTo('.station-info');
			//	$(this).find('desc').each(function(){
			//		var brief = $(this).find('brief').text();
			//		var long = $(this).find('long').text();
			//		$('<div class="brief"></div>').html(brief).appendTo('#link_'+id);
			//		$('<div class="long"></div>').html(long).appendTo('#link_'+id);
			//	});
			//});
			var weather = $.xml2json(xml);

			$('<img>').attr({src: weather.image.url, alt: 'Weather Underground logo', class: 'pull-right'}).prependTo('.station');
			$('<ul class="station-info unstyled"></ul>').appendTo('.station');
			$('<li>').html('<a href="'+weather.history_url+'" target="blank">'+weather.station_id+'</a>').addClass('station_id').appendTo('.station-info');
			// TODO Map link needs improving.
			$('<li>').html(weather.location.full+' ').addClass('location').appendTo('.station-info');
			$('<a>').addClass('badge').attr({
										href: 'http://maps.google.com/?ie=UTF8&hq=&ll='+weather.location.latitude+','+weather.location.longitude+'&z=13',
										target: '_blank'})
									.html('<i class="icon-map-marker"></i>').appendTo('.location');
			$('<li>').text(weather.station_type).addClass('station_type').appendTo('.station-info');

			$('<ul class="current-observation unstyled"></ul>').appendTo('.current-conditions');
			$('<li>').text(weather.observation_time_rfc822).appendTo('.current-observation');
			$('<li>').text(weather.temperature_string).addClass('badge').appendTo('.current-observation');
			$('<li>').text(weather.pressure_string).addClass('badge').appendTo('.current-observation');
			$('<li>').text('Wind: '+weather.wind_string).appendTo('.current-observation');

			$('<div>').addClass('debug').html('<h3>Debug info</h3>').appendTo('.container');
			$('<ul>').addClass('everything').appendTo('div.debug');
			$.each(weather, function(key, val){
				$('<li>').html('<span class="">'+key+':</span> <span class="label">'+val+'</span>').appendTo('.everything');					
			})
		},
		error: function(error) {
			$('.debug').html('<p>Something went wrong. :(</p>').addClass('label label-important');
			console.log('Error: '+error);
		}
	});
});