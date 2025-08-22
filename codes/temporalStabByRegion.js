/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-74.33286670320074, 4.749920454693928],
          [-74.33286670320074, -33.97211568065947],
          [-34.43052295320074, -33.97211568065947],
          [-34.43052295320074, 4.749920454693928]]], null, false),
    sp = /* color: #d63000 */ee.Geometry.Point([-46.79030653710299, -23.55447689114117]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// here are our image collections of probabilities (output of the classification)
var years = ee.List.sequence(1985, 2024).getInfo()
var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/prob'
var asset1 = 'projects/ee-ers/assets/mapbiomas/col10/prob'

// we had to divide the collections in two assets due to memory, but you ignore this, ok? 
var col1 = ee.ImageCollection(asset).filter(ee.Filter.lte('year', 2020))
var col2 = ee.ImageCollection(asset1)

// here is the collection of our probabilities. Each image has a property 'year', 
// which was used to sort the images
var col = col1.merge(col2).sort('year')

// here we created a "join", which is an opertor that 
// enables two collections to be combined. 
// This will be used in the next few lines.
var join = ee.Join.saveAll({matchesKey: 'images'})

// here is a filter that we considered to combine the images 
// the "difference" refers to a quantity of years that were considered as temporal range
// for example: difference is 2, then the range is [years-2, years+2]
var filter = ee.Filter.maxDifference({
  difference: 2, 
  leftField: 'year', 
  rightField: 'year'
})

// this function is used to merge images according to our classification grid
// we selected all grids from tha same latitudes and year
function mergeByProp (grid, year){
  
  var colFiltered = col
  .filter(ee.Filter.eq('year', year))
  .filter(ee.Filter.stringContains('grid', grid))
  
  return colFiltered.mosaic().set('year', year)
}

// here are our grid list and the responsibles for processing
var gridList = [
// ed
'NA',
'NB',
'SA',
'SB',

// Breno
'SC',
'SD',
'SE',
'SF',

// Julio
'SG',
'SH',
'SI',
]

// here are variables that we used in memory. For us, they were necessary to 
// rename bands according to years
var firstYear = 1985
var yearsList = ee.List.sequence(firstYear, 2024).getInfo()
var bandsNamesByYear = []
var bandsIds = ee.List.sequence(0, yearsList.length-1).getInfo()

for (var i =0; i < yearsList.length; i++){
  var y = firstYear + i
  var newBandName = 'classification_' + y
  bandsNamesByYear.push(newBandName)
}


// info - just some metadata, dont mind them
var prob_version = 1
var outputVersion = 1 // in this version, temp. filter with diff == 2 years
var colNumber = 10
var mosaic_version = 1
var samples_version = 5
var desc = 'col 10; mosaico adaptado da cl 9; 220 urb samples/400 not urb samples; v1; temp. filter difference = 2.' 
var imgColToExport = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean/'

// this is the key part of the probability "harmonization" 
function temporalHarmonization (grid){

    // function to merge images by year
    function mergeByYear (year){
      return ee.Image(mergeByProp (grid, year))
    }

    // function to create a set of images considering the temporal range
    // and calculate the mean probability value
    function meanWithinMatchingImages (image){
      
      var year = image.get('year')
      
      var imgs = ee.ImageCollection.fromImages(image.get('images'))
      
      var meanResult = imgs.reduce(ee.Reducer.mean())
      
      return ee.Image(meanResult).toByte().set('year', year)
      
    }
    
    // 1) we create a colllection of images covering all the years
    var colToApplyAFilter = ee.ImageCollection(years.map(mergeByYear))
    
    // 2) we combined this collection with itself to enable us to calculate the average
    // probability value in a time window.
    var joinedColl = join.apply(colToApplyAFilter, colToApplyAFilter, filter)
    
    // 3) here is the harmonized image collection
    var smoothedColl = ee.ImageCollection(joinedColl.map(meanWithinMatchingImages))
    // Map.addLayer(smoothedColl, {max:95}, 'smoothedColl collection')
    
    // 4) saving the results as bands to facilitate the exportation
    var imgByGrid = ee.ImageCollection(
      
      yearsList.map(function(year){
      
        return ee.Image(smoothedColl.filter(ee.Filter.eq('year', year)).first())
        .toByte()
        .rename('classification_' + year)
      
      }
    ))
    .toBands()
    .select(bandsIds, bandsNamesByYear)

  return imgByGrid
}

// this is an example of the results
var grid = 'SF'
var harmonized = temporalHarmonization (grid)
Map.addLayer(harmonized, {min:10, max:90, bands: ['classification_2024']}, 'harmonized to ' + grid)

// this is the non-harmonized results
var nonHarmonzed = col.filter(ee.Filter.stringContains('grid', grid))
Map.addLayer(nonHarmonzed, {min:10, max:90}, 'non harmonized to ' + grid)

Map.centerObject(sp, 12)
// // running for all grids ()
// gridList.forEach(function(grid){
    
    // // running the function by grid
    // var imgByGrid = temporalHarmonization (grid)

    //     // info variables (setting the metadata)
    //     .set('territory', 'BRAZIL')
    //     .set('theme', 'Urban Area')
    //     .set('version', prob_version)
    //     .set('source', 'GT URBANO')
    //     .set('collection_id', colNumber)
    //     .set('year', year)
    //     .set('grid', grid)
    //     .set('Mosaic_version', mosaic_version)
    //     .set('Samples_version', samples_version)
    //     .set('output_version', outputVersion)
    //     .set("description", desc)
    
//     // names
//     var description = 'classification_' + grid + '_v' + outputVersion
//     var assetId = imgColToExport + description
    
//     // exporting the results
//     Export.image.toAsset({
//       image: imgByGrid, 
//       description: description,
//       assetId: assetId, 
//       region: geometry, 
//       scale: 30, 
//       maxPixels: 1e13
//     })
  
// })
