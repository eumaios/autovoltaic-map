import './styles.css';
import "ol/ol.css";

import proj4 from "proj4";
import { Map, View, Feature, Overlay } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from 'ol/style';
import { register } from "ol/proj/proj4";


// adding Swiss projections to proj4 (proj string comming from https://epsg.io/)
proj4.defs(
    "EPSG:2056",
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
);
proj4.defs(
    "EPSG:21781",
    "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs"
);
register(proj4);


/*
const iconFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([47.083730, 7.134710])),
  name: 'Somewhere near Nottingham',
});
*/

const iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 32],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        scale: 1.2,
        src: 'data/icons8-sun-32.png',
    }),
});


const systems = [{
        coord: [2554663.20, 1219919.29],
        name: "Les Bulles, 2300 La Chaux-de-Fonds (NE)",
        detail: "5.1 kWc, Couvert de terrasse, 15 modules 340 Wc"
    },
    {
        coord: [2567708.00, 1206428.89],
        name: "Paul Vouga, 2074 Marin (NE): 8.47 kWc",
        detail: "Installation ajoutée, 22 x JA Solar JAM60S20-385 Wc, <br>onduleur Fronius 8.2-3-M"
    },
    {
        coord: [2552603.80, 1197040.27],
        name: "Chemin Alfred-Borel, 2022 Bevaix (NE): 8.28 kWc",
        detail: "Carport avec toit en tôle, 23 modules Jinko Tiger 350 Wc <br>avec optimizeurs P370, <br>onduleur SolarEdge SE7K"
    },
    {
        coord: [2539061.01, 1197245.15],
        name: "Chemin des Clavins, 2108 Couvet (NE): 6.3 kWc",
        detail: "Installation ajoutée sur toit en tuile, <br>18 modules Jinko Tiger 350 Wc fullblack, <br>onduleur Fronius Symo 6.0-3-M"
    },
    {
        coord: [2541394.51, 1179047.48],
        name: "Chemin des Bioleyres, 1405 Pomy(VD): 8.125 kWc",
        detail: "Installation ajoutée sur toit en tuiles, <br>modules Bisol fullblack 325 Wc, <br>onduleur Fronius Symo 7.0-3-M"
    },
]

const systemsarray = []

let s = 0;
while (s < systems.length) {
    let feature = new Feature({
        geometry: new Point(systems[s].coord),
        name: systems[s].name,
        desc: '<pre><b>' + systems[s].name + '</b><br>' + systems[s].detail + '</pre>',
        type: 'Point',
        population: 4000,
        rainfall: 500,
    });
    feature.setStyle(iconStyle);
    systemsarray.push(feature);
    s++;

}


/*
var data=[{"Lon":19.455128,"Lat":41.310575},{"Lon":19.455128,"Lat":41.310574},{"Lon":19.457388,"Lat":41.300442},{"Lon":19.413507,"Lat":41.295189},{"Lon":16.871931,"Lat":41.175926},{"Lon":16.844809,"Lat":41.151096},{"Lon":16.855165,"Lat":45}];

function addPointGeom(data) {

        data.forEach(function(item) { //iterate through array...
            var longitude = item.Lon,
                latitude = item.Lat,
                iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326',
                        'EPSG:3857')),
                  type: 'Point',
                    desc: '<pre> <b>Waypoint Details </b> ' + '<br>' + 'Latitude : ' + latitude + '<br>Longitude: ' + longitude + '</pre>'}),
                iconStyle = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'blue'
                        }),
                        fill: new ol.style.Fill({
                            color: [57, 228, 193, 0.84]
                        }),
                    })
                });

            iconFeature.setStyle(iconStyle);

            straitSource.addFeature(iconFeature);
        });
    }// End of function showStraits()

addPointGeom(data);
*/



const vectorSource = new VectorSource({
    features: systemsarray,
});

const vectorLayer = new VectorLayer({
    source: vectorSource,
});





const backgroundLayer = new TileLayer({
    id: "background-layer",
    source: new XYZ({
        url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg`
    })
});
/*
var layer = new lVector({
     source: new sVector({
         features: [
             new Feature({
                 geometry: new Point([900000, 5900000])
             })
         ]
     })
 });
*/
const view = new View({
    /*projection: "EPSG:3857",
    center: [900000, 5900000],
    zoom: 8*/
    projection: "EPSG:2056",
    center: [2561485.53, 1205014.47],
    zoom: 11
});

const map = new Map({
    target: "map",
    controls: defaultControls().extend([
        new ScaleLine({
            units: "metric"
        })
    ]),
    layers: [backgroundLayer, vectorLayer],
    view: view
});


// Popup showing the position the user clicked
var container = document.getElementById('popup');
var popup = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});
map.addOverlay(popup);

var content = document.getElementById('popup-content');

/* Add a pointermove handler to the map to render the popup.*/
map.on('pointermove', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feat, layer) {
        return feat;
    });

    if (feature && feature.get('type') == 'Point') {
        var coordinate = evt.coordinate; //default projection is EPSG:3857 you may want to use ol.proj.transform

        content.innerHTML = feature.get('desc');
        popup.setPosition(coordinate);
    } else {
        popup.setPosition(undefined);

    }
});






// map.addLayer(layer);



/*import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';

const map = new Map({
  target: 'map',
  layers: [],
  view: new View({
  projection: "EPSG:3857",
  center: [900000, 5900000],
  zoom: 8})
});
  /*layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
*/

// Create a new OpenLayers map object.
/*var map = new ol.Map({
  target: 'map',
  layers: []
});


// Create a new WMTS source object and specify the URL of the Swisstopo WMTS service.
var wmtsSource = new WMTS({
  url: 'http://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml',
  layer: 'ch.swisstopo.pixelkarte-farbe-pk25',
  crossOrigin: 'anonymous'
});

// Create a new tile layer object and specify the WMTS source object.
var tileLayer = new TileLayer({
  source: wmtsSource
});

// Add the tile layer object to the map object.
map.addLayer(tileLayer);

*/