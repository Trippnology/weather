global.jQuery = require('jquery');
require('xml2json');

var App = {};

App.getWeather = function(id, cb) {
	$.ajax({
		type: 'GET',
		url: 'proxy.php',
		data: { id: id },
		dataType: 'xml',
		success: function(xml) {
			// Convert our xml to json
			var weather = $.xml2json(xml);
			return cb(null, weather);
		},
		error: function(error) {
			return cb(error);
		}
	});
};

App.buildPage = function(weather) {

	// Clear any previous info
	$('.current-conditions').html('');
	$('.station').html('<h3>Station Info</h3>');
	$('.debug').remove();

	// Build station info
	$('<img>').attr({src: 'proxy.php?file=wg-logo', alt: 'Weather Underground logo', class: 'pull-right'}).prependTo('.station');
	$('<ul class="station-info list-unstyled"></ul>').appendTo('.station');
	$('<li>').html('<a href="'+weather.history_url+'" target="blank">'+weather.station_id+'</a>').addClass('station_id').appendTo('.station-info');
	// TODO Map link needs improving.
	$('<li>').html(weather.location.full+' ').addClass('location').appendTo('.station-info');
	$('<a>').addClass('badge').attr({
								href: 'http://maps.google.com/?ie=UTF8&hq=&ll='+weather.location.latitude+','+weather.location.longitude+'&z=13',
								target: '_blank'})
							.html('<span class="glyphicon glyphicon-map-marker"></span>').appendTo('.location');
	$('<li>').text(weather.station_type).addClass('station_type').appendTo('.station-info');

	// Format a row of data
	function makeRow (title, data) {
		var $row = $('<tr>');
		var $title = $('<th>').text(title).appendTo($row);
		var $data = $('<td>').text(data).appendTo($row);
		return $row;
	}

	// Build current observation
	var $table = $('<table class="table table-condensed">');

	$table.append(makeRow('Updated:', weather.observation_time_rfc822));
	$table.append(makeRow('Temp:', weather.temp_c+'c'));
	$table.append(makeRow('Windchill:', (weather.windchill_c ? weather.windchill_c+'c' : 'None')));
	$table.append(makeRow('Humidity:', weather.relative_humidity+'%'));
	$table.append(makeRow('Dew Point:', weather.dewpoint_c+'c'));
	$table.append(makeRow('Pressure:', weather.pressure_mb+'mb'));
	$table.append(makeRow('Rain Today:', weather.precip_today_metric));
	$table.append(makeRow('Wind:', weather.wind_string));

	$table.appendTo('.current-conditions');

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

App.init = function() {

	// Handle clicks on the station picker
	$('.stationpicker').on('click', 'button', function (event) {
		$('.stationpicker button').removeClass('active');
		$(this).addClass('active');
		var id = $(this).attr('data-stationID');
		App.getWeather(id, function (error, weather) {
			if (error) {
				App.debug();
				$('.debug').html('<p>Something went wrong. :(</p>').addClass('label label-important');
				console.log('Error fetching weather data:');
				console.error(error);
				return;
			}
			App.buildPage(weather);
		});
	});

	// Load higher quality RADAR image on demand
	$('#load-radar-iframe').on('click', function () {
		//$('.radar').html('<iframe src="http://maps.meteoradar.co.uk/GratisRadar/947/831/actueel?zoom=6" width="100%" height="500" scrolling="no" frameborder="no"></iframe>');
		$('.radar').html('<a href="http://meteociel.fr/observations-meteo/radar2.php?region=uk"><img src="proxy.php?file=radar2" alt="RADAR view of precipitation over the UK"></a>');
	});

	// Load lightning image on demand
	$('#load-lightning-image').on('click', function () {
		var $a = $('<a>').attr('href', 'http://en.blitzortung.org/live_lightning_maps.php?map=12');
		$('<img>').attr({
			src: 'proxy.php?file=lightning',
			alt: 'Map of lightning strikes over the UK in the last 120 minutes'
		}).appendTo($a);
		$('#load-lightning-image').replaceWith($a);
	});
	// Load the weatherquest webcam on demand
	$('#load-wq-image').on('click', function () {
		var $a = $('<a>').attr('href', 'http://weatherquest.co.uk/');
		$('<img>').attr({
			src: 'proxy.php?file=wq-cam',
			alt: "A view from Weather Quest's headquarters at the UEA"
		}).appendTo($a);
		$('#load-wq-image').replaceWith($a);
	});
};

App.loaded = function () {
	// Get a station on page load
	App.getWeather($('button.active').data('stationid'), function (error, weather) {
		if (error) {
			App.debug();
			$('.debug').html('<p>Something went wrong. :(</p>').addClass('label label-important');
			console.log('Error fetching weather data:');
			console.error(error);
			return;
		}
		App.buildPage(weather);
	});
	// Load images by default on larger screens
	if ($(window).width() >= 992) {
		$('#load-lightning-image').trigger('click');
		$('#load-wq-image').trigger('click');
	}

	// Check for new version of our app
	window.applicationCache.addEventListener('updateready', function(e) {
		// Browser downloaded a new app cache
		window.location.reload();
	});

	// Register our service worker
	if (navigator.serviceWorker) {
		navigator.serviceWorker.register('sw.js', {scope: './'}).then(function(registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}).catch(function(err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		});
	}
};

$(document).ready(App.init);
$(window).load(App.loaded);

module.exports = App;