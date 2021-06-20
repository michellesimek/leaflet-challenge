// load in geojson data
let geojson_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// let geojson;

// GET request to querty above URL
d3.json(geojson_url).then(function(data) {
    console.log(data.features);
    createFeatures(data.features);
});

// function to run for each feature in the array
function createFeatures(earthquakeData) {

    // function to determine size of marker based on magnitude
    function markerSize(mag) {
        return mag * 3;
    };
    
    // function to determine color of marker depending of depth of earthquake
    function markerColor(d) {
        switch (true) {
            case d > 10:
                return "#fed976";
                break;
            case d > 30:
                return "#feb24c";
                break;
            case d > 50:
                return "#fd8d3c";
                break;
            case d > 70:
                return "#f03b20";
                break;
            case d > 90:
                return "#bd0026"
                break;
            default:
                return "#ffffb2"
        }
    };
    
    var markerStyle = {
        fillColor: "red",
        radius: 5,
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
    
    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place);
    }
    
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, markerStyle);
        }
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
// create LayerGroup for Earthquake data
    // let earthquakeLayer = new L.layerGroup();

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create a new map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 2,
        layers: [streetmap, earthquakes]
    });
    
    // Create a layer control containing our baseMaps
    // Be sure to add an overlay Layer containing the earthquake GeoJSON
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
};

// create a lengend to display information about Earthquake data on map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        depthLevels = [0, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our depth level intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depthLevels.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depthLevels[i] + 1) + '"></i> ' +
            depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);