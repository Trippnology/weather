<?php

// Request for weather data
$stationID = $_GET['id']; // Eg IENGLAND362

if ($stationID) {
	// Set the return content type
	header('Content-Type: application/xml');
	$url = 'http://api.wunderground.com/weatherstation/WXCurrentObXML.asp?ID=' . $stationID;
}

// Request for an external file
$file = $_GET['file'];

if ($file) {
	switch ($file) {
		case 'lightning':
			$url = 'http://images.blitzortung.org/Images/image_b_uk.png';
			header('Content-Type: image/png');
			break;
		case 'podcast':
			$url = 'http://www.weatherquest.co.uk/data_sets/podcast/norfolk.mp3';
			header('Content-Type: audio/mpeg');
			break;
		case 'radar':
			$url = 'http://pda.meteox.co.uk/images.aspx?jaar=-3&voor=&soort=loop3uur256&c=total&n=';
			header('Content-Type: image/gif');
			break;
		case 'radar2':
			$url = 'http://meteociel.fr/observations-meteo/radar2.php?region=uk';
			header('Content-Type: image/gif');
			break;
		case 'wg-logo':
			$url = 'http://icons.wunderground.com/graphics/bh-wui_logo.gif';
			header('Content-Type: image/gif');
			break;
		case 'wq-cam':
			$url = 'http://weatherquest.co.uk/data_sets/images/webcam/cam.jpg';
			header('Content-Type: image/jpg');
			break;

		default:
			break;
	}
}

if ($url) {
	// Get that website's content
	$handle = fopen($url, "r");

	// If there is something, read and return
	if ($handle) {
		while (!feof($handle)) {
			$buffer = fgets($handle, 4096);
			echo $buffer;
		}
		fclose($handle);
	}
}
?>