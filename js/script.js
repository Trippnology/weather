var App = {};

App.getWeather = function(id) {
	$.ajax({
		type: 'GET',
		url: 'proxy.php?id=' + id,
		dataType: 'xml',
		success: function(xml) {
			App.buildPage(xml);
		},
		error: function(error) {
			App.debug();
			$('.debug').html('<p>Something went wrong. :(</p>').addClass('label label-important');
			console.log('Error: '+error);
		}
	});
};

App.buildPage = function(xml) {
	// Convert our xml to json
	var weather = $.xml2json(xml);

	// Clear any previous info
	$('.current-conditions').html('<h3>Current Conditions</h3>');
	$('.station').html('<h3>Station Info</h3>');
	$('.debug').remove();

	// Build station info
	$('<img>').attr({src: weather.image.url, alt: 'Weather Underground logo', class: 'pull-right'}).prependTo('.station');
	$('<ul class="station-info list-unstyled"></ul>').appendTo('.station');
	$('<li>').html('<a href="'+weather.history_url+'" target="blank">'+weather.station_id+'</a>').addClass('station_id').appendTo('.station-info');
	// TODO Map link needs improving.
	$('<li>').html(weather.location.full+' ').addClass('location').appendTo('.station-info');
	$('<a>').addClass('badge').attr({
								href: 'http://maps.google.com/?ie=UTF8&hq=&ll='+weather.location.latitude+','+weather.location.longitude+'&z=13',
								target: '_blank'})
							.html('<span class="glyphicon glyphicon-map-marker"></span>').appendTo('.location');
	$('<li>').text(weather.station_type).addClass('station_type').appendTo('.station-info');

	// Build current observation
	$('<ul class="current-observation list-unstyled"></ul>').appendTo('.current-conditions');
	$('<li>').text(weather.observation_time_rfc822).appendTo('.current-observation');
	$('<li>').text(weather.temperature_string).addClass('badge').appendTo('.current-observation');
	$('<li>').text(weather.pressure_string).addClass('badge').appendTo('.current-observation');
	$('<li>').text('Rain today: '+weather.precip_today_string).appendTo('.current-observation');
	$('<li>').text('Wind: '+weather.wind_string).appendTo('.current-observation');
	$('<a>').attr({href:weather.ob_url}).text('Forecast').appendTo('.current-conditions');

	// Print everything we've got in the json
	//App.debug(weather);
};

App.debug = function(weather) {
	$('<div>').addClass('debug').html('<h3>Debug info</h3>').appendTo('.container');
	$('<ul>').addClass('everything').appendTo('div.debug');
	$.each(weather, function(key, val){
		$('<li>').html('<span class="">'+key+':</span> <span class="">'+val+'</span>').appendTo('.everything');					
	});
};

jQuery(document).ready(function($) {
	// Get a station on page load
	App.getWeather('IENGLAND362');

	// Handle clicks on the station picker
	$('.stationpicker').on('click', 'button', function(event) {
		$('.stationpicker button').removeClass('active');
		$(this).addClass('active');
		var id = $(this).attr('data-stationID');
		App.getWeather(id);
	});
});