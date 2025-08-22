// gridlist
// defined here https://code.earthengine.google.com/3434c6661d38448b91822bb71b888aa7?noload=true
var gridList = [
  "NA-19-Z-B",
  "NA-19-Z-D",
  "NA-19-Z-C",
  "NA-19-Z-A",
  "NA-19-Y-D",
  "NA-19-Y-B",
  "NA-20-V-A",
  "NA-20-V-D",
  "NA-20-V-B",
  "NA-20-Y-D",
  "NA-20-Y-C",
  "NA-20-Y-A",
  "NA-20-Z-D",
  "NA-20-Z-B",
  "NA-20-X-B",
  "NA-20-X-A",
  "NA-20-X-C",
  "NA-20-Z-A",
  "NA-20-X-D",
  "NA-21-Z-C",
  "NA-21-Z-A",
  "NA-21-X-C",
  "NA-21-Y-D",
  "NA-21-Y-C",
  "NA-21-Y-A",
  "NA-21-V-C",
  "NA-21-V-A",
  "NA-21-Z-B",
  "NA-21-X-D",
  "NA-21-Z-D",
  "NA-22-V-B",
  "NA-22-X-C",
  "NA-22-Z-A",
  "NA-22-Z-C",
  "NA-22-Y-D",
  "NA-22-Y-C",
  "NA-22-Y-B",
  "NA-22-Y-A",
  "NA-22-V-D",
  "NB-20-Y-D",
  "NB-20-Y-C",
  "NB-20-Z-D",
  "NB-20-Z-B",
  "NB-20-Z-C",
  "NB-21-Y-C",
  "NB-22-Y-D",
  "SA-19-X-B",
  "SA-19-X-A",
  "SA-19-V-D",
  "SA-19-Y-B",
  "SA-19-Y-D",
  "SA-19-Z-A",
  "SA-19-Z-C",
  "SA-19-Z-D",
  "SA-19-Z-B",
  "SA-19-X-D",
  "SA-20-V-B",
  "SA-20-V-A",
  "SA-20-V-C",
  "SA-20-Y-A",
  "SA-20-V-D",
  "SA-20-Y-D",
  "SA-20-Y-C",
  "SA-20-X-B",
  "SA-20-X-A",
  "SA-20-X-C",
  "SA-20-X-D",
  "SA-20-Z-A",
  "SA-20-Z-B",
  "SA-20-Z-C",
  "SA-20-Z-D",
  "SA-21-X-A",
  "SA-21-V-B",
  "SA-21-V-A",
  "SA-21-Z-C",
  "SA-21-Z-A",
  "SA-21-Y-D",
  "SA-21-Y-B",
  "SA-21-Y-A",
  "SA-21-V-D",
  "SA-21-V-C",
  "SA-21-X-C",
  "SA-21-Z-D",
  "SA-21-Z-B",
  "SA-21-X-D",
  "SA-21-Y-C",
  "SA-22-X-B",
  "SA-22-X-A",
  "SA-22-V-B",
  "SA-22-V-A",
  "SA-22-V-C",
  "SA-22-Y-C",
  "SA-22-Y-A",
  "SA-22-V-D",
  "SA-22-Z-A",
  "SA-22-Z-C",
  "SA-22-X-C",
  "SA-22-X-D",
  "SA-22-Z-D",
  "SA-22-Z-B",
  "SA-22-Y-B",
  "SA-22-Y-D",
  "SA-23-V-A",
  "SA-23-V-C",
  "SA-23-Y-A",
  "SA-23-Y-C",
  "SA-23-Y-D",
  "SA-23-Z-C",
  "SA-23-Z-D",
  "SA-23-Z-B",
  "SA-23-X-C",
  "SA-23-Z-A",
  "SA-23-Y-B",
  "SA-23-V-D",
  "SA-23-V-B",
  "SA-24-Y-C",
  "SA-24-Y-D",
  "SA-24-Z-C",
  "SA-24-Y-B",
  "SA-24-Y-A",
  "SB-18-Z-B",
  "SB-18-X-D",
  "SB-18-Z-D",
  "SB-19-V-B",
  "SB-19-V-C",
  "SB-19-V-A",
  "SB-19-Z-C",
  "SB-19-Y-D",
  "SB-19-Z-D",
  "SB-19-Z-A",
  "SB-19-X-D",
  "SB-19-X-B",
  "SB-19-Y-B",
  "SB-19-Y-C",
  "SB-19-Y-A",
  "SB-20-V-B",
  "SB-20-V-A",
  "SB-20-V-D",
  "SB-20-Y-B",
  "SB-20-Y-D",
  "SB-20-Y-C",
  "SB-20-X-A",
  "SB-20-X-B",
  "SB-20-Z-A",
  "SB-20-Z-C",
  "SB-20-Z-D",
  "SB-20-Z-B",
  "SB-20-X-C",
  "SB-20-X-D",
  "SB-21-V-A",
  "SB-21-V-D",
  "SB-21-Y-A",
  "SB-21-Y-B",
  "SB-21-Y-C",
  "SB-21-Y-D",
  "SB-21-Z-A",
  "SB-21-Z-C",
  "SB-21-X-C",
  "SB-21-X-A",
  "SB-21-Z-D",
  "SB-21-Z-B",
  "SB-21-X-D",
  "SB-21-X-B",
  "SB-22-V-A",
  "SB-22-V-B",
  "SB-22-X-A",
  "SB-22-X-B",
  "SB-22-X-C",
  "SB-22-X-D",
  "SB-22-Z-D",
  "SB-22-Z-B",
  "SB-22-Z-A",
  
  // set 2
  "SB-22-Z-C",
  "SB-22-Y-D",
  "SB-22-Y-C",
  "SB-22-Y-B",
  "SB-22-Y-A",
  "SB-22-V-D",
  "SB-22-V-C",
  "SB-23-V-C",
  "SB-23-V-A",
  "SB-23-Y-A",
  "SB-23-Y-C",
  "SB-23-Z-D",
  "SB-23-Z-C",
  "SB-23-Y-D",
  "SB-23-Y-B",
  "SB-23-Z-A",
  "SB-23-Z-B",
  "SB-23-X-D",
  "SB-23-X-C",
  "SB-23-V-D",
  "SB-23-X-A",
  "SB-23-V-B",
  "SB-23-X-B",
  "SB-24-Y-C",
  "SB-24-V-C",
  "SB-24-V-A",
  "SB-24-V-B",
  "SB-24-V-D",
  "SB-24-Y-A",
  "SB-24-Y-B",
  "SB-24-Y-D",
  "SB-24-Z-C",
  "SB-24-Z-B",
  "SB-24-Z-D",
  "SB-24-X-B",
  "SB-24-X-A",
  "SB-24-X-C",
  "SB-24-Z-A",
  "SB-24-X-D",
  "SB-25-V-C",
  "SB-25-Y-A",
  "SB-25-Y-C",
  "SC-18-X-B",
  "SC-18-X-D",
  "SC-19-Y-D",
  "SC-19-Y-B",
  "SC-19-V-D",
  "SC-19-Z-A",
  "SC-19-X-C",
  "SC-19-Z-B",
  "SC-19-X-D",
  "SC-19-X-B",
  "SC-19-X-A",
  "SC-19-V-B",
  "SC-19-V-A",
  "SC-19-V-C",
  "SC-19-Z-C",
  "SC-20-V-C",
  "SC-20-V-D",
  "SC-20-V-B",
  "SC-20-Y-B",
  "SC-20-Y-D",
  "SC-20-Y-C",
  "SC-20-Y-A",
  "SC-20-X-A",
  "SC-20-X-C",
  "SC-20-X-D",
  "SC-20-Z-B",
  "SC-20-Z-D",
  "SC-20-Z-C",
  "SC-20-Z-A",
  "SC-21-V-C",
  "SC-21-V-B",
  "SC-21-V-D",
  "SC-21-Y-D",
  "SC-21-Z-C",
  "SC-21-Z-A",
  "SC-21-X-C",
  "SC-21-Y-B",
  "SC-21-Y-C",
  "SC-21-Y-A",
  "SC-21-X-B",
  "SC-21-X-D",
  "SC-21-Z-B",
  "SC-21-Z-D",
  "SC-22-X-B",
  "SC-22-X-A",
  "SC-22-V-B",
  "SC-22-V-A",
  "SC-22-V-C",
  "SC-22-Y-A",
  "SC-22-Y-C",
  "SC-22-Y-B",
  "SC-22-Y-D",
  "SC-22-Z-C",
  "SC-22-Z-A",
  "SC-22-X-C",
  "SC-22-V-D",
  "SC-22-X-D",
  "SC-22-Z-D",
  "SC-22-Z-B",
  "SC-23-V-C",
  "SC-23-V-A",
  "SC-23-Y-C",
  "SC-23-Z-C",
  "SC-23-Y-D",
  "SC-23-Z-A",
  "SC-23-Y-B",
  "SC-23-X-C",
  "SC-23-V-D",
  "SC-23-Z-B",
  "SC-23-Z-D",
  "SC-23-X-D",
  "SC-23-X-B",
  "SC-23-X-A",
  "SC-23-V-B",
  "SC-23-Y-A",
  "SC-24-X-D",
  "SC-24-Z-B",
  "SC-24-Z-D",
  "SC-24-X-B",
  "SC-24-X-A",
  "SC-24-X-C",
  "SC-24-V-B",
  "SC-24-V-D",
  "SC-24-Z-A",
  "SC-24-Y-B",
  "SC-24-Z-C",
  "SC-24-Y-D",
  "SC-24-Y-C",
  "SC-24-Y-A",
  "SC-24-V-C",
  "SC-24-V-A",
  "SC-25-V-A",
  "SC-25-V-C",
  "SD-20-V-B",
  "SD-20-Z-D",
  "SD-20-Z-B",
  "SD-20-X-B",
  "SD-20-X-D",
  "SD-20-X-C",
  "SD-20-X-A",
  "SD-21-X-B",
  "SD-21-X-D",
  "SD-21-Z-D",
  "SD-21-Z-B",
  "SD-21-Y-C",
  "SD-21-Y-D",
  "SD-21-Y-A",
  "SD-21-Y-B",
  "SD-21-V-D",
  "SD-21-X-C",
  "SD-21-Z-A",
  "SD-21-Z-C",
  "SD-21-X-A",
  "SD-21-V-B",
  "SD-21-V-C",
  "SD-22-V-A",
  "SD-22-V-C",
  "SD-22-V-B",
  "SD-22-V-D",
  "SD-22-X-A",
  "SD-22-X-B",
  "SD-22-X-C",
  "SD-22-X-D",
  "SD-22-Z-A",
  "SD-22-Z-B",
  "SD-22-Z-C",
  "SD-22-Z-D",
  "SD-22-Y-D",
  "SD-22-Y-C",
  "SD-22-Y-B",
  "SD-22-Y-A",
  
  // set 3
  "SD-23-X-B",
  "SD-23-X-D",
  "SD-23-Z-B",
  "SD-23-Z-D",
  "SD-23-Z-A",
  "SD-23-Z-C",
  "SD-23-Y-D",
  "SD-23-Y-B",
  "SD-23-X-C",
  "SD-23-V-D",
  "SD-23-V-B",
  "SD-23-X-A",
  "SD-23-V-A",
  "SD-23-Y-A",
  "SD-23-V-C",
  "SD-23-Y-C",
  "SD-24-X-A",
  "SD-24-V-B",
  "SD-24-X-C",
  "SD-24-Z-C",
  "SD-24-Y-B",
  "SD-24-Z-A",
  "SD-24-V-D",
  "SD-24-V-A",
  "SD-24-V-C",
  "SD-24-Y-A",
  "SD-24-Y-C",
  "SD-24-Y-D",
  "SE-20-X-B",
  "SE-21-X-B",
  "SE-21-X-A",
  "SE-21-V-B",
  "SE-21-V-A",
  "SE-21-X-D",
  "SE-21-Z-B",
  "SE-21-Y-B",
  "SE-21-V-D",
  "SE-21-Y-D",
  "SE-21-Z-D",
  "SE-22-X-B",
  "SE-22-X-A",
  "SE-22-V-B",
  "SE-22-V-A",
  "SE-22-X-D",
  "SE-22-X-C",
  "SE-22-V-D",
  "SE-22-Y-B",
  "SE-22-Y-A",
  "SE-22-V-C",
  "SE-22-Y-C",
  "SE-22-Z-C",
  "SE-22-Z-A",
  "SE-22-Y-D",
  "SE-22-Z-B",
  "SE-22-Z-D",
  "SE-23-V-B",
  "SE-23-V-A",
  "SE-23-X-A",
  "SE-23-X-B",
  "SE-23-Y-D",
  "SE-23-Z-C",
  "SE-23-Z-D",
  "SE-23-Z-A",
  "SE-23-Y-B",
  "SE-23-X-C",
  "SE-23-V-D",
  "SE-23-X-D",
  "SE-23-Z-B",
  "SE-23-V-C",
  "SE-23-Y-A",
  "SE-23-Y-C",
  "SE-24-X-A",
  "SE-24-V-B",
  "SE-24-V-A",
  "SE-24-Y-C",
  "SE-24-V-C",
  "SE-24-Y-B",
  "SE-24-V-D",
  "SE-24-Y-D",
  "SE-24-Y-A",
  "SF-21-Z-A",
  "SF-21-Z-B",
  "SF-21-X-C",
  "SF-21-X-D",
  "SF-21-Y-B",
  "SF-21-V-D",
  "SF-21-V-B",
  "SF-21-X-A",
  "SF-21-Z-C",
  "SF-21-Z-D",
  "SF-21-X-B",
  "SF-22-V-A",
  "SF-22-V-C",
  "SF-22-Y-A",
  "SF-22-V-D",
  "SF-22-V-B",
  "SF-22-Y-B",
  "SF-22-X-C",
  "SF-22-Z-A",
  "SF-22-X-A",
  "SF-22-X-B",
  "SF-22-X-D",
  "SF-22-Z-B",
  "SF-22-Y-C",
  "SF-22-Y-D",
  "SF-22-Z-C",
  "SF-22-Z-D",
  "SF-23-Z-B",
  "SF-23-X-D",
  "SF-23-X-C",
  "SF-23-V-D",
  "SF-23-X-A",
  "SF-23-V-B",
  "SF-23-V-A",
  "SF-23-V-C",
  "SF-23-Y-A",
  "SF-23-Z-C",
  "SF-23-Z-D",
  "SF-23-Y-C",
  "SF-23-Z-A",
  "SF-23-Y-B",
  "SF-23-X-B",
  "SF-23-Y-D",
  "SF-24-Y-A",
  "SF-24-V-A",
  "SF-24-V-B",
  "SF-24-V-C",
  "SF-24-Y-C",
  "SG-21-Z-D",
  "SG-21-X-D",
  "SG-21-X-B",
  "SG-22-X-A",
  "SG-22-X-B",
  "SG-22-X-C",
  "SG-22-X-D",
  "SG-22-Z-B",
  "SG-22-Z-D",
  "SG-22-Z-A",
  "SG-22-Y-D",
  "SG-22-Y-B",
  "SG-22-Y-C",
  "SG-22-Y-A",
  "SG-22-V-D",
  "SG-22-V-B",
  "SG-22-V-A",
  "SG-22-V-C",
  "SG-22-Z-C",
  "SG-23-V-B",
  "SG-23-V-A",
  "SG-23-V-C",
  "SH-21-Y-B",
  "SH-21-V-D",
  "SH-21-X-A",
  "SH-21-X-C",
  "SH-21-X-D",
  "SH-21-X-B",
  "SH-21-Z-B",
  "SH-21-Z-D",
  "SH-21-Z-C",
  "SH-21-Z-A",
  "SH-22-X-A",
  "SH-22-V-B",
  "SH-22-V-A",
  "SH-22-V-C",
  "SH-22-Y-A",
  "SH-22-Y-C",
  "SH-22-Z-C",
  "SH-22-Z-A",
  "SH-22-X-C",
  "SH-22-V-D",
  "SH-22-X-B",
  "SH-22-X-D",
  "SH-22-Y-D",
  "SH-22-Y-B",
  "SI-22-V-A",
  "SI-22-V-C",
  "SI-22-V-B"
  ]

// rf bands
var bands = [
  "BLUE",
  "GREEN",
  "RED",
  "NIR",
  "SWIR1",
  "SWIR2",
  "NDVI",
  "EVI",
  "EVI2",
  "SAVI", // n tava sendo usado
  "MNDWI",
  "NDWIm",
  "AWEIsh", // novo
  "NDBI",
  "NBR",
  "NDRI",
  "BAI",
  "UI",
  "NDUI",
  "BSI",
  "BU",
  "NDFI",
  "GV",
  "NPV",
  "SOIL",
  "CLOUD",
  "GVS",
  "SHADE",
  "SUBS",
  "VEG",
  "DARK",
  "EVI_p10",
  "EVI_p90",
  "EVI2_p10",
  "EVI2_p90",
  "EVI_dif9010",
  "EVI2_dif9010",
  "EBBI",
  "EBBI_p25",
  "EBBI_p75",
  "EBBI_dif7525",
  "EBBI_p90"
]

// requires
// var batch_mosaic = require('users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/mosaic_production.js')
var batch_mosaic = require('users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/mosaic_production.js')
var batch_classify = require('users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/class_lib.js')

// assets 
var urbSamples = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/Urb'
var notUrbSamples = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/NUrb'

// feature collections
var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
var cartasHex = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex')

// // get the feature of the context 
// function getContext (grid){
  
//   var ft = ee.Feature(cartas.filter(ee.Filter.eq('grid_name', grid)).first())
  
//   var filtered = ee.FeatureCollection(cartas.filterBounds(ft.geometry().buffer(2, 1)))
  
//   return [
//     // bounds to get samples
//     filtered,
    
//     // bounds to classification
//     ft
//     ]
// }

// get the feature of the context 
function getContext (grid){
  
  var ft = ee.FeatureCollection(cartasHex.filter(ee.Filter.eq('grid_name', grid))).geometry()
  
  var cartaFt = ee.Feature(cartas.filter(ee.Filter.eq('grid_name', grid)).first())
  
  var filtered = ee.FeatureCollection(cartas.filterBounds(cartaFt.geometry().buffer(2, 1)))
  
  return [
    // bounds to get samples
    filtered,
    
    // bounds to classification
    ft
    ]
}

// classification by sample size
function classification (year, context, regionToClassify, samples, bands){
  
  // get the mosaic
  var mosaic = batch_mosaic.mosaicGen (year, context)
  // Map.addLayer(mosaic.clip(regionToClassify), {bands:['RED', 'GREEN', 'BLUE'], min:1000, max:1290}, 'mosaic')
  
  // get the feature space
  var samplesTrained = batch_classify.getFeatureSpace (mosaic, samples)
  
  // get the classification
  var imgClassified = batch_classify.classifying (bands, samplesTrained, 120, mosaic.clip(regionToClassify))
  
  return imgClassified
}

// sampling a set of samples
function getFeatureSpace (image, samples){

  var samplesWithProperties = image.sampleRegions({
    collection:samples,
    properties: ['value'],
    scale:30,
    geometries:true,
    tileScale:10
  });

  return ee.FeatureCollection(samplesWithProperties);

};

// classification analysis
function classificationAnalysis (year, context, regionToClassify, sampleSize, bands, bandsName){
  
  if (year > 2022){
    
    var sampleYear = 2022
    
  } else {
    
    var sampleYear = year
  }
  
  // urban samples
  var urbSamplesFc = ee.FeatureCollection(urbSamples + "/Samples_Urb_Train_v5_" + sampleYear)
  
  var urbToClassify = urbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .limit(sampleSize)
  
  // var urbToValidate = urbSamplesFc
  // .filterBounds(regionToClassify)
  // .filter(ee.Filter.bounds(urbToClassify, 1).not())
  // .limit(400)
  // // print('urbToValidate', urbToValidate)
  
  // not urban samples
  var notUrbSamplesFc = ee.FeatureCollection(notUrbSamples +"/Samples_NUrb_Train_v5_" + sampleYear)
  
  var notUrbToClassify = notUrbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .limit(sampleSize*balance)
  
  // var notUrbToValidate = notUrbSamplesFc
  // .filterBounds(regionToClassify)
  // .filter(ee.Filter.bounds(notUrbToClassify, 1).not())
  // .limit(800)
  
  // samples to classify
  var samplesToclassify = urbToClassify.merge(notUrbToClassify)
  // Map.addLayer(samplesToclassify, {}, 'samplesToclassify')
  // print('samplesToclassify', samplesToclassify)
  
  // // samples to validate
  // var samplesToValidade = urbToValidate.merge(notUrbToValidate)
  // // print('samplesToclassify', samplesToValidade)
  
  // running the classification
  var imgClassified = classification (year, context, regionToClassify, samplesToclassify, bands)
  // Map.addLayer(imgClassified,{min:10, max:90}, 'imgClassified ' + year)
  
  // // get the feature space
  // var samplesWithProperties = getFeatureSpace (imgClassified, samplesToValidade)
  
  // return ee.FeatureCollection(samplesWithProperties)
  // .map(function (s){return s
  //   .set('sampleSize', sampleSize)
  //   .set('year', year)
  //   .set('bandsName', bandsName)
  // })
  
  return ee.Image(imgClassified).toByte()
} 

// //----------------------------------------
// testing
var carta = 
'SF-23-Y-D' // corte de probabilidade estimado em 64 para esta carta, sjc
// 'SH-22-Y-B' // porto alegre
// 'SC-19-X-D' // rio branco
// 'SC-20-V-A'
// 'SC-20-V-C'
// 'SB-20-Z-C'
// 'NA-19-Z-B'
// 'NA-20-X-D'// boa vista

var context = ee.FeatureCollection(getContext (carta)[0]).geometry().bounds(10);print('context', context)
var regionToClassify = ee.Feature(getContext (carta)[1]).geometry();print('regionToClassify', regionToClassify)
// Map.centerObject(regionToClassify)
Map.addLayer(context, {}, 'context', false)

var year = 2015
var bandsToTest = bands
var sSizeToTest = 200
var balance = 2
var img = classificationAnalysis (year, context, regionToClassify, sSizeToTest, bandsToTest)

Map.addLayer(img, {min:10, max:75}, 'example area')


// // //----------------------------------------

// // info
// var prob_version = 1
// var col = 10
// var mosaic_version = 1
// var samples_version = 5
// var desc = 'col 10; mosaico adaptado da cl 9; 220 urb samples/440 not urb samples; v1' 
// // var imgColToExport = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/prob/'

// // asset pessoal para não onerar o workspace
// var imgColToExport = 'projects/ee-ers/assets/mapbiomas/col10/prob/'

// // tested variables
// var sampleSize = 220
// var balance = 2

// // // for test:
// // var years = [2023]
// // var gridList = ['SF-23-Y-D']

// // -----------------------------------------------

// // // ed
// // var years = ee.List.sequence(1986, 1990).getInfo()//workspace

// // var years = ee.List.sequence(1991, 1995).getInfo()//asset ed
// var years = [
//   // 1991,
//   // 1992,
//   // 1993,
//   // 1994,
//   // 1995,
//   // 1996,
//   // 1997,
//   // 1998,
//   1999
//   ]

// // var years = ee.List.sequence(1996, 2000).getInfo()

// // // breno
// // var years = ee.List.sequence(2001, 2005).getInfo()
// // var years = ee.List.sequence(2006, 2010).getInfo()
// // var years = ee.List.sequence(2011, 2015).getInfo()

// // // julio
// // var years = ee.List.sequence(2016, 2020).getInfo()
// // var years = ee.List.sequence(2021, 2024).getInfo()

// // // -----------------------------------------------

// gridList.forEach(function (carta){
  
//   // getting spatial limits
//   var context = ee.FeatureCollection(getContext (carta)[0]).geometry().bounds(10)
//   var regionToClassify = ee.Feature(getContext (carta)[1]).geometry()
  
//   // running to a set of different samples size
//   years.forEach(function (year){
    
//     var result = classificationAnalysis (year, context, regionToClassify, sampleSize, bands, false)
//     // info variables
//     .set('territory', 'BRAZIL')
//     .set('theme', 'Urban Area')
//     .set('version', prob_version)
//     .set('source', 'GT URBANO')
//     .set('collection_id', col)
//     .set('year', year)
//     .set('grid', carta)
//     // .set('grid_Model', grid_Model)
//     .set('Mosaic_version', mosaic_version)
//     .set('Samples_version', samples_version)
//     .set("description", desc)
        
//         // .selfMask()
    
//     var description = 'classification_' + year + '_' + carta + '_v' + prob_version
//     // var description = 'classification_' + year + '_' + carta + '_' + bandListName
//     // var description = 'teste_' + year + '_' + carta +'_sSize_' + sampleSize
    
//     // checking
//     // Map.addLayer(result, {min: 20, max: 90}, description)
//     // Map.centerObject(result)
    
//     var assetId = imgColToExport + description
    
//     // Export.table.toDrive({
//     //   collection: fc, 
//     //   description: description, 
//     //   folder: 'gee-mapbiomas-col10-bandListStudy', 
//     //   fileNamePrefix: description, 
//     //   fileFormat:'CSV',
//     //   selectors: ['classification', 'value', 'sampleSize', 'year', 'bandListName']
//     // })
    
//     Export.image.toAsset({
//       image: result, 
//       description: description, 
//       assetId: assetId, 
//       region: regionToClassify, 
//       scale: 30, 
//       maxPixels: 1e13
//     })
  
//   })
  
// })

// // var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
// // var ctest = 'NA-19-Z-B'

// // var filtered = cartas.filter(ee.Filter.eq('grid_name', ctest))
// // Map.addLayer(filtered, {}, 'filtered ' + ctest)
// // Map.centerObject(filtered)

