// MapBox Token
L.mapbox.accessToken = 'pk.eyJ1IjoidGF1cnZpIiwiYSI6IjM1ODgzNzk4YjA5ODBkMDNlMjcwNjQ3NzU5MzE2MDY1In0.0ERCQNqvljTqSGNoUzZnnA';

// Function to draw your map
var drawMap = function() {
    // Create map and set viewd
    var map = L.mapbox.map('map-container');
    map.setView([39.833333, -98.583333], 5);

    // Create an tile layer variable using the appropriate url
    var layer = L.mapbox.tileLayer('mapbox.dark');
    // Add the layer to your map
    layer.on('ready', function() {
        $('#loading').remove();
        this.addTo(map);
    })


    // Execute your function to get data
}

// Function for getting data
var getData = function() {

    // Execute an AJAX request to get the data in data/response.js


    // When your request is successful, call your customBuild function

}

// Do something creative with the data here!  
var customBuild = function() {


}


