// var batchCollections = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/collections.js')

// batch to get collections
var collectionInfo = {
  /*
  n : {
    'asset':,
    'function':,
    'level1':,
    'level12:,
  }
  */
  6:{
    'asset': 'projects/mapbiomas-public/assets/brazil/lulc/collection6/mapbiomas_collection60_integration_v1',
    'function': '', 
  },
  7:{
    'asset': 'projects/mapbiomas-public/assets/brazil/lulc/collection7_1/mapbiomas_collection71_integration_v1',
    'function': '', 
  },
  8:{
    'asset': 'projects/mapbiomas-public/assets/brazil/lulc/collection8/mapbiomas_collection80_integration_v1',
    'function': '', 
  },
  9:{
    'asset': 'projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1',
    'function': '', 
  },
  10:{
    'asset': 'projects/mapbiomas-public/assets/brazil/lulc/collection10_1/mapbiomas_brazil_collection10_1_coverage_v1',
    'function': '', 
  },
}

function collection (col){
  return ee.Image(collectionInfo[col]['asset'])
}

// print(collection (10))
exports.collection = collection

var colList = [
  6, 7, 8, 9, 10
  ]

//   function to get stable areas by year
function stableCollectionByYear (refCol, year){
  
  var referenceImage = collection (refCol).select('classification_' + year)
  
  var collections = ee.ImageCollection(
    
      colList.map(function (col){
        
        return collection (col).select('classification_' + year)
        
      })).sum().divide(5)
  
  return referenceImage
  .where(referenceImage.eq(collections), referenceImage)
  .where(referenceImage.neq(collections), 0)
  .selfMask()
  
}
exports.stableCollectionByYear = stableCollectionByYear
// Map.addLayer(stableCollectionByYear (10, 2020))

// function used to get stable areas by k years
function stableCollectionByKYears (refCol, years, k){
  
  var referenceImage = stableCollectionByYear (refCol, years[0]).select('classification_' + years[0])
  .rename('stable').toByte()
  
  var collections = ee.ImageCollection(
    
      years.map(function (year){
        
        return stableCollectionByYear (refCol, year).select('classification_' + year)
        .rename('stable').toByte()
        
      })).sum().divide(k)
  
  return referenceImage
  .where(referenceImage.eq(collections), referenceImage)
  .where(referenceImage.neq(collections), 0)
  .selfMask()
  
  return referenceImage
  
}

exports.stableCollectionByKYears = stableCollectionByKYears

// these are some examples of how to use the functions above
// Map.addLayer(stableCollectionByKYears (10, [2015, 2016, 2017, 2018, 2019], 5), {}, 'stable areas')

// preparing a remap function based on collection 10 classes to 
// reduce the number of classes to 4 (urban, forest, agua, farming)
var from = [

// forest
3, 4, 5, 6, 49,

// herbaceous and shrubby veg
11, 12, 32, 29, 50,

// farming
15, 18, 19, 39, 20, 40, 62, 41, 36, 46, 47, 35, 48, 9, 21,

// non veg areas
23, 24, 30, 75, 25, 

// agua
33, 31, 27

]

var to = [

// forest
2, 2, 2, 2, 2,

// herbaceous and shrubby veg
2, 2, 2, 2, 2,

// farming
4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,

// non veg areas
0, 1, 0, 0, 0, 

// agua
3, 3, 3

]

// 1 urban  // '#de2d26',
// 2 forest // '#2ca25f',
// 3 agua   // '#3182bd',
// 4 farming// '#feb24c'

function remapMapBiomas (image){
  return image.remap(
    from,
    to
    ).rename('class')
}

exports.remapMapBiomas = remapMapBiomas

// get a stable collection by year with remap applied
function stableCollectionByYearRemmaped (refCol, year){
  
  var referenceImage = collection (refCol).select('classification_' + year)
  
  referenceImage = remapMapBiomas (referenceImage)
  
  var collections = ee.ImageCollection(
    
      colList.map(function (col){
        
        // return collection (col).select('classification_' + year)
        return remapMapBiomas(collection (col).select('classification_' + year))
        
      })).sum().divide(5)
  
  return referenceImage
  .where(referenceImage.eq(collections), referenceImage)
  .where(referenceImage.neq(collections), 0)
  .selfMask()
  
}
exports.stableCollectionByYearRemmaped = stableCollectionByYearRemmaped
// Map.addLayer(stableCollectionByYearRemmaped (10, 1985), {min:1, max: 4}, 'stable remapped')

// function to get stable areas by k years with remap applied
function stableCollectionByKYearsRemapped (refCol, years, k){
  
  var referenceImage = stableCollectionByYearRemmaped (refCol, years[0])
  // .select('classification_' + years[0])
  .rename('stable').toByte()
  
  var collections = ee.ImageCollection(
    
      years.map(function (year){
        
        // return stableCollectionByYear (refCol, year).select('classification_' + year)
        return stableCollectionByYearRemmaped (refCol, year)
        // .select('classification_' + year)
        .rename('stable').toByte()
        
      })).sum().divide(k)
  
  return referenceImage
  .where(referenceImage.eq(collections), referenceImage)
  .where(referenceImage.neq(collections), 0)
  .selfMask()
  
  return referenceImage
  
}

exports.stableCollectionByKYearsRemapped = stableCollectionByKYearsRemapped