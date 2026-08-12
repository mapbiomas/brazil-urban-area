// geoemtry to export (BR)
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-46.40789723713515, -22.82167216100656],
          [-46.40789723713515, -23.669597223966317],
          [-45.2790520222914, -23.669597223966317],
          [-45.2790520222914, -22.82167216100656]]], null, false);

// info to export
//-------------------------------
var prob_version = 1
var col = 11
var mosaic_version = 1
var samples_version = 1 // totally new samples
var desc = 'col 11; mosaico adaptado da col 10; 200 urb samples/800 not urb samples; v1; multoprob' 

// usando asset pessoal para rodar tarefas em diferentes contas
var imgColToExport = 'projects/ee-ers/assets/mapbiomas/col11/classification/'

//-------------------------------
// gridlist
var batchLists = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/listsAndDicts.js')
var gridList = batchLists.cartasParaClassificacao // grid usado para classificacao!!


// samples created based on stable areas and collections
var samples = ee.FeatureCollection('projects/ee-ers/assets/mapbiomas/col11/samples/stable_samples_by_range_merged_v1')

// dictionary defining intervals by year (for example, if year is 1985, the interval is '1985_to_2020')
var dictOfRanges = {}

for (var year = 1985; year<=2025; year++){
  
  if (year < 1993){
    
    var range = '1985_to_2020'
  } else if (year < 2001){
    
    var range = '1993_to_2020'
  } else if (year < 2009){
    
    var range = '2001_to_2020'
  } else {
    
    var range = '2009_to_2020'
  }
  
  dictOfRanges[year] = range
}

function getSamplesByYear (year){
  
  var filteredSamples =  samples.filter(ee.Filter.eq('range', dictOfRanges[year]))
  // print(dictOfRanges[year])
  return filteredSamples
}

// var result = getSamplesByYear (2025).filterBounds(geometry)
// print(result.aggregate_array('class'))
// Map.addLayer(result)


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
  "SAVI", 
  "MNDWI",
  "NDWIm",
  "AWEIsh",
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

// required modules - we used the same mosaic consolidated in the previous collection
var batch_mosaic = require('users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/mosaic_production.js')
var batch_classify = require('users/edimilsonrodriguessantos/mapbiomas:Col11/classification/class_lib.js')

// feature collections
var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
var cartasHex = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex')
// Map.addLayer(cartas.filter(ee.Filter.inList('grid_name', gridList)))
// Map.centerObject(cartas.filter(ee.Filter.inList('grid_name', gridList)), 10)

// get the feature of the context 
function getContext (grid){
  
  var ft = ee.FeatureCollection(cartasHex.filter(ee.Filter.eq('grid_name', grid))).geometry()
  
  var cartaFt = ee.Feature(cartas.filter(ee.Filter.eq('grid_name', grid)).first())
  
  var filtered = ee.FeatureCollection(cartas.filterBounds(cartaFt.geometry().buffer(2, 1)))
  
  return [
    // bounds to get samples
    filtered,
    
    // classification boundary
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
    properties: ['class'],
    scale:30,
    geometries:true,
    tileScale:10
  });

  return ee.FeatureCollection(samplesWithProperties);

};

// classification analysis
function classificationAnalysis (year, context, regionToClassify, sampleSize, bands, bandsName){
  
  // get samples by year
  var samples = getSamplesByYear (year)
  
  // urban samples
  var urbanSamples = samples
  .filterBounds(context)
  .filter(ee.Filter.eq('class', 1)) 
  .filter(ee.Filter.eq('type', 'classification'))
  .randomColumn().sort('random')
  .limit(sampleSize)
  
  // not urban samples
  var notUrbanSamples = samples
  .filterBounds(context)
  .filter(ee.Filter.neq('class', 1))
  .filter(ee.Filter.eq('type', 'classification'))
  .randomColumn().sort('random')
  .limit(sampleSize*balance)
  
  // samples to classify
  var samplesToclassify = urbanSamples.merge(notUrbanSamples)
  // Map.addLayer(samplesToclassify, {}, 'samplesToclassify')
  // print('samplesToclassify', samplesToclassify)

  // running the classification
  var imgClassified = classification (year, context, regionToClassify, samplesToclassify, bands)
  // Map.addLayer(imgClassified,{min:10, max:90}, 'imgClassified ' + year)
  
  // // returning the classification
  return ee.Image(imgClassified).toByte()
  
  /*
  // the code below ca be used if uncommented to get classified samples
  // the purpose is to assess the quality of classification easly and quickly,
  // but it is not used in the final version of the code because it is not 
  // necessary to export classified samples
  */

  // // returning classified samples
  // // get the feature space
  // var samplesWithProperties = getFeatureSpace (imgClassified, samplesToValidade)
  
  // return ee.FeatureCollection(samplesWithProperties)
  // .map(function (s){return s
  //   .set('sampleSize', sampleSize)
  //   .set('year', year)
  //   .set('bandsName', bandsName)
  // })

} 


// final parameters and lists of years to run the classification
// samples size
var sampleSize = 200
var balance = 4

// // ed
// var years = ee.List.sequence(1985, 1990).getInfo()//workspace
// var years = ee.List.sequence(1991, 1995).getInfo()//asset ed
// var years = ee.List.sequence(1996, 2000).getInfo()

// // breno
// var years = ee.List.sequence(2001, 2005).getInfo()
// var years = ee.List.sequence(2006, 2010).getInfo()
// var years = ee.List.sequence(2011, 2015).getInfo()

// // julio
// var years = ee.List.sequence(2016, 2020).getInfo()
// var years = ee.List.sequence(2021, 2024).getInfo()

// // -----------------------------------------------
// finally, running the classification for all years and all grids in the list
gridList.forEach(function (carta){
  
  // getting spatial limits
  var context = ee.FeatureCollection(getContext (carta)[0]).geometry().bounds(10)
  var regionToClassify = ee.Feature(getContext (carta)[1]).geometry()
  
  // running to a set of different samples size
  years.forEach(function (year){
    
    var result = classificationAnalysis (year, context, regionToClassify, sampleSize, bands, false)
    .arrayPad([4])
    .arrayProject([0])  
    .arrayFlatten([[  
      'class1_prob', // 1 urban
      'class2_prob', // 2 forest
      'class3_prob', // 3 agua
      'class4_prob', // 4 farming
    ]])
    
    // var result = 
    // ee.Image([
    //   safeFlattenClassification(
    //   classificationAnalysis(year, context, regionToClassify, sampleSize, bands, false),
    //   4
    // )
    // ])
    
    // info variables
    .set('territory', 'BRAZIL')
    .set('theme', 'Urban Area')
    .set('version', prob_version)
    .set('source', 'GT URBANO')
    .set('collection_id', col)
    .set('year', year)
    .set('grid', carta)
    .set('Mosaic_version', mosaic_version)
    .set('Samples_version', samples_version)
    .set("description", desc)
    
    var description = 'classification_' + year + '_' + carta + '_v' + prob_version
    var assetId = imgColToExport + description
    
    Export.image.toAsset({
      image: result, 
      description: description, 
      assetId: assetId, 
      region: regionToClassify, 
      scale: 30, 
      maxPixels: 1e13
    })
  
  })
  
})

