// geometry to export
var br = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-75.00107783327269, 5.638185692973546],
          [-75.00107783327269, -34.455142149012936],
          [-30.721438172081097, -34.455142149012936],
          [-30.721438172081097, 5.638185692973546]]], null, false)

// require with the block for prob
var resultsBatch = require('users/edimilsonrodriguessantos/mapbiomas:Col11/results/batchResults.js')

// get all the probabilities images of classified vegetation
var years = ee.List.sequence(1985, 2025).getInfo()
var imgCol = ee.ImageCollection(years.map(resultsBatch.moisacVegByYear))
// Map.addLayer(imgCol)

// function to smooth the results using a mean value
function meanReducer (image){
  
  var year = image.get('year')
  var imgs = ee.ImageCollection.fromImages(image.get('images'))
  var result = imgs.reduce(ee.Reducer.mean())
  
  return ee.Image(result).toByte().set('year', year)
  
}

// function to apply the smoothing process
function smoothedProbCollection (colToApplyAFilter, neighboors){
    // 1) preparing to create a temporal smoothing
    var join = ee.Join.saveAll({matchesKey: 'images'})
    var filter = ee.Filter.maxDifference({
          difference: neighboors, 
          leftField: 'year', 
          rightField: 'year'
        })
    
    // 2) combining a collection with itself
    var joinedColl = join.apply(colToApplyAFilter, colToApplyAFilter, filter)
    
    // 3) obtaiing the final collection
    var smoothedColl = ee.ImageCollection(joinedColl.map(meanReducer))
    
    return smoothedColl
}

// running the smoothing process (this process provides temporal consistency 
// to the results)
var imgCol = smoothedProbCollection (imgCol, 2)

// transforming in image bands
var years = ee.List.sequence(1985, 2025).getInfo()

// setting band names for the final image
var from = []
var to = []
for (var i = 1985; i<=2025; i++){
  from.push(i-1985)
  to.push('classification_' + i)
}

// mapbiomas asset 
var asset = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/INTEGRATION/classification11_v2'
    
function col2band (col){
  
  var imgCol = ee.ImageCollection(years.map(function(year){
    var mapbiomas = ee.Image(asset).select('classification_' + year).eq(24).unmask()
    return ee.Image(
      col.filter(ee.Filter.eq('year', year)).median())
      .rename('classification_' + year).toByte()
      // // threhsold of veg urb
      // .gte(30)
      .updateMask(mapbiomas)
  }))
  
  return imgCol.toBands().select(from, to)
}

// result of the smoothing process
var result = col2band (imgCol)
// Map.addLayer(result.selfMask(), {bands: ['classification_2025'], palette:['green']}, 'veg urb')

var version = 1
var description = 'prob_intraurb_v' + version
var metadados = {
  'collection_id': 11,
  'theme':'INFRAURB',
  'source':'GT URBANO',
  'version': version, 
  'territory': 'BRAZIL',
  'description': 'veg intra urb; prob mean layer using filter difference of 3 years',
  'product_type': 'prob'
}

var assetid = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/URBAN/vegintraurb'

Export.image.toAsset({
  image: result, 
  description: description, 
  assetId: assetid + '/' + description, 
  region: br, 
  scale: 30, 
  maxPixels: 1e13, 
})