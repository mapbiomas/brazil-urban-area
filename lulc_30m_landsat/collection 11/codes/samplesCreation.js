// defining the limites (initial and final year) and internal of sampling
var initial = 1985, final = 2020, interval = 8
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

var batchLists = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/listsAndDicts.js')
// var listOfGrids = batchLists.cartastest // somente para teste
var listOfGrids = batchLists.cartasCompleteSetToClassify // 'super cartas' para toda a classificacao
// var listOfGrids = [
//   "SD-24-Y-D",
//   ]

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

// var idFolder = 'projects/ee-ers/assets/mapbiomas/col11/samplesTest/'
var idFolder = 'projects/ee-ers/assets/mapbiomas/col11/samples/'

// var listOfSamplesAddress = []

// for (var i = 0; i<listOfGrids.length; i++){
  
//   var grid = listOfGrids[i]
  
//   for (var j = 0; j<ranges.length; j++){
    
//     // print(idFolder + 's_'+ grid + '_' + ranges[j])
//     listOfSamplesAddress.push(idFolder + 's_'+ grid + '_' + ranges[j])
//   }
  
// }
// // print(listOfSamplesAddress)

// requiring packages
var batchCol = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/collections.js')
var batchLists = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/listsAndDicts.js')

// function maskToGetSamples (image){
  
//   // image = batchCol.remapMapBiomas (image)
  
//   var mask = image.expression(
//     // '(val == forest) || (val == savanna) || (val == urban) || (val == water)', {
//     '(val == forest) || (val == farming) || (val == urban) || (val == water)', {
//       'val': image,
//       'forest': 2,
//       'farming': 4,
//       'urban': 1,
//       'water': 3,
//   });
   
//   return mask
// }

function createSamples (image, geometry, sSize){
  // class values and the number of points for each
  var classValues = [1, 2, 3, 4]; 
  // var classPoints = [500, 750, 250]; 
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

// feature collections
var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
var cartasHex = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex')
// Map.addLayer(cartas.filter(ee.Filter.inList('grid_name', listOfGrids)))

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

// // print(chunklist)

listToIterate.forEach(function (i){
  
  var range = ranges[i]
  
  var stableCol = ee.Image(batchCol.stableCollectionByKYears(10, groups[i], sizes[i]))
  
  // var masked = stableCol.updateMask(maskToGetSamples (stableCol)).selfMask()
  /*
  // version 1
  1 = urban
  2 = forest formations
  3 = water
  
  // version 2
  4 = farming
  */

  var masked = ee.Image(batchCol.remapMapBiomas (stableCol)).selfMask()
  // Map.addLayer(masked)

  // // Map.addLayer(masked, {min:1, max: 3}, 'map id ' + i)
  // var fcToExport = ee.FeatureCollection(listOfGrids.map(function (grid){
  
  // chunksIds.forEach (function (chunk){print(listChunks[chunk])})
  chunksIds.forEach (function (chunk){
      
      var chunklist = listChunks[chunk]
      
      // var version = 1 // samples created with 4 simplified classes
      var version = 2 // v1 + divided process (more chunks) + by10 years
      
      // var name = 's_' + range + '_p_' + chunk  +'_v' + version + '_' + chunklist[0]
      // // var name = idFolder + 's_' + range + '_p_' + chunk  +'_v' + version
      
      // print(name)
      
      var fcToExport = ee.FeatureCollection(chunklist.map(function (grid){
          
        // var feature = grids.filter(ee.Filter.eq('grid_name', grid))
        var feature = ee.FeatureCollection(getContext (grid)).geometry().simplify(5)
        // print(feature)
        
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
      Export.table.toAsset({
        collection: fcToExport, 
        description: name, 
        assetId: idFolder + name, 
      })
  })  
})


