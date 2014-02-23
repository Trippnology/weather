<?php
// Set your return content type
header('Content-type: application/xml');

// ID of the station
$stationID = $_GET['id']; // Eg IENGLAND362

// Website url to open
$daurl = 'http://api.wunderground.com/weatherstation/WXCurrentObXML.asp?ID=' . $stationID;

// Get that website's content
$handle = fopen($daurl, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>