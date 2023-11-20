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

// https://www.swisstopo.admin.ch/en/maps-data-online/calculation-services/m2m.html#dokumente_und_publik
// http://geodesy.geo.admin.ch/reframe/lv03towgs84?easting=600000&northing=200000&altitude=550.0&format=json
// http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=2600000&northing=1200000&altitude=550.0&format=json
// http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=2561482.97&northing=1205017.37&altitude=550.0&format=json

const systems = 
[
    {
        "name": "Cr\u00e9ation de l&rsquo;association Autovolta\u00efc",
        "detail": "L&rsquo;assembl\u00e9e g\u00e9n\u00e9rale constitutivede l&rsquo;association Autovolta\u00efc a eu lieu le 29 mars 2017 \u00e0 Neuch\u00e2tel. Elle apour but d&rsquo;augmenter le nombre d&rsquo;installations photovolta\u00efques de la r\u00e9gion neuch\u00e2teloise gr\u00e2ce \u00e0 l&rsquo;aide mutuelle de ses membres pour la r\u00e9alisation des installations.,",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2017/04/20150307-182609-copy.jpg",
        "address": "Rue Louis-Favre 5, 2000 Neuch\u00e2tel",
        "kWp": "None kWc",
        "coord": [
            2561479,
            1205017.875
        ]
    },
    {
        "name": "Chemin de la Praz, Boudry (NE), 5.6 kWc",
        "detail": "Installation ajout\u00e9 sur tuile standard,",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/20160814_153132-1024x576.jpg",
        "address": "Chemin de la Praz, Boudry (NE)",
        "kWp": "5.6 kWc",
        "coord": [
            2552967.407,
            1200608.094
        ]
    },
    {
        "name": "Rue Messeillers, Neuch\u00e2tel, 12.2 kWc",
        "detail": "Deux installations PV de 6.2 kWp et de 6 kWp, r\u00e9alis\u00e9es en autoconstruction en 2015, install\u00e9es en forme compacte surun seul toit partag\u00e9 par deux voisins. &nbsp; &nbsp;",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2017/05/20150321_135045-1024x768.jpg",
        "address": "Rue Messeillers, Neuch\u00e2tel",
        "kWp": "12.2 kWc",
        "coord": [
            2560204.25,
            1205486.625
        ]
    },
    {
        "name": "Cours \u00ab\u00a0Ma future installation PV\u00a0\u00bb \u00e0 Cernier du 25.5.2019",
        "detail": "Cours \u00ab\u00a0Ma future installation PV\u00a0\u00bb \u00e0 Cernier du 25.5.2019,",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/05/Annonce-cours-Autovoltaic-261x300.jpg",
        "address": "Rue Louis-Favre 5, 2000 Neuch\u00e2tel",
        "kWp": "None kWc",
        "coord": [
            2561479,
            1205017.875
        ]
    },
    {
        "name": "Rue du Suchiez, Neuch\u00e2tel, 14.7 kWc",
        "detail": "Installation ajout\u00e9e sur t\u00f4le ondul\u00e9e m\u00e9tallique,",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/9-1024x768.jpg",
        "address": "Rue du Suchiez, Neuch\u00e2tel",
        "kWp": "14.7 kWc",
        "coord": [
            2559368.75,
            1204421.375
        ]
    },
    {
        "name": "Tertre, Neuch\u00e2tel, 3.78 kWc",
        "detail": "Installation int\u00e9gr\u00e9e 3.78 kWc, syst\u00e8me Solrif, 18 modules CNPV 210 Wc, onduleur Kostal",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/20170928_141236-1024x768.jpg",
        "address": "Tertre, Neuch\u00e2tel",
        "kWp": "3.78 kWc",
        "coord": [
            2561355.75,
            1204915.25
        ]
    },
    {
        "name": "Chemin Bel-Air, Neuch\u00e2tel, 3.0 kWc",
        "detail": "Installation 3.0 kWc, sur socle b\u00e9ton, 9 modules Sunpower 335 Wc, onduleur Kostal 3.0 kVA",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/01/Unbenannt-300x225.jpg",
        "address": "Chemin Bel-Air, Neuch\u00e2tel",
        "kWp": "3 kWc",
        "coord": [
            2562493,
            1205436.625
        ]
    },
    {
        "name": "Cr\u00eat-du-Locle, 10.62 kWc",
        "detail": "Installation10.62 kWc, ajout\u00e9e,36 modulesHeckert295 Wc, onduleur Fronius Symo 10.0-M-3, regroupement pour la consommation propre (RCP) 3 appartements, bouiler PAC avec optimisation PV.  ",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/11/20191130_131258-300x169.jpg",
        "address": "Cr\u00eat-du-Locle",
        "kWp": "10.62 kWc",
        "coord": [
            2549774.75,
            1213752.375
        ]
    },
    {
        "name": "Paul Vouga 41, Marin, 8.02 kWc",
        "detail": "Installation 8.02 kWc, ajout\u00e9e avec profil\u00e9s d&rsquo;insertion, 24 modules Benq-AUO 335Wc, onduleur Fronius Symo 8.2-M-3",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/IMG-20180621-WA0009-1024x768.jpg",
        "address": "Paul Vouga 41, Marin",
        "kWp": "8.02 kWc",
        "coord": [
            2567635.75,
            1206431.375
        ]
    },
    {
        "name": "Paul Vouga 39, Marin, 7.37 kWc",
        "detail": "Installation 7.37 kWc, ajout\u00e9e avec profil\u00e9s d&rsquo;insertion, 22 modules Benq-AUO 335Wc, onduleur Fronius Symo 7.0-M-3",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/20180615_162903-1024x576.jpg",
        "address": "Paul Vouga 39, Marin",
        "kWp": "7.37 kWc",
        "coord": [
            2567640.25,
            1206426.25
        ]
    },
    {
        "name": "Paul Vouga 19, Marin, 7.375 kWc",
        "detail": "Installation 7.375 kWc, ajout\u00e9e avec profil\u00e9s d&rsquo;insertion, 25 modulesLongi295Wc full black, onduleur Fronius Symo 7.0-M-3",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/IMG-20180621-WA0007-1024x768.jpg",
        "address": "Paul Vouga 19, Marin",
        "kWp": "7.375 kWc",
        "coord": [
            2567693.5,
            1206360.75
        ]
    },
    {
        "name": "Fornachon, Peseux, 6.0 kWc",
        "detail": "Installation 6.0 kWc, ajout\u00e9e sur toit en t\u00f4le,20 modulesTrina 300 Wc, onduleur Enphase 20 microonduleurs M250",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2018/07/20180718_184728-1024x576.jpg",
        "address": "Fornachon, Peseux",
        "kWp": "6 kWc",
        "coord": [
            2557964.75,
            1203777.375
        ]
    },
    {
        "name": "Gorgier, 18 kWc",
        "detail": "Installation18.0 kWc, syst\u00e8me int\u00e9gr\u00e9 Solarstand, 60 modulesLongi 300 Wc, onduleur Kostal Piko 17",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/09/20190512_143932-300x169.jpg",
        "address": "Gorgier",
        "kWp": "18 kWc",
        "coord": [
            2549851,
            1194754.25
        ]
    },
    {
        "name": "Hertiweg, Ipsach, 7.5 kWc",
        "detail": "Installation7.5 kWc, ajout\u00e9e sur toit tuile,25 modulesLongi 300 Wc, onduleur Kostal Piko 7 , chauffage PAC",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/11/20191116_145248-e1575136328636-300x244.jpg",
        "address": "Hertiweg, Ipsach",
        "kWp": "7.5 kWc",
        "coord": [
            2584083,
            1217918.875
        ]
    },
    {
        "name": "Rue de la C\u00f4t\u00e9, 2000 Neuch\u00e2tel, 6.3 kWc",
        "detail": "Ajout\u00e9 sur toit en cuivre, 20 modules de 315 Wc, regroupement pour la consommation propre (RCP).",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/09/20190904_113613-300x169.jpg",
        "address": "Rue de la C\u00f4t\u00e9, 2000 Neuch\u00e2tel",
        "kWp": "6.3 kWc",
        "coord": [
            2561650.5,
            1205314.5
        ]
    },
    {
        "name": "Rue du Seu, 2054 Ch\u00e9zard-St-Martin (NE), 3.1 kWc",
        "detail": "Extension d&rsquo;un syst\u00e8me existant, ajout\u00e9 sur t\u00f4le en cuivre, 10 modules 310 Wc, onduleur KACO, connexion avec PAC",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/09/2019-07-30-08.49.24-225x300.jpg",
        "address": "Rue du Seu, 2054 Ch\u00e9zard-St-Martin (NE)",
        "kWp": "3.1 kWc",
        "coord": [
            2560115.5,
            1212775.875
        ]
    },
    {
        "name": "Ruz Baron, 2046 Fontaines (NE), 9.3 kWc",
        "detail": "Syst\u00e8me ajout\u00e9 sur toit tuiles b\u00e9ton \u00abTegalit\u00bb, 31 modules Trina 300 Wc full black, onduleur Fronius Symo 8.2-3-M avec Smartmeter",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2019/11/20191125_143806-300x169.jpg",
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
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/IMG-20200420-WA0004-300x169.jpg",
        "address": "Impasse des Rintzes , 1585 Cotterd (VD)",
        "kWp": "13.86 kWc",
        "coord": [
            2568916.25,
            1197148.75
        ]
    },
    {
        "name": "Chemin des Champs des Rives, 1588 Cudrefin (VD), 10.56 kWc",
        "detail": "Toit tuile standard, installation ajout\u00e9e, 33 modules, onduleur Kostal Plenticore 10",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/IMG-20200416-WA0003-300x225.jpg",
        "address": "Chemin des Champs des Rives, 1588 Cudrefin (VD)",
        "kWp": "10.56 kWc",
        "coord": [
            2568301.137,
            1200547.12
        ]
    },
    {
        "name": "Route des Talents, 1042 Assens (VD), 5.49 kWc",
        "detail": "Petites tuiles, installation ajout\u00e9e, 18 modules, onduleur Fronius Symo 5.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/20200512_185452_c-300x169.jpg",
        "address": "Route des Talents, 1042 Assens (VD)",
        "kWp": "5.49 kWc",
        "coord": [
            2538693.082,
            1163362.433
        ]
    },
    {
        "name": "Rue de la C\u00f4te 79, 2000 Neuch\u00e2tel, 5.44 kWc",
        "detail": "Toit en tuile, 16 x 340 Wc, onduleur Fronius Symo 12.5-3-M (pour extension ult\u00e9rieure)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/IMG-20201204-WA0000-768x1024.jpg",
        "address": "Rue de la C\u00f4te 79, 2000 Neuch\u00e2tel",
        "kWp": "5.44 kWc",
        "coord": [
            2561028.75,
            1205010.875
        ]
    },
    {
        "name": "Chemin de l\u2019\u00e9cole,  1036 Sullens (VD), 12.21 kWc",
        "detail": "Tuiles standard, installation ajout\u00e9e, 37 modules, onduleur Kostal Plenticore 10",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2020/05/IMG-20200509-WA0007-300x169.jpg",
        "address": "Chemin de l\u2019\u00e9cole,  1036 Sullens (VD)",
        "kWp": "12.21 kWc",
        "coord": [
            2533268,
            1160337.125
        ]
    },
    {
        "name": "Chemin du Lago 18, 1453 Bullet (VD), 9.24 kWc",
        "detail": "Toit garage en t\u00f4le trapezo\u00efdale, 28 x 330 Wc, onduleur Fronius Symo 8.2-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/cropped-300x203.jpg",
        "address": "Chemin du Lago 18, 1453 Bullet (VD)",
        "kWp": "9.24 kWc",
        "coord": [
            2532148.25,
            1186856.375
        ]
    },
    {
        "name": "Impasse de l\u2019Inhart 24, 1787 Mur: 30.36 kWc",
        "detail": "Toit tuile et carport m\u00e9tal, 92 x 330 Wc, onduleur Kostal Piko 20",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201210-Saloranlage-Mur-DJI_0011-300x225.jpg",
        "address": "Impasse de l\u2019Inhart 24, 1787 Mur",
        "kWp": "30.36 kWc",
        "coord": [
            2571066.456,
            1198920.089
        ]
    },
    {
        "name": "Chemin de Courberaye 32, 2012 Auvernier, 4.96 kWc",
        "detail": "Installation sur talus, 16 x 310 Wc, 16 microonduleurs Enphase IQ7+",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/Apr\u00e8s-300x202.jpg",
        "address": "Chemin de Courberaye 32, 2012 Auvernier",
        "kWp": "4.96 kWc",
        "coord": [
            2557364.25,
            1203371.5
        ]
    },
    {
        "name": "Vy d&rsquo;Etra 117, 2000 Neuch\u00e2tel, 10.88 kWc",
        "detail": "Toit en tuile, 34 x 320 Wc, onduleurs Kostal Plenticore 8 et MC 1.5-2",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/photo1-300x225.png",
        "address": "Vy d&rsquo;Etra 117, 2000 Neuch\u00e2tel",
        "kWp": "10.88 kWc",
        "coord": [
            2535901.75,
            1182767
        ]
    },
    {
        "name": "Rue des Peupliers 21, 1400 Yverdon (VD), 2.88 kWc",
        "detail": "Toit en tuiles, 9 x 320 Wc, onduleur Kostal Piko MP plus 3.0-2",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201102_102237-300x169.jpg",
        "address": "Rue des Peupliers 21, 1400 Yverdon (VD)",
        "kWp": "2.88 kWc",
        "coord": [
            2538683.099,
            1182051.23
        ]
    },
    {
        "name": "Pommerets 23, 2037 Montezillon, 17.92 kWc",
        "detail": "Toit en Eternit ondul\u00e9e, 56 x 320 Wc, onduleur Fronius Symo 15-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20200815_143351-300x169.jpg",
        "address": "Pommerets 23, 2037 Montezillon",
        "kWp": "17.92 kWc",
        "coord": [
            2554155.25,
            1204234
        ]
    },
    {
        "name": "Copropri\u00e9t\u00e9 Amphora Paul Vouga - Marin - 11.7 kWc",
        "detail": "Copropri\u00e9t\u00e9 Amphora, Paul Vouga -,  Marin - 11.7 kWc - Murs en b\u00e9ton lat\u00e9raux, par-dessus gravier - 36 x JA-Solar 325 Wc - Kostal Plenticore plus 10, avec 3 MPP",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/21-Pascale-Guiterres-1-300x225.jpg",
        "address": "Paul-Vouga 19, 2074 Marin",
        "kWp": "11.7 kWc",
        "coord": [
            2567693.5,
            1206360.75
        ]
    },
    {
        "name": "Paul Vouga, Marin (NE), 13.0 kWc",
        "detail": "Structure en alu sur entr\u00e9e garages en b\u00e9ton, 40 x 325 Wc, onduleur Kostal Piko 12.5",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/IMG_3113-300x225.jpg",
        "address": "Paul Vouga, Marin (NE)",
        "kWp": "13 kWc",
        "coord": [
            2566756.609,
            1206539.981
        ]
    },
    {
        "name": "Rue du 1er Aout 27, 2300 La Chaux-de-Fonds, 7.14 kWc",
        "detail": "Toit plat gravier, 21 x 340 Wc, onduleur Solaredge SE7K avec optimiseurs P370",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/21428ff1-5583-42eb-b05f-e37f615f0eba-300x225.jpg",
        "address": "Rue du 1er Aout 27, 2300 La Chaux-de-Fonds",
        "kWp": "7.14 kWc",
        "coord": [
            2553454.25,
            1217708.875
        ]
    },
    {
        "name": "Hombergstrasse 3, 4466 Ormalingen (BL), 17.0 kWc",
        "detail": "Toit en tuile, 50 modules 340 Wc, onduleur Fronius Symo 15-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/Show-300x225.png",
        "address": "Hombergstrasse 3, 4466 Ormalingen (BL)",
        "kWp": "17 kWc",
        "coord": [
            2632422.25,
            1257981
        ]
    },
    {
        "name": "er Aout  La Chaux-de-Fonds - 7.14 kWc",
        "detail": "er Aout ,  La Chaux-de-Fonds - 7.14 kWc - Plat, Gravier - 21 x Trina 340 Wc - Solaredge SE7K (3ph)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/040_Francillon_CdF-300x225.jpg",
        "address": "1er Aout 27, 2300 La Chaux-de-Fonds",
        "kWp": "7.14 kWc",
        "coord": [
            2553454.25,
            1217708.875
        ]
    },
    {
        "name": "Chemin des Cl\u00e9es, 2017 Boudry, 22.11 kWc",
        "detail": "Toit en Eternit, 66 x 335 Wc, onduleur Kostal Piko 20",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201106_122717-300x169.jpg",
        "address": "Chemin des Cl\u00e9es, 2017 Boudry",
        "kWp": "22.11 kWc",
        "coord": [
            2553657.5,
            1200875.625
        ]
    },
    {
        "name": "En Galil\u00e9e 31 , 2022 Bevaix, 9.1 Kwc",
        "detail": "Tuile en b\u00e9ton, 28 x 325 Wc, onduleur Kostal Plenticore plus 8.5",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/01/20201116_115832-300x186.jpg",
        "address": "En Galil\u00e9e 31 , 2022 Bevaix",
        "kWp": "None kWc",
        "coord": [
            2551738,
            1197353.5
        ]
    },
    {
        "name": "Route du Ch\u00e2tel, 1803 Chardonne (VD), 4.55 kWc",
        "detail": "Toit garage bitume/gravier, sousconstruction K2 S-dome lest\u00e9 par plaques en b\u00e9ton, 14 modules full-black 325 Wc, onduleur Enphase 14 microonduleurs IQ7 240 VA (syst\u00e8me monophas\u00e9)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/03/20210313_151054-300x169.jpg",
        "address": "Route du Ch\u00e2tel, 1803 Chardonne (VD)",
        "kWp": "4.55 kWc",
        "coord": [
            2553625.5,
            1147505
        ]
    },
    {
        "name": "Chemin des Bioleyres, 1405 Pomy(VD): 8.125 kWc",
        "detail": "Installation ajout\u00e9e sur toit en tuiles, modules Bisol fullblack 325 Wc, onduleur Fronius Symo 7.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/05/20210417_113337-300x169.jpg",
        "address": "Chemin des Bioleyres, 1405 Pomy(VD)",
        "kWp": "8.125 kWc",
        "coord": [
            2541378,
            1179030.625
        ]
    },
    {
        "name": "Paul Vouga, 2074 Marin (NE): 8.47 kWc",
        "detail": "Installation ajout\u00e9e, 22 x JA Solar JAM60S20-385 Wc, onduleur Fronius 8.2-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/09/IMG_4532-300x225.jpg",
        "address": "Paul Vouga, 2074 Marin (NE)",
        "kWp": "8.47 kWc",
        "coord": [
            2567693.5,
            1206360.75
        ]
    },
    {
        "name": "Paul Vouga, 2074 Marin (NE): 8.085 kWc",
        "detail": "Installation ajout\u00e9e, 21 x JA Solar JAM60S20-385 Wc, onduleur Fronius 7.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/09/IMG_4515-300x225.jpg",
        "address": "Paul Vouga, 2074 Marin (NE)",
        "kWp": "8.085 kWc",
        "coord": [
            2567693.5,
            1206360.75
        ]
    },
    {
        "name": "Chemin des Clavins, 2108 Couvet (NE): 6.3 kWc",
        "detail": "Installation ajout\u00e9e sur toit en tuile, 18 modules Jinko Tiger 350 Wc fullblack, onduleur Fronius Symo 6.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/05/20210426_114909-300x169.jpg",
        "address": "Chemin des Clavins, 2108 Couvet (NE)",
        "kWp": "6.3 kWc",
        "coord": [
            2538998.25,
            1197244.625
        ]
    },
    {
        "name": "Chemin Alfred-Borel, 2022 Bevaix (NE): 8.28 kWc",
        "detail": "Carport avec toit en t\u00f4le, 23 modules Jinko Tiger 350 Wc avec optimizeurs P370, onduleur SolarEdge SE7K",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/08/kaeser_termin\u00e9-300x225.jpg",
        "address": "Chemin Alfred-Borel, 2022 Bevaix (NE)",
        "kWp": "8.28 kWc",
        "coord": [
            2552553,
            1197025
        ]
    },
    {
        "name": "Impasse des Rintzes Cotterd - 15.12 kWc",
        "detail": "Impasse des Rintzes,  Cotterd - 15.12 kWc - Plat, Gravier -  - Huawei SUN2000 KTL-12",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/056_Renfer_Cotterd-rotated.jpg",
        "address": "Impasse des Rintzes 7, 1585 Cotterd",
        "kWp": "15.12 kWc",
        "coord": [
            2568834.0,
            1197113.875
        ]
    },
    {
        "name": "La Roche  Auvernier - 5.625 kWc",
        "detail": "La Roche ,  Auvernier - 5.625 kWc - Tuiles -  - Fronius Symo 5.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/056_Broillet-Auvernier-300x135.jpg",
        "address": "La Roche 17, 2012 Auvernier",
        "kWp": "5.625 kWc",
        "coord": [
            2557092.75,
            1203245.625
        ]
    },
    {
        "name": "Les Bulles, 2300 La Chaux-de-Fonds (NE): 5.1 kWc",
        "detail": "Couvert de terrasse, 15 modules 340 Wc",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2021/08/FOTFFAF-300x169.jpg",
        "address": "Les Bulles, 2300 La Chaux-de-Fonds (NE)",
        "kWp": "5.1 kWc",
        "coord": [
            2554033.75,
            1218598.875
        ]
    },
    {
        "name": "Vy d\u2019Etra  Boudry - 11.2 kWc",
        "detail": "Vy d\u2019Etra ,  Boudry - 11.2 kWc - Tuiles - 28 x Soluxtec 400 Wc - Solaredge SE10 (3ph)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0060_Kaeser_Boudry-300x215.png",
        "address": "Vy d\u2019Etra 2, 2017 Boudry",
        "kWp": "11.2 kWc",
        "coord": [
            2553102.25,
            1200571.375
        ]
    },
    {
        "name": "Lindenhof Gurbr\u00fc - 24.15 kWc",
        "detail": "Lindenhof,  Gurbr\u00fc - 24.15 kWc - Int\u00e9gr\u00e9 - 69 x Megasol - SYMO 20.0-3-M + SPD Typ I+II",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0062_Varley_Gummenen-rotated.jpg",
        "address": "Lindenhof, 3208 Gurbr\u00fc",
        "kWp": "24.15 kWc",
        "coord": [
            2582946.75,
            1201503.875
        ]
    },
    {
        "name": "Doloires  Saules - 7.2 kWc",
        "detail": "Doloires ,  Saules - 7.2 kWc - petite tuile terre cuite - 18 x Soluxtec DMMMXSC400 - 400 Wc - Solaredge SE10K (3ph)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0064_Persoz_Saules-300x225.jpg",
        "address": "Doloires 30, 2063 Saules",
        "kWp": "7.2 kWc",
        "coord": [
            2562227.5,
            1209700.375
        ]
    },
    {
        "name": "Impasse des Rintzes  Portalban - 11.06 kWc",
        "detail": "Impasse des Rintzes ,  Portalban - 11.06 kWc - Tuiles - 28 x Trina Vertex 400 Wp - Huawei SUNN2000 10KTL-M2",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0065_Stoller_Gotterd-300x235.png",
        "address": "Impasse des Rintzes 1, 1585 Cotterd",
        "kWp": "11.06 kWc",
        "coord": [
            2568799.0,
            1197075.0
        ]
    },
    {
        "name": "Impasse des Rintzes  Portalban - 15.2 kWc",
        "detail": "Impasse des Rintzes ,  Portalban - 15.2 kWc - Tuiles - 38 x Trina Vertex 400 Wp - Huawei SUNN2000 10KTL-M2",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0066_Bellina_Cotter-300x259.png",
        "address": "Impasse des Rintzes 2, 1585 Cotterd",
        "kWp": "15.2 kWc",
        "coord": [
            2568932.75,
            1197178.25
        ]
    },
    {
        "name": "Jonquilles  Cernier - 7.12 kWc",
        "detail": "Jonquilles ,  Cernier - 7.12 kWc - Garage couvert avec t\u00f4le galvanis\u00e9e trap\u00e8ze - 16 x BISOL 445 Wc - Fronius Symo 6.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0067_Mesot_Cernier-300x225.jpg",
        "address": "Jonquilles 22, 2053 Cernier",
        "kWp": "7.12 kWc",
        "coord": [
            2558652.0,
            1211855.5
        ]
    },
    {
        "name": "Route de Chaulin  Brent - 9.6 kWc",
        "detail": "Route de Chaulin ,  Brent - 9.6 kWc - Toit plat, Bitume, gravier - 26 x Jinko Tiger N 370Wc,full-black, 10deg inclinaison - Fronius Symo Gen24 10.0",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0069_JC_Bernasconi_Brent-300x169.jpeg",
        "address": "Route de Chaulin 59, 1817 Brent",
        "kWp": "9.6 kWc",
        "coord": [
            2559151.5,
            1144759.25
        ]
    },
    {
        "name": "Herdiweg a Ipsach - 3.2 kWc",
        "detail": "Herdiweg a, Ipsach - 3.2 kWc - Tuile ciment, contre-lattage neuf - 8 x JAM54S31-395/MR - Kostal pico M plus",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0070_DF_Dal-Pozzolo_Ipsach-300x195.png",
        "address": "Herdiweg 1a, Ipsach",
        "kWp": "3.2 kWc",
        "coord": [
            2584070.0,
            1217905.0
        ]
    },
    {
        "name": "Rue du Bas a Cormondr\u00e8che - 4.125 kWc",
        "detail": "Rue du Bas a,  Cormondr\u00e8che - 4.125 kWc - Toit petite tuile r\u00e9cent - 11 x Bisol FB 375 Wc - Fronius Symo 3.7-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0075_DF_Bongard_Cormondreche-scaled.jpg",
        "address": "Rue du Bas 6a, 2036 Cormondr\u00e8che",
        "kWp": "4.125 kWc",
        "coord": [
            2556760.25,
            1203350.0
        ]
    },
    {
        "name": "Les C\u00f4tes-du-Doubs  La Chaux-de-Fonds - 19.8 kWc",
        "detail": "Les C\u00f4tes-du-Doubs ,  La Chaux-de-Fonds - 19.8 kWc - Tuiles - 60 x Aleo X83L330, 330Wc - SMA STP 15000TL-30",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0084_FG_Kernen_La-Chaux-de-Fond-scaled.jpg",
        "address": "Les C\u00f4tes-du-Doubs 6, 2300 La Chaux-de-Fonds",
        "kWp": "19.8 kWc",
        "coord": [
            2553517.25,
            1220136.25
        ]
    },
    {
        "name": "Rue du Sentier  Colombier - 6.8 kWc",
        "detail": "Rue du Sentier ,  Colombier - 6.8 kWc - Toit terrasse neuf , gravier - 17 x Jinko 400 Wc - Solaredge SE7K (3ph)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0085_DF_Gasser_Colombier-300x225.jpg",
        "address": "Rue du Sentier 30, 2013 Colombier",
        "kWp": "6.8 kWc",
        "coord": [
            2555439.5,
            1202037.125
        ]
    },
    {
        "name": "Seu  Ch\u00e9zard-St-Martin - 2.6 kWc",
        "detail": "Seu ,  Ch\u00e9zard-St-Martin - 2.6 kWc - Facade - 2 x JA Solar JAM60S17-325/MR - Enphase Micro-onduleur - IQ7X-INT (315 W)",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0096_DF_Juvet_Chezard3-scaled.jpg",
        "address": "Seu 26, 2054 Ch\u00e9zard-St-Martin",
        "kWp": "2.6 kWc",
        "coord": [
            2560143.5,
            1212819.125
        ]
    },
    {
        "name": "Ch. des Britani\u00e8res  Evilard - 12.48 kWc",
        "detail": "Ch. des Britani\u00e8res ,  Evilard - 12.48 kWc - Tuiles - 32 x JA-Solar 390 Wc - Huawei Sun2000 10 KTL/M1",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0106_MJ_Batista_Evilard-300x169.jpg",
        "address": "Ch. des Britani\u00e8res 6, 2533 Evilard",
        "kWp": "12.48 kWc",
        "coord": [
            2585316.75,
            1222679.625
        ]
    },
    {
        "name": "Au Ruz Baron  Fontaines - 5.52 kWc",
        "detail": "Au Ruz Baron ,  Fontaines - 5.52 kWc - Tuiles - 12 x Axitec 460 Wp - Huawei Sun2000 8.0 KTL",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0108_DF_Geiser_Fontaine-scaled.jpg",
        "address": "Au Ruz Baron 38, 2046 Fontaines",
        "kWp": "5.52 kWc",
        "coord": [
            2559176.5,
            1210068.0
        ]
    },
    {
        "name": "Au Ruz Baron  Fontaines - 18 kWc",
        "detail": "Au Ruz Baron ,  Fontaines - 18 kWc - Tuiles - 48 x Eurener 375 Wc noir - Fronius Symo 15-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0109_DF_Mesot_Fontaines-300x225.jpg",
        "address": "Au Ruz Baron 30, 2046 Fontaines",
        "kWp": "18 kWc",
        "coord": [
            2559133.5,
            1209986.5
        ]
    },
    {
        "name": "Vinelzstrasse  Erlach - 21 kWc",
        "detail": "Vinelzstrasse ,  Erlach - 21 kWc - Tuiles - 50 x  Jinko 420 Wc - Huawei Sun2000 20 KTL/M2",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0121_JD_Masel_Erlach-300x225.jpg",
        "address": "Vinelzstrasse 33, 3235 Erlach",
        "kWp": "21 kWc",
        "coord": [
            2574235.25,
            1209998.5
        ]
    },
    {
        "name": "Rue de l'Orbe  Vallorbe - 7.5 kWc",
        "detail": "Rue de l'Orbe ,  Vallorbe - 7.5 kWc - Tuiles - 20 x Jinko Tiger 375W N-Type - Fronius Symo GEN24 8.0 Plus",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0128_JC_Suardi_Vallorbe-300x225.jpg",
        "address": "Rue de l'Orbe 58, 1337 Vallorbe",
        "kWp": "7.5 kWc",
        "coord": [
            2518717.5,
            1173640.5
        ]
    },
    {
        "name": "Pr\u00e9s Gu\u00ebtins  La Neuveville - 8.88 kWc",
        "detail": "Pr\u00e9s Gu\u00ebtins ,  La Neuveville - 8.88 kWc - Tuiles - 24 x IBC MONOSOL 370 Wc - Huawei SUN2000-8KTL-M1",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0058_Visinand_La-Neuveville-300x225.jpg",
        "address": "Pr\u00e9s Gu\u00ebtins 55, 2520 La Neuveville",
        "kWp": "8.88 kWc",
        "coord": [
            2574416.75,
            1213077.375
        ]
    },
    {
        "name": "Route de l\u2019\u00e9toile  Gorgier - 11.34 kWc",
        "detail": "Route de l\u2019\u00e9toile ,  Gorgier - 11.34 kWc - Tuiles - 28 x 405 Wc - Fronius Symo 5.0-3-M",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0081_JD_Burgat_Gorgier-300x225.jpg",
        "address": "Route de l\u2019\u00e9toile 3, 2023 Gorgier\n",
        "kWp": "11.34 kWc",
        "coord": [
            2549365.0,
            1195674.625
        ]
    },
    {
        "name": "Rte de Cl\u00e9mesin  Villier - 23.1 kWc",
        "detail": "Rte de Cl\u00e9mesin , Villier - 23.1 kWc - Tuiles - 60 x E.CLASSIC M HC 370 Black - SMA Sunny Tripower 15000",
        "img": "https://autovoltaic-ne.ch/wp-content/uploads/2023/11/0115_FG_Geiser_Villiers-300x169.jpg",
        "address": "Cl\u00e9mesin 7, 2057 Villiers",
        "kWp": "23.1 kWc",
        "coord": [
            2565306.5,
            1214214.75
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




/*



Burgenkarte: https://ramosdorian.neocities.org/scripts_de.js






From: https://groups.google.com/g/geoadmin-api/c/tr3qnMGbt0E/m/L4xhAPK9AwAJ

initializeMap() {
      const vectorTileSource = new VectorTileSource({
        format: new MVT(),
        tileGrid: createXYZ({
          maxZoom: 14,
        }),
        url: 'https://vectortiles.geo.admin.ch/tiles/ch.swisstopo.leichte-basiskarte.vt/v2.0.0/{z}/{x}/{y}.pbf',
      })

      const vectorTileLayer = new VectorTileLayer({
        source: vectorTileSource,
      })

      const view = new View({
        projection: 'EPSG:3857',
        center: transform(
          [this.initialCoordinates.longitude, this.initialCoordinates.latitude],
          'EPSG:4326',
          'EPSG:3857'
        ),
        zoom: this.initialZoom,
        extent: [...fromLonLat([5, 45]), ...fromLonLat([12, 48])],
      })

      this.map = new Map({
        target: this.$refs['map-wrap'],
        layers: [vectorTileLayer],
        view,
      })
    },



*/

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