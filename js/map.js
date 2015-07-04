// MapBox Token
L.mapbox.accessToken = 'pk.eyJ1IjoidGF1cnZpIiwiYSI6IjM1ODgzNzk4YjA5ODBkMDNlMjcwNjQ3NzU5MzE2MDY1In0.0ERCQNqvljTqSGNoUzZnnA';

// Debug function
var debugMode = true;
var map;

// Option chnages
var genColor;


var debugMsg = function(text) {
    if(debugMode)
        console.log('DEBUG: ' + text);
};
var resizeMapHeight = function() {
    var setHeight = $(window).innerHeight() - 20;
    debugMsg('resizeMapHeight called! Height is now: ' + setHeight);
    $('#map-container').css('height', setHeight);
};

// On window resize, resize container
$(window).resize(function() {
    debugMsg('Window has been resized!');
    resizeMapHeight();
});

// Function to draw your map
var drawMap = function() {
    debugMsg('drawMap called!');
    // Create map and set viewd
    map = L.mapbox.map('map-container');
    map.setView([39.833333, -97.583333], 4);

    // Create an tile layer variable using the appropriate url
    var layer = L.mapbox.tileLayer('mapbox.dark');
    // Add the layer to your map after map data has been received
    layer.on('ready', function() {
        debugMsg('Map layers finished loading.');
        // Removes the loading message
        $('#map-loading').remove();
        // Adds to map
        this.addTo(map);

        getData();
    });
};

// Function for getting data
var getData = function() {
    debugMsg('getData called!');
    $('#data-loading').css('display', 'initial');
    $('#data-options').css('display', 'none');
    // Execute an AJAX request to get the data in data/response.js
    $.ajax({
        url: 'data/response.json',
        type: 'get',
        success: function(dat){
            $('#data-loading').css('display', 'none');
            $('#data-options').css('display', 'initial');

            $('#data-generic').change(function() {
                genColor = $('#data-generic').val();
                debugMsg('Color: ' + genColor);
                getData();
            });
            debugMsg('Data finished loading.')
            customBuild(dat);
        },
        dataType: 'json'
    });

    // When your request is successful, call your customBuild function

};

// Do something creative with the data here!  
var customBuild = function(data) {
    debugMsg('customBuild called!');
    data.map(function(entry) {
        if (!genColor)
            genColor = '#FF0000';
        var marker = new L.circle([entry.lat, entry.lng], 100, {
            color: genColor,
            opacity: 0.5
        });
        marker.addTo(map);
    });
};




