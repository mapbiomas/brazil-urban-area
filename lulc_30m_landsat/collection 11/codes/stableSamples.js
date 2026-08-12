// defining the limites (initial and final year) and internal of sampling
var initial = 1985, final = 2020, interval = 8 // samples were gathered for each 8 years
var groups = [] // save lists of years
var sizes = [] // save sizes, so we can iterate later
var ranges = [] // save names

// prepare the lists of years
for (var i = initial+interval; final >= i; i+=interval){
  
  var list = []
  
  for (var j = i-interval; j<=final; j++){
  
    list.push(j)
    
  }
  groups.push(list)
  sizes.push(list.length)
  ranges.push(list[0] + '_to_' + list[list.length-1])
  
}

// preparing a list to iterate
var listToIterate = []

for (var i = 0; i<sizes.length; i++){
  
  listToIterate.push(i)
  
}

// print(listToIterate)
// print(ranges)
// print(groups)

// require the list of super cartas to be processed
var batchLists = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/listsAndDicts.js')
var listOfGrids = batchLists.cartasCompleteSetToClassify // 'super cartas' para toda a classificacao


// divinding the process of exporting samples
var id = 0
var max = 1
var listChunks = []
var chunkSize = listOfGrids.length
var chunksIds = ee.List.sequence(0,chunkSize-1).getInfo()

// separating the original list of super cartas in chunks
for (var i = 0; i<chunkSize; i++){
    
    var list = []
    
    for (var j = 0; j<max; j++){
        
        if (id<listOfGrids.length){
          
            list.push(listOfGrids[id])
            id++
          
        }
      
    }
    
    listChunks.push(list)
}
// print(listChunks)
// print(chunkSize)

// here we define the folder where the samples will be saved
var idFolder = 'projects/ee-ers/assets/mapbiomas/col11/samples/'

// requiring packages necessary to process the stable collection and remap the classes
var batchCol = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/collections.js')


function createSamples (image, geometry, sSize){

  // class values and the number of points for each
  var classValues = [1, 2, 3, 4]; 

  // deine the number of points for each class (same number for each class)
  var classPoints = [sSize, sSize, sSize, sSize]; 
  
  // print('inside samples creation')
  
  // Create the stratified random sample
  var samplePoints = image.stratifiedSample({
      numPoints: sSize, 
      classBand: 'class',
      region: geometry,
      scale: 30, 
      geometries: true, 
      seed: 42, 
      classValues: classValues,
      classPoints: classPoints,
      dropNulls: true, 
      tileScale: 16 
  });
  
  return samplePoints
}

// these feature collections are used to get the context of the super carta, so we can get samples from the surrounding areas
var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
var cartasHex = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex')
// Map.addLayer(cartas.filter(ee.Filter.inList('grid_name', listOfGrids)))

// get the feature of the context 
function getContext (grid){
  
  var ft = ee.FeatureCollection(cartasHex.filter(ee.Filter.eq('grid_name', grid))).geometry()
  
  var cartaFt = ee.Feature(cartas.filter(ee.Filter.eq('grid_name', grid)).first())
  
  var filtered = ee.FeatureCollection(cartas.filterBounds(cartaFt.geometry().buffer(2, 1)))
  
  return filtered
}

// here we iterate over the list of ranges (1985-1992, 1993-2000, 2001-2008, 2009-2016, 2017-2024) and for each range we iterate over the chunks of super cartas to create samples and export them to the asset folder
listToIterate.forEach(function (i){
  
  var range = ranges[i]
  
  var stableCol = ee.Image(batchCol.stableCollectionByKYears(10, groups[i], sizes[i]))
  
  /*
  // version 1
  1 = urban
  2 = forest formations
  3 = water
  4 = farming
  */

  var masked = ee.Image(batchCol.remapMapBiomas (stableCol)).selfMask()
  
  // here we iterate over the chunks of super cartas to create samples and export them to the asset folder
  chunksIds.forEach (function (chunk){
      
      var chunklist = listChunks[chunk]
      var version = 2 // v1 + divided process (more chunks) + by10 years
      
      // here we create the samples for each super carta in the chunk and export them to the asset folder
      var fcToExport = ee.FeatureCollection(chunklist.map(function (grid){
          
        
            var feature = ee.FeatureCollection(getContext (grid)).geometry().simplify(5)
            
            
            var samples = createSamples (masked, feature, 250)
                .map(function (sample){return sample
                .set('range', range)
                .set('grid_name', grid)
                })
            return samples
        })
      ).flatten()
      
      var name = 's_' + range + '_p_' + chunk  +'_v' + version
      
      // print(name)
      // Map.addLayer(fcToExport)
      // Export the feature collection to the asset folder
      Export.table.toAsset({
        collection: fcToExport, 
        description: name, 
        assetId: idFolder + name, 
      })
  })  
})

/*
// after creating the samples, we can merge them into a single 
// feature collection and export it to the asset folder
// for that, save the exported samples addreesses in a list and use 
// the function below

var listOfAddress = [
    // fill with the list of samples previously exported
    
  ]

function getSamples (listOfAddress){
  
  var mergedCollection = ee.FeatureCollection(
    listOfAddress.map(function(address) {
      return ee.FeatureCollection(address);
    })
  ).flatten()
  // .filter(ee.Filter.inList('class', listOfClasses))
  // .filter(ee.Filter.inList('range', listOfRanges))
  
  return mergedCollection
}

var result = ee.FeatureCollection(getSamples(list))
// .filter(ee.Filter.eq('grid_name', 'SF-23-Y-C'))
// Map.addLayer(result.filterBounds(geometry))
// Map.addLayer(result)

var id = 'folder-to-save-the-merged-samples'
var version =  // fill with the version number
var description = 'stable_samples_by_range_v' + version

Export.table.toAsset({
  collection: result, 
  description: description, 
  assetId:id + description
})

// the merged exported samples are available at the following address:
// var samples = ee.FeatureCollection('projects/ee-ers/assets/mapbiomas/col11/samples/stable_samples_by_range_merged_v1')

*/
