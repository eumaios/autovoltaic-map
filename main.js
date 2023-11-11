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
        scale: 0.8,
        src: 'data/icons8-sun-32.png',
    }),
});


const systems = [
  {
    "name": "Création de l'association Autovoltaïc",
    "detail": "Création de l'association Autovoltaïc",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2017/05/20150321_135045-300x225.jpg",
    "address": "",
    "kWp": "Création de l'association Autovoltaïc",
    "coord": [
      2561482.97,
      1205017.37
    ]
  },  {
    "name": "Rue Messeillers, Neuchâtel, 12.2 kWc",
    "detail": "Deux installations PV de 6.2 kWp et de 6 kWp, réalisées en autoconstruction en 2015, installées en forme compacte surun seul toit partagé par deux voisins.",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2017/05/20150321_135045-300x225.jpg",
    "address": "Rue Messeillers, Neuchâtel",
    "kWp": "12.2 kWc",
    "coord": [
      2560204.25,
      1205486.625
    ]
  },
  {
    "name": "Rue du Suchiez, Neuchâtel, 14.7 kWc",
    "detail": "Installation ajoutée sur tôle ondulée métallique",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/9-300x225.jpg",
    "address": "Rue du Suchiez, Neuchâtel",
    "kWp": "14.7 kWc",
    "coord": [
      2559368.75,
      1204421.375
    ]
  },
  {
    "name": "Chemin Bel-Air, Neuchâtel, 3.0 kWc",
    "detail": "Installation 3.0 kWc, sur socle béton, 9 modules Sunpower 335 Wc, onduleur Kostal 3.0 kVA",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/Unbenannt-300x225.jpg",
    "address": "Chemin Bel-Air, Neuchâtel",
    "kWp": "3.0 kWc",
    "coord": [
      2562493,
      1205436.625
    ]
  },
  {
    "name": "Tertre, Neuchâtel, 3.78 kWc",
    "detail": "Installation intégrée 3.78 kWc, système Solrif, 18 modules CNPV 210 Wc, onduleur Kostal",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/20170928_141236-300x225.jpg",
    "address": "Tertre, Neuchâtel",
    "kWp": "3.78 kWc",
    "coord": [
      2561355.75,
      1204915.25
    ]
  },
  {
    "name": "Chemin de Praz, Boudry (NE), 5.6 kWc",
    "detail": "Installation ajouté sur tuile standar",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/20160814_153132-300x169.jpg",
    "address": "Chemin de la Praz, Boudry (NE)",
    "kWp": "5.6 kWc",
    "coord": [
      2552983.41,
      1200569.92
    ]
  },
  {
    "name": "Paul Vouga 41, Marin, 8.02 kWc",
    "detail": "Installation 8.02 kWc, ajoutée avec profilés d'insertion, 24 modules Benq-AUO 335Wc, onduleur Fronius Symo 8.2-M-",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/IMG-20180621-WA0009-300x225.jpg",
    "address": "Paul Vouga 41, Marin",
    "kWp": "8.02 kWc",
    "coord": [
      2567635.75,
      1206431.375
    ]
  },
  {
    "name": "Paul Vouga 39, Marin, 7.37 kWc",
    "detail": "Installation 7.37 kWc, ajoutée avec profilés d'insertion, 22 modules Benq-AUO 335Wc, onduleur Fronius Symo 7.0-M-",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/20180615_162903-300x169.jpg",
    "address": "Paul Vouga 39, Marin",
    "kWp": "7.37 kWc",
    "coord": [
      2567640.25,
      1206426.25
    ]
  },
  {
    "name": "Paul Vouga 19, Marin, 7.375 kWc",
    "detail": "Installation 7.375 kWc, ajoutée avec profilés d'insertion, 25 modulesLongi295Wc full black, onduleur Fronius Symo 7.0-M-3",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/IMG-20180621-WA0007-300x225.jpg",
    "address": "Paul Vouga 19, Marin",
    "kWp": "7.375 kWc",
    "coord": [
      2567693.5,
      1206360.75
    ]
  },
  {
    "name": "Crêt-du-Locle, 10.62 kWc",
    "detail": "Installation10.62 kWc, ajoutée,36 modulesHeckert295 Wc, onduleur Fronius Symo 10.0-M-3, regroupement pour la consommation propre (RCP) 3 appartements, bouiler PAC avec optimisation PV.",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/11/20191130_131258-1024x576.jpg",
    "address": "Crêt-du-Locle",
    "kWp": "10.62 kWc",
    "coord": [
      2549774.75,
      1213752.375
    ]
  },
  {
    "name": "Fornachon, Peseux, 6.0 kWc",
    "detail": "Installation6.0 kWc, ajoutée sur toit en tôle,20 modulesTrina 300 Wc, 20 microonduleurs Enphase M250",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/20180718_184728-300x169.jpg",
    "address": "Fornachon, Peseux",
    "kWp": "6.0 kWc",
    "coord": [
      2557964.75,
      1203777.375
    ]
  },
  {
    "name": "Gorgier, 18 kWc",
    "detail": "Installation18.0 kWc, système intégré Solarstand, 60 modulesLongi 300 Wc, onduleur Kostal Piko 17",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/09/20190512_143932-1024x576.jpg",
    "address": "Gorgier",
    "kWp": "18 kWc",
    "coord": [
      2549851,
      1194754.25
    ]
  },
  {
    "name": "Hertiweg, Ipsach, 7.5 kWc",
    "detail": "Installation7.5 kWc, ajoutée sur toit tuile,25 modulesLongi 300 Wc, onduleur Kostal Piko 7 , chauffage PAC",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/11/20191116_145248-e1575136328636-1024x835.jpg",
    "address": "Hertiweg, Ipsach",
    "kWp": "7.5 kWc",
    "coord": [
      2584083,
      1217918.875
    ]
  },
  {
    "name": "Cours \"Ma future installation PV\" à Cernier du 25.5.2019",
    "detail": "Cours \"Ma future installation PV\" à Cernier du 25.5.2019",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/05/Annonce-cours-Autovoltaic-891x1024.jpg",
    "address": "",
    "kWp": "Cours \"Ma future installation PV\" à Cernier du 25.5.2019",
    "coord": [
      2561482.97,
      1205017.37
      ]
  },
  {
    "name": "Rue du Seu, 2054 Chézard-St-Martin (NE), 3.1 kWc",
    "detail": "Extension d'un système existant, ajouté sur tôle en cuivre, 10 modules 310 Wc, onduleur KACO, connexion avec PAC",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/09/2019-07-30-08.49.24-768x1024.jpg",
    "address": "Rue du Seu, 2054 Chézard-St-Martin (NE)",
    "kWp": "3.1 kWc",
    "coord": [
      2560115.5,
      1212775.875
    ]
  },
  {
    "name": "Rue de la Côté, 2000 Neuchâtel, 6.3 kWc",
    "detail": "Ajouté sur toit en cuivre, 20 modules de 315 Wc, regroupement pour la consommation propre (RCP).",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/09/20190904_113613-1024x576.jpg",
    "address": "Rue de la Côté, 2000 Neuchâtel",
    "kWp": "6.3 kWc",
    "coord": [
      2561650.5,
      1205314.5
    ]
  },
  {
    "name": "Ruz Baron, 2046 Fontaines (NE), 9.3 kWc",
    "detail": "Système ajouté sur toit tuiles béton \"Tegalit\", 31 modules Trina 300 Wc full black, onduleur Fronius Symo 8.2-3-M avec Smartmeter",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/11/20191125_143806-1024x576.jpg",
    "address": "Ruz Baron, 2046 Fontaines (NE)",
    "kWp": "9.3 kWc",
    "coord": [
      2558999,
      1210113.125
    ]
  },
  {
    "name": "Impasse des Rintzes , 1585 Cotterd (VD), 13.86 kWc",
    "detail": "Toit plat gravier, installation est-ouest, 44 modules, onduleur Kostal Plenticore 10",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/IMG-20200420-WA0004-1024x576.jpg",
    "address": "Impasse des Rintzes , 1585 Cotterd (VD)",
    "kWp": "13.86 kWc",
    "coord": [
      2568916.25,
      1197148.75
    ]
  },
  {
    "name": "Chemin des Champs-de-Rives, 1588 Cudrefin (VD), 10.56 kWc",
    "detail": "Toit tuile standard, installation ajoutée, 33 modules, onduleur Kostal Plenticore 10",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/IMG-20200416-WA0003-1024x768.jpg",
    "address": "Chemin des Champs des Rives, 1588 Cudrefin (VD)",
    "kWp": "10.56 kWc",
    "coord": [
      2568199.79, 
      1200557.67
    ]
  },
  {
    "name": "Route du Talent, 1042 Assens (VD), 5.49 kWc",
    "detail": "Petites tuiles, installation ajoutée, 18 modules, onduleur Fronius Symo 5.0-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/20200512_185452_c.jpg",
    "address": "Route des Talents, 1042 Assens (VD)",
    "kWp": "5.49 kWc",
    "coord": [
      2538869.17, 
      1163515.81
    ]
  },
  {
    "name": "Chemin de l’école, 1036 Sullens (VD), 12.21 kWc",
    "detail": "Tuiles standard, installation ajoutée, 37 modules, onduleur Kostal Plenticore 10",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/IMG-20200509-WA0007-1024x576.jpg",
    "address": "Chemin de l’école, 1036 Sullens (VD)",
    "kWp": "12.21 kWc",
    "coord": [
      2533268,
      1160337.125
    ]
  },
  {
    "name": "Impasse d’Inhart 24, 1787 Mur: 30.36 kWc",
    "detail": "Toit tuile et carport métal, 92 x 330 Wc, Kostal Piko 20",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201210-Saloranlage-Mur-DJI_0011-1024x768.jpg",
    "address": "Impasse de l’Inhart 24, 1787 Mur",
    "kWp": "30.36 kWc",
    "coord": [
      2571078.13, 
      1198981.09
    ]
  },
  {
    "name": "Chemin des Clées, 2017 Boudry, 22.11 kWc",
    "detail": "Toit en Eternit, 66 x 335 Wc, onduleur Kostal Piko 20",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201106_122717-1024x576.jpg",
    "address": "Chemin des Clées, 2017 Boudry",
    "kWp": "22.11 kWc",
    "coord": [
      2553657.5,
      1200875.625
    ]
  },
  {
    "name": "Hombergstrasse 3, 4466 Ormalingen (BL), 17.0 kWc",
    "detail": "Toit en tuile, 50 modules 340 Wc, onduleur Fronius Symo 15-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/Show.png",
    "address": "Hombergstrasse 3, 4466 Ormalingen (BL)",
    "kWp": "17.0 kWc",
    "coord": [
      2632422.25,
      1257981
    ]
  },
  {
    "name": "Rue du 1er Aout 27, 2300 La Chaux-de-Fonds, 7.14 kWc",
    "detail": "Toit plat gravier, 21 x 340 Wc, onduleur Solaredge SE7K avec optimiseurs P370",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/21428ff1-5583-42eb-b05f-e37f615f0eba-1024x768.jpg",
    "address": "Rue du 1er Aout 27, 2300 La Chaux-de-Fonds",
    "kWp": "7.14 kWc",
    "coord": [
      2553454.25,
      1217708.875
    ]
  },
  {
    "name": "En Galilée 31 , 2022 Bevaix, 9.1 Kwc",
    "detail": "Tuile en béton, 28 x 325 Wc, onduleur Kostal Plenticore plus 8.5",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201116_115832-1024x636.jpg",
    "address": "En Galilée 31 , 2022 Bevaix",
    "kWp": "9.1 Kwc",
    "coord": [
      2551738,
      1197353.5
    ]
  },
  {
    "name": "Chemin de Courberaye 32, 2012 Auvernier, 4.96 kWc",
    "detail": "Installation sur talus, 16 x 310 Wc, 16 microonduleurs Enphase IQ7+",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/Après.jpg",
    "address": "Chemin de Courberaye 32, 2012 Auvernier",
    "kWp": "4.96 kWc",
    "coord": [
      2557364.25,
      1203371.5
    ]
  },
  {
    "name": "Pommerets 23, 2037 Montezillon, 17.92 kWc",
    "detail": "Toit en Eternit ondulée, 56 x 320 Wc, onduleur Fronius Symo 15-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20200815_143351-1024x576.jpg",
    "address": "Pommerets 23, 2037 Montezillon",
    "kWp": "17.92 kWc",
    "coord": [
      2554155.25,
      1204234
    ]
  },
  {
    "name": "Chemin du Lago 18, 1453 Bullet (VD), 9.24 kWc",
    "detail": "Toit garage en tôle trapezoïdale, 28 x 330 Wc, onduleur Fronius Symo 8.2-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/cropped-1024x695.jpg",
    "address": "Chemin du Lago 18, 1453 Bullet (VD)",
    "kWp": "9.24 kWc",
    "coord": [
      2532148.25,
      1186856.375
    ]
  },
  {
    "name": "Rue des Peupliers 21, 1400 Yverdon (VD), 2.88 kWc",
    "detail": "Toit en tuiles, 9 x 320 Wc, onduleur Kostal Piko MP plus 3.0-2",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201102_102237-1024x576.jpg",
    "address": "Rue des Peupliers 21, 1400 Yverdon (VD)",
    "kWp": "2.88 kWc",
    "coord": [
      2538675.65, 
      1182061.92
    ]
  },
  {
    "name": "Rue de la Côte 79, 2000 Neuchâtel, 5.44 kWc",
    "detail": "Toit en tuile, 16 x 340 Wc, onduleur Fronius Symo 12.5-3-M (pour extension ultérieure)",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/IMG-20201204-WA0000-768x1024.jpg",
    "address": "Rue de la Côte 79, 2000 Neuchâtel",
    "kWp": "5.44 kWc",
    "coord": [
      2561028.75,
      1205010.875
    ]
  },
  {
    "name": "Vy d'Etra 117, 2000 Neuchâtel, 10.88 kWc",
    "detail": "Toit en tuile, 34 x 320 Wc, onduleurs Kostal Plenticore 8 et MC 1.5-2",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/photo1-1024x768.png",
    "address": "Vy d'Etra 117, 2000 Neuchâtel",
    "kWp": "10.88 kWc",
    "coord": [
      2563968,
      1206906.5
    ]
  },
  {
    "name": "Paul Vouga, Marin (NE), 13.0 kWc",
    "detail": "Structure en alu sur entrée garages en béton, 40 x 325 Wc, onduleur Kostal Piko 12.5",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/IMG_3113-1024x768.jpg",
    "address": "Paul Vouga, Marin (NE)",
    "kWp": "13.0 kWc",
    "coord": [
      2567709.28, 
      1206421.64
    ]
  },
  {
    "name": "Route du Châtel, 1803 Chardonne (VD), 4.55 kWc",
    "detail": "Toit garage bitume/gravier, sousconstruction K2 S-dome lesté par plaques en béton, 14 modules full-black 325 Wc, 14 microonduleurs Enphase IQ7 240 VA (système monophasé)",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/03/20210313_151054-1024x576.jpg",
    "address": "Route du Châtel, 1803 Chardonne (VD)",
    "kWp": "4.55 kWc",
    "coord": [
      2553625.5,
      1147505
    ]
  },
  {
    "name": "Chemin des Bioleyres, 1405 Pomy(VD): 8.125 kWc",
    "detail": "Installation ajoutée sur toit en tuiles, modules Bisol fullblack 325 Wc, onduleur Fronius Symo 7.0-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/05/20210417_113337-1024x576.jpg",
    "address": "Chemin des Bioleyres, 1405 Pomy(VD)",
    "kWp": "8.125 kWc",
    "coord": [
      2541378,
      1179030.625
    ]
  },
  {
    "name": "Chemin des Clavins, 2108 Couvet (NE): 6.3 kWc",
    "detail": "Installation ajoutée sur toit en tuile, 18 modules Jinko Tiger 350 Wc fullblack, onduleur Fronius Symo 6.0-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/05/20210426_114909-1024x576.jpg",
    "address": "Chemin des Clavins, 2108 Couvet (NE)",
    "kWp": "6.3 kWc",
    "coord": [
      2538998.25,
      1197244.625
    ]
  },
  {
    "name": "Chemin Alfred-Borel, 2022 Bevaix (NE): 8.28 kWc",
    "detail": "Carport avec toit en tôle, 23 modules Jinko Tiger 350 Wc avec optimizeurs P370, onduleur SolarEdge SE7K",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/08/kaeser_terminé-1024x768.jpg",
    "address": "Chemin Alfred-Borel, 2022 Bevaix (NE)",
    "kWp": "8.28 kWc",
    "coord": [
      2552553,
      1197025
    ]
  },
  {
    "name": "Les Bulles, 2300 La Chaux-de-Fonds (NE): 5.1 kWc",
    "detail": "Couvert de terrasse, 15 modules 340 Wc",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/08/FOTFFAF.jpg",
    "address": "Les Bulles, 2300 La Chaux-de-Fonds (NE)",
    "kWp": "5.1 kWc",
    "coord": [
      2554033.75,
      1218598.875
    ]
  },
  {
    "name": "Paul Vouga, 2074 Marin (NE): 8.47 kWc",
    "detail": "Installation ajoutée, 22 x JA Solar JAM60S20-385 Wc, onduleur Fronius 8.2-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/09/IMG_4532-1024x768.jpg",
    "address": "Paul Vouga, 2074 Marin (NE)",
    "kWp": "8.47 kWc",
    "coord": [
      2567693.5,
      1206360.75
    ]
  },
  {
    "name": "Paul Vouga, 2074 Marin (NE): 8.085 kWc",
    "detail": "Installation ajoutée, 21 x JA Solar JAM60S20-385 Wc, onduleur Fronius 7.0-3-M",
    "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/09/IMG_4515-1024x768.jpg",
    "address": "Paul Vouga, 2074 Marin (NE)",
    "kWp": "8.085 kWc",
    "coord": [
      2567693.5,
      1206360.75
    ]
  }
]

const systemsarray = []

let s = 0;
while (s < systems.length) {
    let feature = new Feature({
        geometry: new Point(systems[s].coord),
        name: systems[s].name,
        desc: '<b>' + systems[s].name + '</b><br>' + systems[s].detail + '<br><img src="' +systems[s].img + '" alt="'+systems[s].name+ '" width="300">',
        type: 'Point',
        population: 4000,
        rainfall: 500,
    });
    feature.setStyle(iconStyle);
    systemsarray.push(feature);
    s++;

}

console.log(systemsarray)
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
  url: 'https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml',
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