// MapBox Token
L.mapbox.accessToken = 'pk.eyJ1IjoidGF1cnZpIiwiYSI6IjM1ODgzNzk4YjA5ODBkMDNlMjcwNjQ3NzU5MzE2MDY1In0.0ERCQNqvljTqSGNoUzZnnA';

// Debug function
var debugMode = true;
var map;

// Option chnages
var colorOptions = {};

var collections = {};


var debugMsg = function(text) {
    if(debugMode)
        console.log('DEBUG: ' + text);
};
var resizeMapHeight = function() {
    var setHeight = $(window).innerHeight();
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
    statusDataLoading();
    // Execute an AJAX request to get the data in data/response.js
    $.ajax({
        url: 'data/response.json',
        type: 'get',
        success: function(dat){
            statusDataComplete();



            $('#removeLayer').click(function(evt) {
                evt.preventDefault();
                clearLayers()
            });



            debugMsg('Data finished loading.')
            customBuild(dat);

            collections.generic.addTo(map);

            $('#layer-option').change(function() {
                debugMsg('layer-option has changed: ' + $('#layer-option').val());
                if($('#layer-option').val() == 'layer-generic') {
                    clearLayers();
                    collections.generic.addTo(map);
                } else if($('#layer-option').val() == 'layer-deaths') {
                    clearLayers();
                    if(!collections.hit || !collections.killed)
                        buildDeath(dat);
                    collections.hit.addTo(map);
                    collections.killed.addTo(map);
                }
            });

            colorBuildGeneric();
            colorBuildDeath();

            /*$('#color-generic').click(function() {
                clearLayers();
                collections.generic.addTo(map);
            });

            $('#color-deaths').click(function() {
                clearLayers();
                collections.hit.addTo(map);
                collections.killed.addTo(map);
            });*/
        },
        dataType: 'json'
    });

    // When your request is successful, call your customBuild function

};

// Do something creative with the data here!  
var customBuild = function(data) {
    debugMsg('customBuild called!');
    buildGeneric(data);
};

var clearLayers = function() {
    for(var layer in collections) {
        map.removeLayer(collections[layer]);
    }
}

var statusDataLoading = function() {
    debugMsg('DataLoading Run!')
    $('#data-loading').css('display', 'initial');
    $('#data-options').css('display', 'none');
}

var statusDataComplete = function() {
    debugMsg('DataComplete Run!')
    $('#data-loading').css('display', 'none');
    $('#data-options').css('display', 'initial');
}

var buildGeneric = function(data) {
    var collectionGeneric = new L.LayerGroup();
    data.map(function(entry) {
        if (!colorOptions.generic)
            colorOptions.generic = '#FF0000';
        var marker = new L.circleMarker([entry.lat, entry.lng], {
            color: colorOptions.generic,
            radius: 5,
            opacity: 0.4
        });
        collectionGeneric.addLayer(marker);
    });
    collections.generic = collectionGeneric;
}

var colorBuildGeneric  = function() {
    $('#set-color-generic').change(function() {
        colorOptions.generic = $('#set-color-generic').val();
        collections.generic.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.generic
            });
        });
    });
}

var buildDeath = function(data) {
    statusDataLoading();
    var collectionHit = new L.LayerGroup();
    var collectionKilled = new L.LayerGroup();
    data.map(function(entry) {
        if (!colorOptions.hit)
            colorOptions.hit = '#FFA500';
        if (!colorOptions.killed)
            colorOptions.killed = '#FF0000';
        if(entry['Hit or Killed?'] == 'Hit') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.hit,
                radius: 5,
                opacity: 0.4
            });
            collectionHit.addLayer(marker);
        } else if (entry['Hit or Killed?'] == 'Killed') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.killed,
                radius: 5,
                opacity: 0.4
            });
            collectionKilled.addLayer(marker);
        }
    });
    collections.hit = collectionHit;
    collections.killed = collectionKilled;
    statusDataComplete();
}

var colorBuildDeath  = function() {
    $('#set-color-hit').change(function() {
        colorOptions.hit = $('#set-color-hit').val();
        collections.hit.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.hit
            });
        });
    });

    $('#set-color-killed').change(function() {
        colorOptions.killed = $('#set-color-killed').val();
        collections.killed.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.killed
            });
        });
    });
}


