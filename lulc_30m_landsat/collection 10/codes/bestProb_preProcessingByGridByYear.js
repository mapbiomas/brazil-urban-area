// gridlist
// defined here https://code.earthengine.google.com/3434c6661d38448b91822bb71b888aa7?noload=true

var gridListByCarta1 = [
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

]

var gridListByCarta2 = [  
  // gridset 2
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

]

var gridListByCarta3 = [  
  // gridset 3
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

]

var gridListByCarta4 = [  
  // gridset 4
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
]

var gridListByCarta5 = [
  // gridset 5
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
]

var gridListByCarta6 = [
  // gridset 5
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

// assets 
var urbSamples = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/Urb'
var notUrbSamples = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/NUrb'

// feature collections
var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
var cartasHex = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex')


// get the feature of the context 
function getContext (grid){
  
  var ft = ee.FeatureCollection(cartasHex.filter(ee.Filter.eq('grid_name', grid))).geometry()
  
  var cartaFt = ee.Feature(cartas.filter(ee.Filter.eq('grid_name', grid)).first())
  
  var filtered = ee.FeatureCollection(cartas.filterBounds(cartaFt.geometry().buffer(2, 1)))
  
  return filtered
  // return [
  //   // bounds to get samples
  //   filtered,
    
  //   // bounds to classification
  //   ft
  //   ]
}

// // get the feature of the context based on super-supergrids
// function getContext (grid){
  
//   var ft = ee.FeatureCollection(cartasHex.filter(ee.Filter.stringContains('grid_name', grid)))
//   .union(1)
//   .first()
//   .geometry()
  
//   return ee.Feature(ft)
// }

// creating an image collection of the classifications results
var gridList = [
'NA',
'NB',
'SA',
'SB',
'SC',
'SD',
'SE',
'SF',
'SG',
'SH',
'SI',  
  
]

var probMeanVersion = 1

var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean/classification_'

function mosaicLayers (grid){
  return ee.Image(asset + grid + '_v' + probMeanVersion)
}

var imgCollection = ee.ImageCollection(gridList.map(mosaicLayers))

// classification by sample size
function getImageToSampleRegion (year){
  
  return ee.Image(imgCollection.select('classification_' + year).mosaic())
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
function classificationAnalysis (year, context, sampleSize){
  
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
  
  var urbToValidate = urbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .filter(ee.Filter.bounds(urbToClassify, 1).not())
  .limit(sampleSize*2)
  // // print('urbToValidate', urbToValidate)
  
  // not urban samples
  var notUrbSamplesFc = ee.FeatureCollection(notUrbSamples +"/Samples_NUrb_Train_v5_" + sampleYear)
  
  var notUrbToClassify = notUrbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .limit(sampleSize*balance)
  
  var notUrbToValidate = notUrbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .filter(ee.Filter.bounds(notUrbToClassify, 1).not())
  .limit(sampleSize*balance*2)
  
  // samples to classify
  // var samplesToclassify = urbToClassify.merge(notUrbToClassify)
  // Map.addLayer(samplesToclassify, {}, 'samplesToclassify')
  // print('samplesToclassify', samplesToclassify)
  
  // samples to validate
  var samplesToValidade = urbToValidate.merge(notUrbToValidate)
  // print('samplesToclassify', samplesToValidade)
  
  // // running the classification
  // var imgClassified = classification (year, context, regionToClassify, samplesToclassify, bands)
  // // Map.addLayer(imgClassified,{min:10, max:90}, 'imgClassified ' + year)
  
  // get the image classified
  var imgClassified = getImageToSampleRegion (year)
  .rename('classification')
  
  // get the feature space
  var samplesWithProperties = getFeatureSpace (imgClassified, samplesToValidade)
  
  return ee.FeatureCollection(samplesWithProperties)
  .map(function (s){return s.set('year', year)})
} 


// // // -----------------------------------------------

// uncomment to proceed

// // ed
// var gridListByCarta = gridListByCarta1
// var gridListByCarta = gridListByCarta2

// // breno
// var gridListByCarta = gridListByCarta3
// var gridListByCarta = gridListByCarta4

// // julio
// var gridListByCarta = gridListByCarta5
// var gridListByCarta = gridListByCarta6

var sampleSize = 220
var balance = 2
var years = ee.List.sequence(1985, 2024).getInfo()

// ----------------------------------------------------

// var gridListByCarta = [
//   // 'SC-24-X-A',
//   'SB-22-V-C'
//   ]

gridListByCarta.forEach(function (carta){ 
  
  
  // // getting spatial limits
  var context = ee.FeatureCollection(getContext (carta)).geometry().bounds(10)
  // var context = ee.FeatureCollection(getContext (carta)[0]).geometry().bounds(10)
  // // var regionToClassify = ee.Feature(getContext (carta)[1]).geometry()
  // var context = ee.Feature(getContext (carta))
  // Map.addLayer(context, {}, 'context')
  
  // running to a set of different samples size
  var ftCol = ee.FeatureCollection(years.map(function (year){
    
    var result = classificationAnalysis (year, context, sampleSize)
    // var description = 'classification_' + year + '_' + carta + '_v' + probMeanVersion
    
    return result
  })).flatten()

  // // check 
  // print(ftCol)
  // Map.addLayer(ftCol, {}, 'fc ftCol')
  
  // var description = 'classification_' + year + '_s' + sampleSize +'_' + carta + '_v' + probMeanVersion
  var description = 'classification_s' + sampleSize +'_' + carta + '_v' + probMeanVersion
  
  Export.table.toDrive({
    collection: ftCol, 
    description: description, 
    folder: 'gee-mapbiomas-col10-settingBestProbCutByCarta', 
    // folder: 'gee-mapbiomas-col10-settingBestProbCutByCarta_complementary', 
    fileNamePrefix: description, 
    fileFormat:'CSV',
    selectors: ['classification', 'value', 'year']
  })
  
})







// gridList.forEach(function (carta){
  
//   // getting spatial limits
//   var context = ee.FeatureCollection(getContext (carta)[0]).geometry().bounds(10)
//   var regionToClassify = ee.Feature(getContext (carta)[1]).geometry()
  
//   // running to a set of different samples size
//   years.forEach(function (year){
    
//     var result = classificationAnalysis (year, context, regionToClassify, sampleSize)
//     var description = 'classification_' + year + '_' + carta + '_v' + probMeanVersion
    
//     // // 
//     // print(result)
//     // Export.table.toDrive({
//     //   collection: result, 
//     //   description: description, 
//     //   folder: 'gee-mapbiomas-col10-settingBestProbCut', 
//     //   fileNamePrefix: description, 
//     //   fileFormat:'CSV',
//     //   selectors: ['classification', 'value', 'year']
//     // })
  
//   })
  
// })



// // ----------- checking abcent data ------------------
// // getting spatial limits
//   var gridTest =
//   // 'SB-19-V-B'
//   // 'SB-22-V-C'
//   'NA-19-Z-D'
  
//   var carta = cartas.filter(ee.Filter.eq('grid_name', gridTest))
//   Map.addLayer(carta, {}, gridTest)
  
//   var context = ee.FeatureCollection(getContext (gridTest)).geometry().bounds(10)
//   Map.addLayer(context, {}, 'context')
//   Map.centerObject(context)
  
//   var year = 2013
//   var result = classificationAnalysis (year, context, sampleSize)
//   Map.addLayer(result.filter(ee.Filter.eq('value', 0)), {color:'blue'}, 'result not urb' + year)
//   Map.addLayer(result.filter(ee.Filter.eq('value', 1)), {color:'red'}, 'result urb ' + year)
//   // Map.centerObject(result, 10)
  
//   // prob raw
//   var threshold = 72
//   var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/prob/classification_' + year + '_' + gridTest + '_v1'
//   var img = ee.Image(asset)
//   Map.addLayer(img, {min:0, max: 90}, 'year ' + year + ' ' + gridTest)
//   Map.addLayer(img.gte(threshold).selfMask(), {palette: ['red']}, 'prob raw year ' + year + ' ' + gridTest)
  
//   var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean/'
//   var name = 'classification_' + gridTest.slice(0,2) + '_v' + 1
//   var img = ee.Image(asset + name).select('classification_' + year)
//   Map.addLayer(img, {min:0, max: 90}, 'year ' + year + ' ' + gridTest)
//   Map.addLayer(img.gte(threshold).selfMask(), {palette: ['red']}, 'masked year ' + year + ' ' + gridTest)
  
  
  // // running to a set of different samples size
  // var ftCol = ee.FeatureCollection(years.map(function (year){
    
  //   var result = classificationAnalysis (year, context, sampleSize)
  //   // var description = 'classification_' + year + '_' + carta + '_v' + probMeanVersion
    
  //   return result
  // })).flatten()

