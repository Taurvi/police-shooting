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
                switch($('#layer-option').val()) {
                    case 'layer-generic':
                        clearLayers();
                        collections.generic.addTo(map);
                        $('.view-table').css('display', 'none');
                        $('#row-generic').css('display', 'initial');
                        break;
                    case 'layer-deaths':
                        clearLayers();
                        if(!collections.hit || !collections.killed)
                            buildDeath(dat);
                        collections.hit.addTo(map);
                        collections.killed.addTo(map);
                        $('.view-table').css('display', 'none');
                        $('#row-deaths').css('display', 'initial');
                        break;
                    case 'layer-armed':
                        clearLayers();
                        if(!collections.unarmed || !collections.armed)
                            buildArmed(dat);
                        collections.unarmed.addTo(map);
                        collections.armed.addTo(map);
                        $('.view-table').css('display', 'none');
                        $('#row-armed').css('display', 'initial');
                        break;
                    case 'layer-gender':
                        clearLayers();
                        if(!collections.male || !collections.female)
                            buildGender(dat);
                        collections.male.addTo(map);
                        collections.female.addTo(map);
                        $('.view-table').css('display', 'none');
                        $('#row-gender').css('display', 'initial');
                        break;
                    default:
                        clearLayers();
                }
                /*if($('#layer-option').val() == 'layer-generic') {
                    clearLayers();
                    collections.generic.addTo(map);
                } else if($('#layer-option').val() == 'layer-deaths') {
                    clearLayers();
                    if(!collections.hit || !collections.killed)
                        buildDeath(dat);
                    collections.hit.addTo(map);
                    collections.killed.addTo(map);
                }*/
            });

            colorBuildGeneric();
            colorBuildDeath();
            colorBuildArmed();
            colorBuildGender();

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
    $('#data-info').css('display', 'none');
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

var populateInfo = function(entry) {
    $('#data-info').css('display', 'initial');
    $('#info-date').text(entry['Date Searched']);
    var city = entry["State"].substr(0, 2);
    $('#info-location').text(entry['City'] + ', ' + city);
    $('#info-age').text(entry["Victim's Age"]);
    $('#info-gender').text(entry["Victim's Gender"]);
    $('#info-status').text(entry['Hit or Killed?']);
    $('#info-armed').text(entry['Armed or Unarmed?']);
    $('#info-weapon').text(entry['Weapon']);
    $('#info-source').html('<a href="' + entry['Source Link'] + '">Link</a>')
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
        marker.bindPopup('Selected.');
        marker.on('click', function() {
            populateInfo(entry);
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
                color: colorOptions.generic,
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
            marker.bindPopup('Selected.');
            marker.on('click', function() {
                populateInfo(entry);
            });
            collectionHit.addLayer(marker);
        } else if (entry['Hit or Killed?'] == 'Killed') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.killed,
                radius: 5,
                opacity: 0.4
            });
            marker.bindPopup('Selected.');
            marker.on('click', function() {
                populateInfo(entry);
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

var buildArmed = function(data) {
    statusDataLoading();
    var collectionUnarmed = new L.LayerGroup();
    var collectionArmed = new L.LayerGroup();
    data.map(function(entry) {
        if (!colorOptions.unarmed)
            colorOptions.unarmed = '#00FF00';
        if (!colorOptions.armed)
            colorOptions.armed = '#FFFF00';
        if(entry['Armed or Unarmed?'] == 'Unarmed') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.unarmed,
                radius: 5,
                opacity: 0.4
            });
            marker.bindPopup('Selected.');
            marker.on('click', function() {
                populateInfo(entry);
            });
            collectionUnarmed.addLayer(marker);
        } else if (entry['Armed or Unarmed?'] == 'Armed') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.armed,
                radius: 5,
                opacity: 0.4
            });
            marker.bindPopup('Selected.');
            marker.on('click', function() {
                populateInfo(entry);
            });
            collectionArmed.addLayer(marker);
        }
    });
    collections.unarmed = collectionUnarmed;
    collections.armed = collectionArmed;
    statusDataComplete();
}

var colorBuildArmed  = function() {
    $('#set-color-unarmed').change(function() {
        colorOptions.unarmed = $('#set-color-unarmed').val();
        collections.unarmed.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.unarmed
            });
        });
    });
    $('#set-color-armed').change(function() {
        colorOptions.armed = $('#set-color-armed').val();
        collections.armed.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.armed
            });
        });
    });
}

var buildGender = function(data) {
    statusDataLoading();
    var collectionMale = new L.LayerGroup();
    var collectionFemale = new L.LayerGroup();
    data.map(function(entry) {
        if (!colorOptions.male)
            colorOptions.male = '#0099FF';
        if (!colorOptions.female)
            colorOptions.female = '#CC00FF';
        if(entry["Victim's Gender"] == 'Male') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.male,
                radius: 5,
                opacity: 0.4
            });
            marker.bindPopup('Selected.');
            marker.on('click', function() {
                populateInfo(entry);
            });
            collectionMale.addLayer(marker);
        } else if (entry["Victim's Gender"] == 'Female') {
            var marker = new L.circleMarker([entry.lat, entry.lng], {
                color: colorOptions.female,
                radius: 5,
                opacity: 0.4
            });
            marker.bindPopup('Selected.');
            marker.on('click', function() {
                populateInfo(entry);
            });
            collectionFemale.addLayer(marker);
        }
    });
    collections.male = collectionMale;
    collections.female = collectionFemale;
    statusDataComplete();
}

var colorBuildGender  = function() {
    $('#set-color-male').change(function() {
        colorOptions.male = $('#set-color-male').val();
        collections.male.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.male
            });
        });
    });
    $('#set-color-female').change(function() {
        colorOptions.female = $('#set-color-female').val();
        collections.female.eachLayer(function(marker){
            marker.setStyle({
                color: colorOptions.female
            });
        });
    });
}


