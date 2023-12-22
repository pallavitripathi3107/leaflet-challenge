



// Load the GeoJSOn data and store in as url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson "

// Get the data with d3 from url.
d3.json(url).then(function(data) {
    // printing data
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function.
    earthquakeData = data.features;
    createFeatures(earthquakeData);


function createFeatures(earthquakeData){

    function pointToLayer(feature, latlng) {
        return new L.circleMarker(latlng, {
            radius: feature.properties.mag*4,
            stroke: true,
            fillOpacity: 0.75,
            weight: 0.5,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "black"
        })
    };

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr>
        <p><b>Date: </b>${new Date(feature.properties.time)}</p>
        <b>Magnitude: </b> ${feature.properties.mag} <br>
        <b>Depth: </b> ${feature.geometry.coordinates[2]}`);
    };

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
    });

   // Send our earthquakes layer to the createMap function/
   createMap(earthquakes);

}

function getColor(depth) {
    if (depth >= -10 && depth <10) {
        return "#61FF33";
    } else if (depth >=10 && depth <30) {
        return "#CEFF33";
    } else if (depth >=30 && depth <50) {
        return "#FFC133";
    } else if (depth >=50 && depth <70) {
        return "#FF9F33";
    } else if (depth >=70 && depth <90) {
        return "#FF7A33";
    } else if (depth >= 90) {
        return "#FF5533";
    }
}
function createMap(earthquakes){
    // Create the tile layer that will be the background of our map.

     let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGFsbGF2aXRyaXBhdGhpIiwiYSI6ImNscWZzYTYxZTE0eHkyam1kYjNkdzB1bG0ifQ.z_aipaSbPYsQvFNmeAR07Q", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     });

     // Create a baseMaps object.
    let baseMaps = {
        "Street Map": streetmap,
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map ("map",{
        center:[
            38.09, -120.71
          ], 
        zoom: 5,
        layers: [streetmap, earthquakes]
    })
    // Creating layer control and adding the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}
});
 
