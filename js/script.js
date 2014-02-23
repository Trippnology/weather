// Matchbox scripts
jQuery(document).ready(function($) {
	$.ajax({
		type: "GET",
		url: "proxy.php",
		dataType: "xml",
		//async: false,
		success: function(xml) {
			var weather = $.xml2json(xml);

			$('<img>').attr({src: weather.image.url, alt: 'Weather Underground logo', class: 'pull-right'}).prependTo('.station');
			$('<ul class="station-info list-unstyled"></ul>').appendTo('.station');
			$('<li>').html('<a href="'+weather.history_url+'" target="blank">'+weather.station_id+'</a>').addClass('station_id').appendTo('.station-info');
			// TODO Map link needs improving.
			$('<li>').html(weather.location.full+' ').addClass('location').appendTo('.station-info');
			$('<a>').addClass('badge').attr({
										href: 'http://maps.google.com/?ie=UTF8&hq=&ll='+weather.location.latitude+','+weather.location.longitude+'&z=13',
										target: '_blank'})
									.html('<i class="icon-map-marker"></i>').appendTo('.location');
			$('<li>').text(weather.station_type).addClass('station_type').appendTo('.station-info');

			$('<ul class="current-observation list-unstyled"></ul>').appendTo('.current-conditions');
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