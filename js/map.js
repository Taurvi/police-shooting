// MapBox Token
L.mapbox.accessToken = 'pk.eyJ1IjoidGF1cnZpIiwiYSI6IjM1ODgzNzk4YjA5ODBkMDNlMjcwNjQ3NzU5MzE2MDY1In0.0ERCQNqvljTqSGNoUzZnnA';

// Debug function
var debugMode = true;

var debugMsg = function(text) {
    if(debugMode)
        console.log('DEBUG: ' + text);
}
var resizeMapHeight = function() {
    var setHeight = $(window).innerHeight() - 20;
    debugMsg('resizeMapHeight called! Height is now: ' + setHeight);
    $('#map-container').css('height', setHeight);
}

// On window resize, resize container
$(window).resize(function() {
    debugMsg('Window has been resized!')
    resizeMapHeight();
});

// Function to draw your map
var drawMap = function() {
    debugMsg('drawMap called!')
    // Create map and set viewd
    var map = L.mapbox.map('map-container');
    map.setView([39.833333, -97.583333], 4);

    // Create an tile layer variable using the appropriate url
    var layer = L.mapbox.tileLayer('mapbox.dark');
    // Add the layer to your map after map data has been received
    layer.on('ready', function() {
        debugMsg('Map layers finished loading.')
        // Removes the loading message
        $('#map-loading').remove();
        // Adds to map
        this.addTo(map);

        getData();
    });
}

// Function for getting data
var getData = function() {
    debugMsg('getData called!')
    // Execute an AJAX request to get the data in data/response.js
    $.ajax({
        url: 'data/response.json',
        type: 'get',
        success: function(){
            $('#data-loading').css('display', 'none');
            $('#data-options').css('display', 'initial');
            debugMsg('Data finished loading.')
        },
        dataType: 'json'
    });

    // When your request is successful, call your customBuild function

}

// Do something creative with the data here!  
var customBuild = function() {
    debugMsg('customBuild called!')

}


