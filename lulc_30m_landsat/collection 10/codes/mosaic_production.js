/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Point([-45.886932543776524, -23.235111990903615]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// datasets
var datasetSR_LT04 = ee.ImageCollection("LANDSAT/LT04/C02/T1_L2"),
    datasetSR_LT05 = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2"),
    datasetSR_LE07 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2"),
    datasetSR_LC08 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2"),
    datasetSR_LC09 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2'),

    datasetRaw_LT04 = ee.ImageCollection("LANDSAT/LT04/C02/T1"),
    datasetRaw_LT05 = ee.ImageCollection('LANDSAT/LT05/C02/T1'),
    datasetRaw_LE07 = ee.ImageCollection('LANDSAT/LE07/C02/T1'),
    datasetRaw_LC08 = ee.ImageCollection('LANDSAT/LC08/C02/T1'),
    datasetRaw_LC09 = ee.ImageCollection('LANDSAT/LC09/C02/T1')
    

// external functions
var rename = require("users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/renameBands.js");
var preProcess = require("users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/preProcessing_lib.js");
var indexesLib = require("users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/index_lib.js");

// ajuste de bandas e feature space
var bandsSR_LT05 = rename.rename("SR_LT05");
var bandsSR_LE07 = rename.rename("SR_LE07");
var bandsSR_LC08 = rename.rename("SR_LC08");
var bandsSR_LC09 = rename.rename("SR_LC09");
var bandsRaw_LT05 = rename.rename("RawLT05");
var bandsRaw_LE07 = rename.rename("RawLE07");
var bandsRaw_LC08 = rename.rename("RawLC08");
var bandsRaw_LC09 = rename.rename("RawLC09");

// var bandsTOA_LC05 = rename.rename("l5toa");
// var bandsTOA_LC07 = rename.rename("l7toa");
// var bandsTOA_LC08 = rename.rename("l8toa");

// lists
var medianBands = [
  // landsat 
  "BLUE",
  "GREEN",
  "RED",
  "NIR",
  "SWIR1",
  "SWIR2",
  
  // veg
  "NDVI",
  "EVI",
  "EVI2",
  "SAVI",
  
  // agua
  "MNDWI",
  "NDWIm",
  "AWEIsh",
  
  // solos/areas urb
  "NDBI",
  'NBR',
  "NDRI",
  "BAI",
  "UI",
  'NDUI',
  "BSI",
  "BU",
  'NDFI',
  
  // mistura 1
  "GV",
  "NPV",
  "SOIL",
  "CLOUD",
  "GVS",
  "SHADE",
  
  //  mistura 2
  'SUBS',
  'VEG',
  'DARK',
  ]

var rawMedianBands = [
  'EBBI',
  ]
  
var srP75Bands = [
  // veg
  'NDVI',
  
  // agua
  'NDWIm',
  
  // aurb
  'NDBI'
  ]

var srP1090bands = [
  'EVI', 'EVI2'
  ]

var rawBands = [

  'EBBI'
  
  ]

// surface Reflectance Collection
function mosaicGenByBandsLists (year, roi, medianBands, rawBands, rawBands){
    
    // surface reflectance
    var landsatSR = 
    
      // landsat 4
      datasetSR_LT04
      .filterBounds(roi)
      .map(preProcess.maskClouds_QA)
      .map(preProcess.applyScaleFactors)
      .select(bandsSR_LT05.bandNames, bandsSR_LT05.newNames)
      .merge(
        
        // landsat 5
        datasetSR_LT05
        .filterBounds(roi)
        .map(preProcess.maskClouds_QA)
        .map(preProcess.applyScaleFactors)
        .select(bandsSR_LT05.bandNames, bandsSR_LT05.newNames)
        ).merge(
          
          // landsat 7
          datasetSR_LE07
          .filterBounds(roi)
          .map(preProcess.maskClouds_QA)
          .map(preProcess.applyScaleFactors)
          .select(bandsSR_LE07.bandNames, bandsSR_LE07.newNames)
          ).merge(
            
            // landsat 8
            datasetSR_LC08
            .filterBounds(roi)
            .map(preProcess.maskClouds_QA)
            .map(preProcess.applyScaleFactors)
            .select(bandsSR_LC08.bandNames, bandsSR_LC08.newNames)
            ).merge(
              
              // landsat 9
              datasetSR_LC09
              .filterBounds(roi)
              .map(preProcess.maskClouds_QA)
              .map(preProcess.applyScaleFactors)
              .select(bandsSR_LC09.bandNames, bandsSR_LC09.newNames)
              )
        
              // filtering the collection
              .filterDate(year + '-01-01', year + '-12-31')
    
    // landsat raw
    var landsatRaw = 
    
      // landsat 4
      datasetRaw_LT04
      .filterBounds(roi)
      .map(preProcess.maskClouds_QA)
      // .map(preProcess.applyScaleFactors)
      .select(bandsRaw_LT05.bandNames, bandsRaw_LT05.newNames)
      .merge(
        
        // landsat 5
        datasetRaw_LT05
        .filterBounds(roi)
        .map(preProcess.maskClouds_QA)
        // .map(preProcess.applyScaleFactors)
        .select(bandsRaw_LT05.bandNames, bandsRaw_LT05.newNames)
        ).merge(
          
          // landsat 7
          datasetRaw_LE07
          .filterBounds(roi)
          .map(preProcess.maskClouds_QA)
          // .map(preProcess.applyScaleFactors)
          .select(bandsRaw_LE07.bandNames, bandsRaw_LE07.newNames)
          ).merge(
            
            // landsat 8
            datasetRaw_LC08
            .filterBounds(roi)
            .map(preProcess.maskClouds_QA)
            // .map(preProcess.applyScaleFactors)
            .select(bandsRaw_LC08.bandNames, bandsRaw_LC08.newNames)
            ).merge(
              
              // landsat 9
              datasetRaw_LC09
              .filterBounds(roi)
              .map(preProcess.maskClouds_QA)
              // .map(preProcess.applyScaleFactors)
              .select(bandsRaw_LC09.bandNames, bandsRaw_LC09.newNames)
              )
              
              // filtering the collection
              .filterDate(year + '-01-01', year + '-12-31')
    
    // setting the sr feature space
    var srFeatureSpace = function(image){
       
        // vegetacao
        image = image.addBands(indexesLib.calcNDVI(image));
        image = image.addBands(indexesLib.calcEVI(image));
        image = image.addBands(indexesLib.calcEVI2(image));
        image = image.addBands(indexesLib.calcSAVI(image)); 
        
        // agua
        image = image.addBands(indexesLib.calcMNDWI(image));
        image = image.addBands(indexesLib.calcNDWIm(image));
        image = image.addBands(indexesLib.calcAWEIsh(image));
        
        // areas urbanas
        image = image.addBands(indexesLib.calcNDBI(image));
        image = image.addBands(indexesLib.calcNBR(image));
        image = image.addBands(indexesLib.calcUI(image));
        image = image.addBands(indexesLib.calcBSI(image));
        image = image.addBands(indexesLib.calcNDRI(image));
        image = image.addBands(indexesLib.calcBAI(image));
        image = image.addBands(indexesLib.calcNDUI(image));
        image = image.addBands(indexesLib.calcBU(image));
        
        // mistura
        image = image.addBands(indexesLib.calcSMA(image));
        image = image.addBands(indexesLib.calcNDFI(image));
        image = image.addBands(indexesLib.calcSMASmall(image));

      return image
    };
    
    // setting the raw feature space
    var rawFeatureSpace = function(image){
      
        // area urbanizada
        image = image.addBands(indexesLib.calcEBBI(image));
        
      return image
    }
    
    var sr = landsatSR.map(srFeatureSpace)
    var raw = landsatRaw.map(rawFeatureSpace)
    
    // get sr mosaics
    var srMedian = sr.select(medianBands)
    .median()
    .add(1).multiply(1000).toUint16()
    
    var sr1090 = sr.select(srP1090bands)
    .reduce(ee.Reducer.percentile([10,90]))
    .add(1).multiply(1000).toUint16()
    
    var srDif1090 = sr1090.select([1,3]).subtract(sr1090.select([0,2])).rename(['EVI_dif9010', 'EVI2_dif9010'])

    // get raw mosaics
    var rawMedian = raw.select(rawBands)
    .median()
    .add(1).multiply(1000).toUint16()
    
    var raw90 = raw.select(rawBands)
    .reduce(ee.Reducer.percentile([90]))
    .add(1).multiply(1000).toUint16()

    var raw2575 = raw.select(rawBands)
    .reduce(ee.Reducer.percentile([25,75]))
    .add(1).multiply(1000).toUint16()
    
    var rawDif2575 = raw2575.select([1]).subtract(raw2575.select([0])).rename(['EBBI_dif7525'])
    
    var result = 
    // sr median mosaic
    srMedian
    
    // sr percentiles mosaic
    .addBands(sr1090)
    .addBands(srDif1090)
    
    // raw median mosaic
    .addBands(rawMedian)
    
    // percentiles mosaics
    .addBands(raw2575)
    .addBands(rawDif2575)
    .addBands(raw90)

  return result
  //.set('year', year)
}

function mosaicGen (year, roi){
  
  return ee.Image(mosaicGenByBandsLists (year, roi, medianBands, rawBands, rawBands))
}

// // // example to view
// var img = mosaicGen (2020, geometry)
// // print(img.bandNames())
// Map.addLayer(img)

//var mosaicBatch = require('users/edimilsonrodriguessantos/mapbiomas:Col10/classificacao/mosaic_production.js')

exports.mosaicGenByBandsLists = mosaicGenByBandsLists
exports.mosaicGen = mosaicGen