/*  
======================================

### Post-processing ###
Collection: 10
contact: ma.hirye@alumni.usp.br

=======================================
*/

var vers_postProcess = "v13"; 
print("vers_postProcess: " + vers_postProcess);

var vers_prob = "C10_probharm"; // "Col9incl2024_prob"; "C10_prob"; "C10_probharm";
var thres_prob = "15perc"; // "gte50"; "thres"; "15perc";
var vers_prob_thres_prob = vers_prob+"_"+thres_prob; // "Col9incl2024_prob_gte50"; "C10_prob_gte50"; "C10_probharm_gte50"; "Col9incl2024_prob_thres"; "C10_probharm_thres"; "C10_probharm_15perc";
print("vers_prob_thres_prob: "+ vers_prob_thres_prob);

// var step = "B-TF5yearsUniqueNot2024"; 
// var step = "C-TFbreakPoint";
var step = "D-SF"; 
// var step = "E-CheckTrans";
print("step: "+ step);

var vers = "C10_"+vers_postProcess+"_"+vers_prob+"_"+thres_prob+"_"+step; 
var output_path = "projects/ee-mburb-land-c10/assets/Testes/"+vers;
ee.data.createAsset({'type': 'ImageCollection'}, output_path);
print("output_path: "+ output_path);

var vers_spatialmask = "v9";
var thres_SF_hole = 280; // Vazio intraurbano 25ha (280 pixels) a 250ha [IBGE] => vazios intraurbanos são excluídos da AU | Col9 = 60 | v2, 3 e 4 = 280
var thres_SF_noise = 44; // 30 = 10 edificações (20x20m), separados por 50m (IBGE) = 27000m2| 8,5 pixels = 10 edificações (lote 15x20) + AV(15%) + Viario (35%) = 4615m2| Col9 = 5 | 11 = 9.900m2 aprox 1ha | 22 = 2ha | 44 = 4ha
print("vers_spatialmask: "+ vers_spatialmask,"thres_SF_hole: "+ thres_SF_hole,"thres_SF_noise: "+ thres_SF_noise);

// var description = "Probability version: "+vers_prob+" | Prob Thres: "+thres_prob+" | PostProcess: A - gapfill";
// var description = "Probability version: "+vers_prob+" | Prob Thres: "+thres_prob+" | PostProcess: A - gapfill; B - TF 5 years unique";
// var description = "Probability version: "+vers_prob+" | Prob Thres: "+thres_prob+" | PostProcess version: "+vers_postProcess+", A - gapfill; B - TF 5 years unique; C - TF break point";
var description = "Probability version: "+vers_prob+" | Prob Thres: "+thres_prob+" | PostProcess version: "+vers_postProcess+", A - gapfill; B1 - TF 5 years unique not applied in 2024; B2 - TF 5 years; C - TF break point; D - SF spatial mask (vers: "+vers_spatialmask+") + holes (thres=lt"+thres_SF_hole+", eightconnected=false) + noise (thres=lt"+thres_SF_noise+", eightconnected=false).";
// var description = "Probability version: "+vers_prob+" | Prob Thres: "+thres_prob+" | PostProcess version: "+vers_postProcess+", A - gapfill; B - TF 5 years unique; C - TF break point; D - SF spatial mask (vers: "+vers_spatialmask+") + holes (thres=lt"+thres_SF_hole+", eightconnected=false) + noise  (thres=lt"+thres_SF_noise+", eightconnected=false); E - Check Transitions.";

var escala = 30;

var useROI = false;
// var useROI = true;
print("useROI: "+useROI);



/****** Cartas e ROI ******/

var BR = ee.FeatureCollection("users/mahirye_usp/LimBR_2019");

var cartas250mil = ee.FeatureCollection("projects/ee-mburb-land-c10/assets/Inputs/Cartas_250mil");
// Map.addLayer(cartas250mil, {}, "cartas250mil", false);
Map.addLayer(cartas250mil.filter(ee.Filter.eq("grid_name_1mi", "SE-21")), {}, "cartas250mil in SE-21", false);
var list_cartas250mil_inSE21 = cartas250mil.filter(ee.Filter.eq("grid_name_1mi", "SE-21")).aggregate_array("grid_name");
print("list_cartas250mil_inSE21", list_cartas250mil_inSE21);

var list_cartas250mil_gte50 = ["SE-21-Y-B","SE-21-Y-D"]; // para gte50
var list_cartas250mil_perc15 = list_cartas250mil_inSE21.filter(ee.Filter.inList("item", list_cartas250mil_gte50).not()); // para perc15
var cartas = cartas250mil.filter(ee.Filter.inList("grid_name", list_cartas250mil_perc15));
Map.addLayer(cartas, {}, "cartas", false);
var list_cartas = list_cartas250mil_perc15;


var cartas1mi = ee.FeatureCollection("projects/ee-mburb/assets/BASES/Cartas_1mi_4326");
Map.addLayer(cartas1mi, {}, "cartas1mi", false);
var list_cartas1mi = cartas1mi.aggregate_array("grid_name").getInfo();
// print("list_cartas1mi", list_cartas1mi);
// list_cartas1mi = ["SB-25", "SC-20", "SC-23"]
// list_cartas1mi = ["NA-21"];
// list_cartas1mi = ["NA-21", "NB-22", "SA-21", "SC-24", "SD-22", "SF-23", "SH-22"];
// var cartas = cartas1mi.filter(ee.Filter.inList("grid_name", list_cartas1mi));
// Map.addLayer(cartas, {}, "cartas", false);
// var list_cartas = list_cartas1mi;
// print("list_cartas", list_cartas);

var muns = ee.FeatureCollection("projects/ee-mayhirye/assets/Bases_IBGE/BR_Municipios_2022"); //"NM_MUN" (String with space and accents) or "CD_MUN" (string)
Map.addLayer(muns, {}, "muns", false);


// var ROI = BR.geometry();
// var ROI = cartas.filter(ee.Filter.eq("grid_name", "SB-25-Y-C")).geometry(); //Campina Grande 
// var ROI = geometry;
// var ROI = CampinaGrande;
// var ROI = SaoPaulo;
// var ROI = Brasilia;
// var ROI = PortoTrombetas;
// var ROI = SJC;
// var ROI = SJCRevap;
// var ROI = Canudos;
// var ROI = muns.filter(ee.Filter.eq("NM_MUN", "Oriximiná")).bounds()
// var ROI = muns.filter(ee.Filter.eq("CD_MUN", "4300002"))
var ROI = cartas250mil.filter(ee.Filter.eq("grid_name", "SE-21-Y-B")); //Cartas Corumbá: SE-21-Y-B e SE-21-Y-D
// var ROI = teste_hole;

Map.addLayer(ROI, {}, "ROI", false);
Map.centerObject(ROI);

var cartas_hex_col = ee.FeatureCollection('projects/ee-mburb-land-c10/assets/Inputs/Cartas_250mil_Hex');
var cartas_hex_im = ee.Image(cartas_hex_col.map(function(feat){return feat.set('territory', 3)}).reduceToImage({properties:["territory"],reducer:ee.Reducer.first()}));



/****** Create years lists ******/

var years = ee.List.sequence(1985,2024,1).getInfo();
var classificationNames = years.map(function(year) {
  return ee.String('classification_').cat(ee.Number(year).format('%d'));
});
var years_excl2024 = ee.List.sequence(1985,2023,1).getInfo();
var years_excl1985 = ee.List.sequence(1986,2024,1).getInfo();



/****** Get SpatialMask ******/
var spatialMask = ee.Image("projects/ee-mburb-land-c10/assets/Testes/Mask_Spatial_"+vers_spatialmask).gte(1);
var spatialMask_v3 = ee.Image("projects/ee-mburb-land-c10/assets/Testes/Mask_Spatial_v3").gte(1);



/****** Get col9 ******/
var Palettes = require('users/mapbiomas/modules:Palettes.js');
var palette_C9 = Palettes.get('classification9');
// print(palette);

var im_C9 = ee.Image("projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1");
im_C9 = im_C9.addBands(ee.Image.constant(0).rename("classification_2024"));

// im_C9 = im_C9.eq(24).unmask()

// im_C9 = ee.Algorithms.If(useROI, im_C9.clip(ROI), im_C9)
if (useROI) {im_C9 = im_C9.clip(ROI);}
im_C9 = ee.Image(im_C9);

// Map over the band names to create an ImageCollection of single-band images
var im_C9_bandNames = im_C9.bandNames();
var col_C9 = ee.ImageCollection.fromImages(
  im_C9_bandNames.map(function(bandName) {
    bandName = ee.String(bandName);
    var singleBand = im_C9.select(bandName).rename("classification");
    return singleBand.set('bandName', bandName).set('year', ee.Number.parse(bandName.split('_').get(1)));
  })
);



/****** Functions ******/

 var getImYear_fromColYear = function(LIST_YEARS,ID) {
    var im = ee.Image([]);
    LIST_YEARS.getInfo().forEach(function(year){ 
      // var bandName = ee.ImageCollection(ID);
      var im_year = ee.ImageCollection(ID).filter(ee.Filter.eq('year',year)).mosaic();//.toUint8();//.aside(print);print(ID,FILTER1_VALUE);
      im = im.addBands(im_year);
    });
    var names = LIST_YEARS.getInfo();
    return im.rename(names.map(function(it) {var nom = ee.String("classification_"); return nom.cat(it.toString())}));
  };
  

  var getImYear_fromImCol_1filter = function(LIST_YEARS,ID,FILTER1,FILTER1_VALUE) {
    var im = ee.ImageCollection(ID).filter(ee.Filter.eq(FILTER1,FILTER1_VALUE)).toBands().toUint8();//.aside(print);print(ID,FILTER1_VALUE);
    var names = LIST_YEARS.getInfo();
    return im.rename(names.map(function(it) {var nom = ee.String("classification_"); return nom.cat(it.toString())}));
  };

// var getImYear_fromImCol_1filter_ByGrid = function(LIST_YEARS,ID,FILTER1_NAME,FILTER1_VALUE) {
//     var im = ee.ImageCollection(ID).filter(ee.Filter.eq(FILTER1_NAME,FILTER1_VALUE)).mosaic().toUint8();//aside(print);
//     var names = LIST_YEARS.getInfo();
//     return im.rename(names.map(function(it) {var nom = ee.String("classification_"); return nom.cat(it.toString())}));
//   };
  
  var getImYear_fromImYear = function(LIST_YEARS,IDp1,IDp2) {
    var im = ee.Image([]);
    LIST_YEARS.getInfo().forEach(function(year){  
      var im_year = ee.Image(IDp1+year+IDp2).toUint8();
      im = im.addBands(im_year);
    });
    var names = LIST_YEARS.getInfo();
    return im.rename(names.map(function(it) {var nom = ee.String("classification_"); return nom.cat(it.toString())}));
  };
  
    var getImYear_fromColYear_Str = function(LIST_YEARS,ID) {
    var im = ee.Image([]);
    LIST_YEARS.getInfo().forEach(function(year){ 
      var im_year = ee.ImageCollection(ID).filter(ee.Filter.eq('year',year.toString())).mosaic();//.toUint8();//.aside(print);print(ID,FILTER1_VALUE);
      im = im.addBands(im_year);
    });
    var names = LIST_YEARS.getInfo();
    return im.rename(names.map(function(it) {var nom = ee.String("classification_"); return nom.cat(it.toString())}));
  };
  
    var exp = function (IM, DESC, ID, REG, SC){
    Export.image.toAsset({
      image:  IM,
      description:  DESC,
      assetId:  ID,
      region:  REG,
      scale:  SC,
      maxPixels:  100000000000,
      pyramidingPolicy: {".default": "mode"},
    });
  };


var text = require('users/gena/packages:text');
var create_GIF = function(COL, VIZ, ROI) {
  // var rgbVis = COL.map(function(img) {return img.visualize(VIZ).clip(ROI).reproject({crs:'EPSG:4326', scale:30});});
  //To get year printed: region of interest
  var region = ROI.transform('EPSG:4326', 1);
  var scale = 30;
  var font_size = 24; 
  var pt = text.getLocation(region, 'left', '90%', '1%');
  var empty = ee.Image().byte();
  var Outline = empty.paint({
    featureCollection: region, 
    color: 1, 
    width: 1
  })//.visualize({palette: '000000', opacity: 0.6});
  
  //To get year printed: convert to an RGB visualization image; set line color to black.
  var rgbVis = COL.map(function(img) {
    var textVis = {fontSize:font_size, textColor: '000000', outlineColor: 'ffffff', outlineWidth:2, outlineOpacity:1};
    var label = text.draw(img.get("year"), pt, scale, textVis);
    return img.visualize(VIZ).clip(ROI).reproject({crs:'EPSG:4326', scale:30}).blend(label).blend(Outline);
  });

  var gifParams = {
    'region': ROI,
    'dimensions': 600,
    'crs': 'EPSG:4326',
    'framesPerSecond': 2
  };
  return rgbVis.getVideoThumbURL(gifParams);
};


var getTransitions = function(LISTYEARS, IMCOL, TRANS_BANDNAME){
  var imCol_transicao = ee.ImageCollection([]);
  LISTYEARS.forEach(function(year){
    // print("year: "+year);
    var year1 = ee.Number(year).add(1).getInfo();
    var im_year = IMCOL.filter(ee.Filter.eq("year", year)).first();
    var im_year1 = IMCOL.filter(ee.Filter.eq("year", year1)).first();
    var diff = im_year.neq(im_year1);
    imCol_transicao = imCol_transicao.merge(ee.ImageCollection(diff.rename("transition")));
    // Map.addLayer(im_au, {}, "im_au "+year, false);
  });
  return imCol_transicao.sum().rename(TRANS_BANDNAME);
};


var getTransitions_fromIm = function(LISTYEARS, IM, TRANS_BANDNAME){
  var imCol_transicao = ee.ImageCollection([]);
  LISTYEARS.forEach(function(year){
    // print("year: "+year);
    var year1 = ee.Number(year).add(1).getInfo();
    var im_year = IM.select("classification_"+year).first();
    var im_year1 = IM.select("classification_"+year1).first();
    var diff = im_year.neq(im_year1);
    imCol_transicao = imCol_transicao.merge(ee.ImageCollection(diff.rename("transition")));
    // Map.addLayer(im_au, {}, "im_au "+year, false);
  });
  return imCol_transicao.sum().rename(TRANS_BANDNAME);
};

var col_to_image = function(LISTYEARS, COL){
  var im_au_final = ee.Image([]);
  LISTYEARS.forEach(function(year){
    // print("year: "+year);
    var im_year = COL.filter(ee.Filter.eq("year", year)).first();
    im_au_final = im_au_final.addBands(im_year.rename("classification_"+year));
    // Map.addLayer(im_au, {}, "im_au "+year, false);
  });
  return im_au_final;
};



/****** Preparar Probabilidade ******/

/////////// Col9incl2024 - Prob
//var im_Prob = getImYear_fromImCol_1filter (ee.List.sequence(1985,2024,1),"projects/ee-mburb-land-c10/assets/Testes/A_Prob_v0","version", "0");
var im_Prob_1 = getImYear_fromImYear(ee.List.sequence(1985,2023,1),"projects/ee-mburb-land-c10/assets/Testes/A_Prob_v0/Class_", "_1");
var im_Prob_2024 = ee.Image("projects/ee-mburb-land-c10/assets/Testes/A_Prob_v0/Class_2024_0").rename("classification_2024");
var Col9incl2024_prob = im_Prob_1.addBands(im_Prob_2024);
//Map.addLayer(Col9incl2024_prob, {palette: ["white", "red"], bands:["classification_2024"]}, "Col9incl2024_prob 2024", false)


//////////////// Col9incl2024 - Prob + limiar gt5(50)
var Col9incl2024_prob_gte50 = Col9incl2024_prob.gte(50).unmask();
//Map.addLayer(Col9incl2024_prob_gte50.select("classification_2024").unmask(), {palette:["white", "red"]}, "Col9incl2024_prob_gte50 2024", false);


//////////////// Col9incl2024 - Prob + limiar thres
var ImCol_Col9incl2024_prob_thres = ee.ImageCollection('projects/ee-mburb-land-c10/assets/Testes/B_ProbLimiar_v0');
var Col9incl2024_prob_thres = getImYear_fromColYear (ee.List.sequence(1985,2024,1), ImCol_Col9incl2024_prob_thres, "version", "0").unmask();
// Map.addLayer(Col9incl2024_prob_thres.select("classification_2024").unmask(), {palette:["white", "red"]}, "Col9incl2024_prob_thres 2024", false);
// Map.addLayer(Col9incl2024_prob_thres.select("classification_2020").unmask(), {palette:["white", "red"]}, "Col9incl2024_prob_thres 2020", false);


/////////// Col10 v1 Raw - Prob
var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/prob';
var asset1 = 'projects/ee-ers/assets/mapbiomas/col10/prob'; // asset pessoal usado apenas para os anos finais da exportaçao (p/ evitar exceder o limite do workspace)
var col1 = ee.ImageCollection(asset).filter(ee.Filter.lte('year', 2020));// nao mudar este ano 
var col2 = ee.ImageCollection(asset1);
var imCol_prob_c10 = col1.merge(col2).sort('year');
var years_prob_10 = imCol_prob_c10.aggregate_array("year").distinct();
// print("years_prob_10", years_prob_10);
var C10_prob = getImYear_fromColYear (years_prob_10, imCol_prob_c10, "version", "1").unmask();
// Map.addLayer(C10_prob.select("classification_2024").selfMask(), {min:0, max:100, opacity:1, palette:["white", "magenta"]}, "C10_prob 2024", false);


/////////// Col10 v1 Raw - Prob + limiar gte(50)
var C10_prob_gte50 = C10_prob.gte(50).unmask();
//Map.addLayer(C10_prob_gte50.select("classification_2024").unmask(), {palette:["white", "magenta"]}, "C10_prob_gte50 2024", false);


/////////// Col10 v1 Harmonizado - Prob
var probMean = ee.ImageCollection("projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean");
var gridList = ['NA','NB','SA','SB','SC','SD','SE','SF','SG','SH','SI',];
var version = 1;
var C10_probharm = ee.ImageCollection(gridList.map(
  function (grid){
    var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean/classification_'+ grid + '_v'+ version;
    return ee.Image(asset);
  })).mosaic();
//Map.addLayer(C10_probharm.select("classification_2024").selfMask(), {min:0, max:100, opacity:1, palette:["white", "orange"]}, "C10_probharm 2024", false);


/////////// Col10 v1 Harmonizado - Prob + limiar gte(50)
var C10_probharm_gte50 = C10_probharm.gte(50).unmask();
//Map.addLayer(C10_probharm_gte50.select("classification_2024").selfMask(), {min:0, max:1, opacity:1, palette:["white", "orange"]}, "C10_probharm_gte50 2024", false);


/////////// Col10 v1 Harmonizado - Prob + limiar médios (na série temporal) 
var im_C10ProbHarm_lim = ee.Image("projects/ee-ers/assets/mapbiomas/col10/thresholdMeanByCartaImg");


///////////// Col10 v1 Harmonizado - Prob + limiar por ano e carta aplicados
var meanThresholdsAndPercentiles = ee.Image("projects/ee-ers/assets/mapbiomas/col10/thresholdMeanByCartaImg");

var C10_probharm_thres = C10_probharm.gte(meanThresholdsAndPercentiles.select('threshold'));
//Map.addLayer(imgMasked, {min:0, max:1}, 'img com limiares médios ' + year + ' tipo:' + type);
//Map.addLayer(C10_probharm_thres.select('classification_2024'), {}, 'C10_probharm_thres 2024', false);

var C10_probharm_15perc = C10_probharm.gte(meanThresholdsAndPercentiles.select('percentil'));
//print(C10_prob_15perc);
//Map.addLayer(C10_probharm_15perc.select('classification_2024'), {}, 'C10_probharm_15perc 2024', false);



/****** Definir Probabilidade ******/
var dict_probs = ee.Dictionary({
  "Col9incl2024_prob_gte50": [Col9incl2024_prob, Col9incl2024_prob_gte50],
  "Col9incl2024_prob_thres": [Col9incl2024_prob, Col9incl2024_prob_thres],
  "C10_prob_gte50": [C10_prob, C10_prob_gte50],
  "C10_probharm_gte50": [C10_probharm, C10_probharm_gte50],
  "C10_probharm_thres": [C10_probharm, C10_probharm_thres],
  "C10_probharm_15perc": [C10_probharm, C10_probharm_15perc],
});

// Cast the retrieved value to an ee.List and access individual elements from the list
var im_Prob = ee.Image(ee.List(dict_probs.get(vers_prob_thres_prob)).get(0));
var im_ProbLim = ee.Image(ee.List(dict_probs.get(vers_prob_thres_prob)).get(1));
// Map.addLayer(im_Prob, {}, "im_Prob", false);
// Map.addLayer(im_ProbLim, {}, "im_ProbLim", false);
// print("im_Prob", im_Prob);
// print("im_ProbLim", im_ProbLim);

// var im_Prob = Col9incl2024_prob;
// var im_Prob = C10_prob;
// var im_Prob = C10_probharm;
// Map.addLayer(im_Prob.select('classification_2024'), {min:0, max:100, opacity:1, palette:["white", "black"]}, "im_Prob 2024", false);

// var im_ProbLim = Col9incl2024_prob_gte50;
// var im_ProbLim = C10_prob_gte50;
// var im_ProbLim = C10_probharm_gte50;
// var im_ProbLim = C10_probharm_thres;
// var im_ProbLim = C10_probharm_15perc;
// Map.addLayer(im_ProbLim.select('classification_2024'), {min:0, max:1, opacity:1, palette:["white", "black"]}, "im_ProbLim 2024", false);

if (useROI) {im_ProbLim = im_ProbLim.clip(ROI);}
im_ProbLim = ee.Image(im_ProbLim);
// Map.addLayer(im_ProbLim, {}, "im_ProbLim", false);

// Map over the band names to create an ImageCollection of single-band images
var im_ProbLim_bandNames = im_ProbLim.bandNames();
// print(im_ProbLim_bandNames)
var imCol_ProbLim = ee.ImageCollection.fromImages(
  im_ProbLim_bandNames.map(function(bandName) {
    bandName = ee.String(bandName);
    var singleBand = im_ProbLim.select([bandName]).rename("classification").set('bandName', bandName);
    return singleBand;
  })
);

Map.addLayer(imCol_ProbLim.filter(ee.Filter.eq("bandName", "classification_1994")), {}, "imCol_ProbLim", false);



/****** Dados derivados ******/

///////// Im Prob noData
var im_Prob_noData = im_Prob.gte(0).unmask().eq(0);
// Map.addLayer(im_Prob_noData, {min:0, max:1, palette: ["white", "blue"], bands:["classification_1985"]}, "im_Prob_noData", false);

/////////// Col Prob Limiar cTimeStamp
var imCol_ProbLim_cStamp = imCol_ProbLim.map(function(im){
  var ano = ee.Number.parse(ee.String(im.get("bandName")).slice(-4));
  var middleDate = ee.Date.fromYMD(ano, 8, 1);
  return im
    .rename(['class'])
    .set('system:time_start', middleDate.millis())
    .set('year', ano);
});  
// print("imCol_ProbLim_cStamp", imCol_ProbLim_cStamp);
// Map.addLayer(imCol_ProbLim_cStamp, {min:0, max:1, palette: ["white", "red"]}, "imCol_ProbLim_cStamp", false);

/////////// Col Prob Limiar cTimeStamp com legenda de trabalho completa
var non_au = ee.Image.constant(0);
var au = ee.Image.constant(1);
var noData = ee.Image.constant(2);

var imCol_ProbLim_cStamp_completo = ee.ImageCollection([]);

years.forEach(function(year){
  var im_noData_year = im_Prob_noData.select("classification_"+year);
  var col_Problimiar_cStamp_year = imCol_ProbLim_cStamp.filter(ee.Filter.eq("year", year))
    .first();
  col_Problimiar_cStamp_year = col_Problimiar_cStamp_year
    .where(col_Problimiar_cStamp_year.eq(1),au)
    // .where(col_Problimiar_cStamp_year.eq(1),veg);
  col_Problimiar_cStamp_year = col_Problimiar_cStamp_year
    .unmask()
    .where(im_noData_year.eq(1),noData);
  // col_C9Problimiar_cStamp_year = col_C9Problimiar_cStamp_year
  //   .where(im_C9IntV24.eq(1),noData);
  imCol_ProbLim_cStamp_completo = imCol_ProbLim_cStamp_completo.merge(col_Problimiar_cStamp_year);
});
// Map.addLayer(imCol_ProbLim_cStamp_completo, {min:0, max:3, palette: ["white", "green", "red", "blue"]}, "imCol_ProbLim_cStamp_completo", false);
// Map.addLayer(imCol_ProbLim_cStamp_completo.filter(ee.Filter.eq("year", 1985)), {min:0, max:3, palette: ["white", "green", "red", "blue"]}, "col_C9Problimiar_cStamp_completo 1985", true);

var im_ProbLim_cStamp_completo = col_to_image(years, imCol_ProbLim_cStamp_completo);



/****** FILTRO 1 - GapFill ******/

// var GapFill = function(LIST_YEARS, VAL1, VAL2, VAL3, VAL4, COL_IN){
var GapFill = function(LIST_YEARS, VAL1, VAL2, VAL3, COL_IN){
  var COL = COL_IN;
  LIST_YEARS.forEach(function(year){
    // print("year: "+year);
    var veg_year = COL.filter(ee.Filter.eq("year", year)).first();
    var year1 = ee.Number(year).add(VAL1).getInfo();
    var year2 = ee.Number(year).add(VAL2).getInfo();
    var year3 = ee.Number(year).add(VAL3).getInfo();
    // var year4 = ee.Number(year).add(VAL4).getInfo();
    
    var col_years = ee.ImageCollection([
      veg_year,
      // COL.filter(ee.Filter.eq("year", year1)).first().neq(2),
      // COL.filter(ee.Filter.eq("year", year2)).first().neq(2),
      // COL.filter(ee.Filter.eq("year", year3)).first().neq(2),
      COL.filter(ee.Filter.eq("year", year1)).first(),
      COL.filter(ee.Filter.eq("year", year2)).first(),
      COL.filter(ee.Filter.eq("year", year3)).first(),
      // COL.filter(ee.Filter.eq("year", year4)).first().neq(2),
    ]);
    // Map.addLayer(col_years, {}, "col_years "+year, true);
    // print("col_years "+year, col_years);
    
    var col_years_mode = col_years.reduce(ee.Reducer.mode());
    var veg_year_filt = veg_year.where(veg_year.eq(2),col_years_mode.remap([0,1,2],[0,1,0]));
    // Map.addLayer(veg_year_filt, {min:0, max:3, palette: ["white", "green", "red", "blue"]}, "veg_year_filt "+year, true);
    
    COL = ee.ImageCollection(COL).filter(ee.Filter.neq("year", year)).merge(ee.ImageCollection([veg_year_filt]));
    // print("COL "+year, COL);
  });
  
  return COL;
};

var list_cols = ee.List([]);

var GF_2024 = GapFill ([2024], -1, -2, -3, imCol_ProbLim_cStamp_completo);
var GF_2024e23 = GapFill ([2023], 1, -1, -2, GF_2024);
var GF_2024e23eMiddle = GapFill (ee.List.sequence(1986,2022,1).reverse().getInfo(), 1, 2, -1, GF_2024e23);
var col_GF = GapFill ([1985], 1, 2, 3, GF_2024e23eMiddle);
// col_GF = col_GF.sort('year');
// print("col_GF", col_GF);
// Map.addLayer(col_GF, {}, "col_GF", false);


var im_GF = col_to_image(years, col_GF);



/****** GET IMAGE OF A-GapFill ******/
// var im_GF = ee.ImageCollection("projects/ee-mburb-land-c10/assets/Testes/C10_v2_"+vers_prob+"_"+thres_prob+"_A-GapFill").mosaic();
// if (useROI) {im_GF = im_GF.clip(ROI);}
// im_GF = ee.Image(im_GF);

// // Map over the band names to create an ImageCollection of single-band images
// var im_GF_bandNames = im_GF.bandNames();
// var col_GF = ee.ImageCollection.fromImages(
//   im_GF_bandNames.map(function(bandName) {
//     bandName = ee.String(bandName);
//     var singleBand = im_GF.select(bandName).rename("classification");
//     return singleBand.set('bandName', bandName).set('year', ee.Number.parse(bandName.split('_').get(1)));
//   })
// );



/****** FILTRO 2 - Filtro Temporal - B-TF5yearsUnique ******/

var TempFilter_wMask_5yearsunique = function(LIST_YEARS, VAL1, VAL2, VAL3, VAL4, COL_IN) {
  var col_out = COL_IN.filter(ee.Filter.inList('year', LIST_YEARS).not());

  var col_years = LIST_YEARS.map(function(year) {
    var im_year = COL_IN.filter(ee.Filter.eq('year', year)).first();
    var im_years_sum = ee.ImageCollection(ee.List([
      im_year,
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL1))).first(),
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL2))).first(),
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL3))).first(),
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL4))).first()
    ])).sum();
    var im_mask5yearsunique = im_year.multiply(im_years_sum.eq(1).unmask());
    im_year = im_year 
      .where(im_mask5yearsunique.eq(1), 0)
      .set('year', year);
    return im_year;
  });

  // Retorna a coleção com as imagens transformadas e a coleção original filtrada
  return col_out.merge(ee.ImageCollection(col_years));
};
// Chama a função com os anos desejados
var TF_5yearsunique_2024 = col_GF;
var TF_5yearsunique_2023 = TempFilter_wMask_5yearsunique([2023], 1, -1, -2, -3, TF_5yearsunique_2024);
var TF_5yearsunique_Middle = TempFilter_wMask_5yearsunique(ee.List.sequence(1986, 2022, 1).reverse().getInfo(), 2, 1, -1, -2, TF_5yearsunique_2023);
var TF_5yearsunique_1986 = TempFilter_wMask_5yearsunique([1986], -1, 1, 2, 3, TF_5yearsunique_Middle);
var col_TF_5yearsunique = TempFilter_wMask_5yearsunique([1985], 1, 2, 3, 4, TF_5yearsunique_1986);

col_TF_5yearsunique = col_TF_5yearsunique.sort('year');


var im_TF_5yearsunique = col_to_image(years, col_TF_5yearsunique);



/****** GET IMAGE OF B-TF5yearsUnique ******/
// var im_TF_5yearsunique = ee.ImageCollection("projects/ee-mburb-land-c10/assets/Testes/C10_"+vers_postProcess+"_"+vers_prob+"_"+thres_prob+"_B-TF5yearsUnique").mosaic();
// if (useROI) {im_TF_5yearsunique = im_TF_5yearsunique.clip(ROI);}
// im_TF_5yearsunique = ee.Image(im_TF_5yearsunique);

// // Map over the band names to create an ImageCollection of single-band images
// var im_TF_5yearsunique_bandNames = im_TF_5yearsunique.bandNames();
// var col_TF_5yearsunique = ee.ImageCollection.fromImages(
//   im_TF_5yearsunique_bandNames.map(function(bandName) {
//     bandName = ee.String(bandName);
//     var singleBand = im_TF_5yearsunique.select(bandName).rename("classification");
//     return singleBand.set('bandName', bandName).set('year', ee.Number.parse(bandName.split('_').get(1)));
//   })
// );



/****** FILTRO 2 - Filtro Temporal - C-TFbreakPoint ******/

col_TF_5yearsunique = col_TF_5yearsunique.map(function(im){
  var ano = im.get("year");
  var middleDate = ee.Date.fromYMD(ano, 8, 1);
  return im
    .set('system:time_start', middleDate.millis())
});
  
//Valid Transitions (nurb to urb) - 1o ano, apenas repetir imagem; rodar a partir do 2o ano
var getTransitions_valid = function(LISTYEARS, COL_IN){
  var col_transicao = ee.ImageCollection(
    LISTYEARS.map(function(year) {
      // print("year: "+year);
      var year_prev = ee.Number(year).subtract(1).getInfo();
      var im_year = ee.Image(COL_IN.filter(ee.Filter.eq("year", year)).first());
      var im_year_prev = ee.Image(COL_IN.filter(ee.Filter.eq("year", year_prev)).first());
      var diff = im_year.subtract(im_year_prev);
      var im_year_trans = im_year.remap([0,1], [0,0]).where(diff.eq(1), 1)
        .set("year", year)
        .rename(["transvalid"]);
      return im_year_trans;
    })
  );
  return col_transicao;
};


//Get valid transitions (nurb to urb)
var im_1985_transValid = col_TF_5yearsunique.filter(ee.Filter.eq("year", 1985)).first().rename(["transvalid"]);
var col_transicaoValid = ee.ImageCollection(im_1985_transValid).merge(getTransitions_valid(years_excl1985, col_TF_5yearsunique, "transValid"));
// print("col_transicaoValid", col_transicaoValid);


//Sum Urb and NUrb in all years
var sumUrb = col_TF_5yearsunique.reduce(ee.Reducer.sum());
var sumNUrb = col_TF_5yearsunique.map(function(im) {return im.remap([0,1],[1,0])}).reduce(ee.Reducer.sum());


//Get number of Urb to the end by year
var getUrbToEnd = function(LISTYEARS, IMCOL, MASK) {
  var imCol_UrbToEnd = ee.ImageCollection(
    LISTYEARS.map(function(year) {
      year = ee.Number(year);
      var im_mask_year = MASK.filter(ee.Filter.eq('year', year)).first();
      var imCol_GTEyear = IMCOL.filter(ee.Filter.gte('year', year));
      var im_sumUrb = imCol_GTEyear.reduce(ee.Reducer.sum());
      var im_sumUrb_valid = im_mask_year.remap([0,1], [0,0]).where(im_mask_year.eq(1),im_sumUrb);
    return im_sumUrb_valid.set('year', year).rename("classification");
    })
  );
  return imCol_UrbToEnd;
};

var col_UrbToEnd = getUrbToEnd(years, col_TF_5yearsunique, col_transicaoValid);



//Identify breaks
var getBreakpoints = function(col_transicaoValid, col_UrbToEnd, finalYear) {
  return col_transicaoValid.map(function(imgTransicaoValid) {
    var year = ee.Number(imgTransicaoValid.get('year'));
    var imgUrbToEnd = col_UrbToEnd.filter(ee.Filter.eq('year', year)).first();

    // Number of years remaining until the final year
    var yearsRemaining = ee.Number(finalYear).subtract(year).add(1);

    // Conditions:
    var condition_i = imgTransicaoValid.eq(1);                     // Valid transition == 1
    var condition_ii = imgUrbToEnd.gte(yearsRemaining.divide(2));  // Urban years >= half of remaining years
    var condition_iii = imgUrbToEnd.gte(1);                        // Urban years > 1

    // Combine all conditions
    var finalMask = condition_i.and(condition_ii).and(condition_iii);

    // Generate final masked image with properties
    var finalImage = finalMask.updateMask(finalMask)
      .set('year', year)
      .set('system:time_start', imgTransicaoValid.get('system:time_start'));

    return finalImage.unmask(0);
  });
};

var col_Breaks = getBreakpoints(col_transicaoValid, col_UrbToEnd, 2024);

//Ordenar a coleção por ano
var list_Breaks = col_Breaks.sort('year').toList(col_Breaks.size());


// Function to accumulate from 1st break
var accumulateForward = function(imgList) {
  var size = imgList.size();
  // Inicializa lista de saída como uma lista de objetos {image: img, accumulated: acc}
  var first = ee.Image(imgList.get(0));
  var init = {
    list: ee.List([first]),
    acc: first
  };
  // Função de iteração
  var iterate = ee.List.sequence(1, size.subtract(1)).iterate(function(i, state) {
    state = ee.Dictionary(state);
    var acc = ee.Image(state.get('acc'));
    var list = ee.List(state.get('list'));
    // Pega a imagem atual e desmascara para 0
    var img = ee.Image(imgList.get(i));
    // Atualiza acumulador: se algum pixel já foi 1, permanece 1
    var newAcc = acc.max(img);
    // Adiciona nova imagem acumulada à lista
    return ee.Dictionary({
      list: list.add(
        newAcc.set('year', img.get('year'))
              .set('system:time_start', img.get('system:time_start'))
      ),
      acc: newAcc
    });
  }, init);
  // return ee.ImageCollection(ee.Dictionary(iterate).get('list'));
  return ee.ImageCollection(ee.List(ee.Dictionary(iterate).get('list')));
};

var col_TF = accumulateForward(list_Breaks);


var im_TF = col_to_image(years, col_TF);



/****** GET IMAGE OF C-TFbreakPoint ******/
// var im_TF = ee.ImageCollection("projects/ee-mburb-land-c10/assets/Testes/C10_"+vers_postProcess+"_"+vers_prob+"_"+thres_prob+"_C-TFbreakPoint").mosaic();
// if (useROI) {im_TF = im_TF.clip(ROI);}
// im_TF = ee.Image(im_TF);

// // Map over the band names to create an ImageCollection of single-band images
// var im_TF_bandNames = im_TF.bandNames();
// var col_TF = ee.ImageCollection.fromImages(
//   im_TF_bandNames.map(function(bandName) {
//     bandName = ee.String(bandName);
//     var singleBand = im_TF.select(bandName).rename("classification");
//     return singleBand.set('bandName', bandName).set('year', ee.Number.parse(bandName.split('_').get(1)));
//   })
// );



/****** FILTRO 3 - Filtro Espacial ******/

////****** Filtro Espacial 1
// Elimina pixels fora da máscara
var all_years = ee.List.sequence(1985,2024,1).getInfo();
// var all_years = [2024];
var list_au_SF = ee.List([]);
// var list_au_SF = ee.Image();

  all_years.forEach(function(year){
    // print("year: "+year);
    
    // var au_year = col_GF.filter(ee.Filter.eq("year", year)).first();
    var au_year = col_TF.filter(ee.Filter.eq("year", year)).first();
    
    var mask_SF = au_year.multiply(spatialMask);
    
    // Map.addLayer(mask_SF.reproject({crs:'EPSG:4326', scale:30}).selfMask(), {min:0, max:10}, "mask_SF "+year, true);
    // print("mask_SF", mask_SF);
  
    list_au_SF = list_au_SF.add(mask_SF.set("year", year).set('system:time_start', ee.Date.fromYMD(year, 8, 1).millis())); 
  
  });

var col_au_SF_1 = ee.ImageCollection(list_au_SF);
// print("col_au_SF_1", col_au_SF_1);



//****** Filtro Espacial 2
// Elimina holes e noises
// var all_years = ee.List.sequence(1985,2024,1).getInfo();
// var all_years = [2024];
var list_au_SF = ee.List([]);
// var im_veg_SF = ee.Image();

  all_years.forEach(function(year){
    // print("year: "+year);
    
    var au_year = col_au_SF_1.filter(ee.Filter.eq("year", year)).first();
    // Map.addLayer(au_year.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:1, pallete:["white", "red"]}, "au_year "+year, true);
    
    var count_hole = au_year
      .eq(0).selfMask()
      .connectedPixelCount({maxSize:thres_SF_hole+1, eightConnected:false,});
    // Map.addLayer(count_hole.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:thres_SF_hole+2, pallete:["white", "green"]}, "count_hole "+year, true);
    // print("count_hole", count_hole);
    
    var im_au_year_SF_NoHole = au_year.where(count_hole.lt(thres_SF_hole), 1).reproject({crs:'EPSG:4326', scale:30});
    // Map.addLayer(im_au_year_SF_NoHole.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:1, pallete:["white", "orange"]}, "im_au_year_SF_NoHole "+year, true);
    // print("im_au_year_SF_NoHole", im_au_year_SF_NoHole);
      
    var count_noise = im_au_year_SF_NoHole
      .eq(1).selfMask()
      .connectedPixelCount({maxSize:thres_SF_noise+1, eightConnected:false,});
    // Map.addLayer(count_noise.lt(thres_SF_noise).reproject({crs:'EPSG:4326', scale:30}), {min:0, max:1, pallete:["white", "green"]}, "count_noise "+year, true);
    // print("count_noise", count_noise);
    
    var im_au_year_SF = im_au_year_SF_NoHole.where(count_noise.lt(thres_SF_noise), 0).reproject({crs:'EPSG:4326', scale:30});
    // Map.addLayer(im_au_year_SF.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:1, pallete:["white", "2800ff"]}, "im_au_year_SF "+year, true);
    
    list_au_SF = list_au_SF.add(im_au_year_SF.set("year", year).set('system:time_start', ee.Date.fromYMD(year, 8, 1).millis()).set('bandName', "classification_"+year)); 
    // list_au_SF = im_veg_SF.add(im_au_year_SF.rename("classification_"+year));
    
  });

var col_au_SF_2 = ee.ImageCollection(list_au_SF);

var im_au_SF_2 = col_au_SF_2.toBands();
// Mapeia para remover o índice inicial
var bandNames_au_SF_2 = col_au_SF_2.aggregate_array('bandName');
var newBandNames_au_SF_2 = bandNames_au_SF_2.map(function(name) {
  var parts = ee.String(name).split('_');
  return ee.String('classification_').cat(ee.List(parts).get(-1));
});
im_au_SF_2 = im_au_SF_2.rename(newBandNames_au_SF_2);


/****** GET IMAGE OF Filtro Espacial 2 - D-SF ******/
/*
var im_au_SF_2 = ee.ImageCollection("projects/ee-mburb-land-c10/assets/Testes/C10_"+vers_postProcess+"_"+vers_prob+"_"+thres_prob+"_D-SF").mosaic();
if (useROI) {im_au_SF_2 = im_au_SF_2.clip(ROI);}
im_au_SF_2 = ee.Image(im_au_SF_2);

//Map over the band names to create an ImageCollection of single-band images
var im_au_SF_2_bandNames = im_au_SF_2.bandNames();
var col_au_SF_2 = ee.ImageCollection.fromImages(
  im_au_SF_2_bandNames.map(function(bandName) {
    bandName = ee.String(bandName);
    var singleBand = im_au_SF_2.select(bandName).rename("classification");
    return singleBand.set('bandName', bandName).set('year', ee.Number.parse(bandName.split('_').get(1)));
  })
);
*/


/****** Gerar banda de transições SF2******/
// var im_transicao_ProbLim = getTransitions(years_excl2024, imCol_ProbLim_cStamp_completo, "trans_ProbLim");
// var im_transicao_SF2 = getTransitions(years_excl2024, col_au_SF_2, "trans_SF2");
// // var im_transicao_SF2 = getTransitions_fromIm(years_excl2024, im_au_SF_2, "trans_SF2");
// // print("im_transicao", im_transicao);
// // Map.addLayer(im_transicao_SF2, {min:0, max:39, palette:["white", "magenta", "blue"]}, "im_transicao_SF2", false);



/****** GET IMAGE OF transições SF2 - E-CheckTrans ******/
// var im_transicao_SF2 = ee.ImageCollection("projects/ee-mburb-land-c10/assets/Testes/C10_"+vers_postProcess+"_"+vers_prob+"_"+thres_prob+"_E-CheckTrans").mosaic();
// if (useROI) {im_transicao_SF2 = im_transicao_SF2.clip(ROI);}
// im_transicao_SF2 = ee.Image(im_transicao_SF2);

// // Map over the band names to create an ImageCollection of single-band images
// var im_transicao_SF2_bandNames = im_transicao_SF2.bandNames();
// var col_transicao_SF2 = ee.ImageCollection.fromImages(
//   im_transicao_SF2_bandNames.map(function(bandName) {
//     bandName = ee.String(bandName);
//     var singleBand = im_transicao_SF2.select(bandName).rename("classification");
//     return singleBand.set('bandName', bandName).set('year', ee.Number.parse(bandName.split('_').get(1)));
//   })
// );



/****** Exportar Im ******/

//var im_au_final = im_ProbLim_cStamp_completo;
// var im_au_final = im_GF;
// var im_au_final = im_TF_5yearsunique;
// var im_au_final = im_TF;
var im_au_final = im_au_SF_2;
// var im_au_final = im_transicao_SF2;
// var im_au_final = im_transicao_ProbLim;

im_au_final = im_au_final
    .set("collection_version", "Col10")
    .set("description", description)
    .set("version", vers)
    .updateMask(cartas_hex_im.eq(3))
    .unmask(0);

// print("im_au_final", im_au_final);
// Map.addLayer(im_au_final, {bands: "classification_2024", min:0, max:1, palette: ["white", "red"]}, "im_au_final", true);


  list_cartas.forEach(function(grid){
  // list_cartas1mi.forEach(function(grid){
    // print(">>>>>>>>>>" + grid + "<<<<<<<<<<");
    var carta = cartas.filter(ee.Filter.eq("grid_name", grid));

    im_au_final = im_au_final.set("grid_name", grid);
    exp (im_au_final, vers+"_"+grid, output_path+"/"+grid, carta.geometry(), escala);
    // Map.addLayer(im_au_final, {}, "im_au_final "+grid), false;
  });
/**/
