// var probBatch = require('users/edimilsonrodriguessantos/mapbiomas:Col11/results/batchResults.js')

var list = [
  // cartas excluidas por falta de amostras estaveis de todas as classes
  // nestes casos foram usadas as probabilidades urbanas apenas, obtidas
  // com amostras da colecao 10
  "NA-21-Z-B",
  "NA-21-Z-C",
  "NA-21-Z-A",
  "NA-21-X-C", 
  "NA-21-Y-D",
  "NB-20-Y-D",
  "NA-20-V-A",
  "NA-20-V-D",
  "NA-20-V-B",
  "NA-19-Z-B",
  "NA-19-Z-A",
  "NA-19-Y-D",
  "NA-19-Y-B",
  "SB-18-X-D",
  "SC-21-X-B",
  "SC-22-V-A",
  
  // brasilia
  'SE-23-V-A', 'SD-23-Y-C', 'SD-22-Z-D', 'SE-22-X-B',
  
  // corumba
  'SE-21-Y-B',
  
  // -------------------------------------------------
]
exports.list = list

var cartasNorte = [
  // cartas excluidas por falta de amostras estaveis de todas as classes
  // nestes casos foram usadas as probabilidades urbanas apenas, obtidas
  // com amostras da colecao 10

  "NB-22-Y-D",
  "NA-22-V-B",
  "NA-22-X-A",
  "NA-22-X-C",
  "NA-22-Z-A",
  "NA-22-Z-C",
  "SA-22-X-A",
  "NA-22-Y-D",
  "SA-22-V-B",
  "SA-22-V-A",
  "NA-22-Y-C",
  "NA-22-Y-B",
  "NA-22-Y-A",
  "NA-22-V-D",
  "NA-22-V-C",
  "NA-21-Z-B",
  "NA-21-X-D",
  "NA-21-Z-D",
  "SA-21-X-B",
  "SA-21-X-A",
  "NA-21-Z-C",
  "NA-21-Z-A",
  "NA-21-X-C",
  "NA-21-Y-B",
  "NA-21-V-D",
  "NA-21-Y-D",
  "SA-21-V-B",
  "SA-21-V-A",
  "NA-21-Y-C",
  "NA-21-Y-A",
  "SA-20-X-B",
  "NA-20-Z-D",
  "NA-20-Z-B",
  "NA-20-X-D",
  "NA-21-V-C",
  "NA-21-V-A",
  "NA-20-X-B",
  "NB-20-Z-D",
  "NB-21-Y-C",
  "NB-20-Z-B",
  "NB-21-Y-A",
  "NB-20-Z-C",
  "NB-20-Y-D",
  "NB-20-Y-C",
  "NA-20-V-A",
  "NA-19-X-D",
  "NA-20-V-D",
  "NA-20-V-B",
  "NA-20-X-A",
  "NA-20-X-C",
  "NA-20-Y-B",
  "NA-20-Z-A",
  "NA-20-Z-C",
  "SA-20-X-A",
  "SA-20-V-B",
  "NA-20-Y-D",
  "SA-20-V-A",
  "NA-20-Y-C",
  "NA-20-Y-A",
  "NA-19-Z-B",
  "NA-19-Z-D",
  "SA-19-X-B",
  "SA-19-X-A",
  "NA-19-Z-C",
  "NA-19-Z-A",
  "SA-19-V-B",
  "NA-19-Y-D",
  "NA-19-Y-B",
  "NA-19-X-C",
  "SC-19-Y-D",
  "SC-19-Y-A",
  "SC-19-Y-B",
  "SC-19-V-D",
  "SC-19-Z-A",
  "SC-19-X-C",
  "SC-19-Z-C",
  "SC-19-Z-B",
  "SC-19-X-D",
  "SC-19-X-B",
  "SC-19-X-A",
  "SC-19-V-B",
  "SB-19-Z-C",
  "SB-19-Y-D",
  "SB-19-Z-D",
  "SB-19-Z-A",
  "SB-19-Z-B",
  "SB-19-X-C",
  "SB-19-X-D",
  "SB-19-X-A",
  "SB-19-X-B",
  "SB-19-Y-B",
  "SB-19-V-D",
  "SB-19-V-B",
  "SB-19-Y-C",
  "SB-19-Y-A",
  "SB-19-V-C",
  "SB-19-V-A",
  "SB-18-Z-B",
  "SB-18-X-D",
  "SB-18-X-B",
  "SB-18-Z-D",
  "SC-18-X-B",
  "SC-19-V-A",
  "SC-19-V-C",
  "SC-18-X-D",
  "SC-18-X-A",
  "SB-18-Z-C",
  "SB-18-Z-A",
  "SA-19-V-D",
  "SA-19-Y-B",
  "SA-19-Y-D",
  "SA-19-Z-A",
  "SA-19-Z-C",
  "SA-19-Z-D",
  "SA-19-Z-B",
  "SA-19-X-D",
  "SA-19-X-C",
  "SA-20-V-C",
  "SA-20-Y-A",
  "SA-20-Y-B",
  "SA-20-V-D",
  "SA-20-X-C",
  "SA-20-X-D",
  "SA-20-Z-A",
  "SA-20-Z-B",
  "SA-20-Y-D",
  "SA-20-Z-C",
  "SA-20-Z-D",
  "SB-20-X-A",
  "SB-20-X-B",
  "SB-20-V-B",
  "SB-20-V-A",
  "SA-20-Y-C",
  "SB-20-V-C",
  "SB-20-V-D",
  "SB-20-Y-A",
  "SB-20-Y-B",
  "SB-20-Y-D",
  "SB-20-Y-C",
  "SC-20-V-A",
  "SC-20-V-C",
  "SC-20-V-D",
  "SC-20-V-B",
  "SB-20-Z-A",
  "SB-20-Z-C",
  "SC-20-X-A",
  "SC-20-X-C",
  "SC-20-X-D",
  "SC-20-X-B",
  "SB-20-Z-D",
  "SB-20-Z-B",
  "SB-20-X-C",
  "SB-20-X-D",
  "SB-21-V-C",
  "SB-21-V-A",
  "SB-21-V-B",
  "SB-21-V-D",
  "SB-21-Y-A",
  "SB-21-Y-B",
  "SB-21-Y-C",
  "SC-21-V-C",
  "SC-21-V-A",
  "SC-21-V-B",
  "SC-21-V-D",
  "SB-21-Y-D",
  "SB-21-Z-A",
  "SB-21-Z-C",
  "SC-21-X-A",
  "SC-21-X-B",
  "SB-21-Z-D",
  "SB-21-Z-B",
  "SB-21-X-C",
  "SB-21-X-D",
  "SB-21-X-A",
  "SB-21-X-B",
  "SA-21-Z-C",
  "SA-21-Z-D",
  "SA-21-Z-B",
  "SA-21-Z-A",
  "SA-21-Y-D",
  "SA-21-Y-B",
  "SA-21-Y-C",
  "SA-21-Y-A",
  "SA-21-V-D",
  "SA-21-V-C",
  "SA-21-X-C",
  "SA-21-X-D",
  "SA-22-V-C",
  "SB-22-V-A",
  "SA-22-Y-C",
  "SA-22-Y-A",
  "SA-22-V-D",
  "SA-22-Y-B",
  "SA-22-Y-D",
  "SB-22-V-B",
  "SA-22-Z-A",
  "SA-22-Z-C",
  "SA-22-X-C",
  "SB-22-X-A",
  "SB-22-X-C",
  "SB-22-Z-A",
  "SB-22-Z-C",
  "SB-22-Y-D",
  "SC-22-V-B",
  "SC-22-V-A",
  "SB-22-Y-C",
  "SB-22-Y-B",
  "SB-22-Y-A",
  "SB-22-V-D",
  "SB-22-V-C",
  "SC-21-X-D",
  "SC-22-V-C",
  "SC-22-Y-A",
  "SC-21-Z-B",
  "SC-22-Y-C",
  "SC-21-Z-D",
  "SD-21-X-B",
  "SD-21-X-D",
  "SD-22-V-A",
  "SD-22-V-C",
  "SC-22-Y-B",
  "SC-22-Y-D",
  "SD-22-V-B",
  "SD-22-V-D",
  "SC-22-V-D",
  "SD-22-Y-B",
  "SD-22-Y-A",
  "SD-21-Z-B",
  "SD-20-Z-B",
  "SD-21-Y-A",
  "SD-21-Y-B",
  "SD-21-V-D",
  "SD-21-X-C",
  "SD-21-Z-A",
  "SD-21-X-A",
  "SD-21-V-B",
  "SC-21-Y-D",
  "SC-21-Z-C",
  "SC-21-Z-A",
  "SC-21-X-C",
  "SC-21-Y-B",
  "SC-21-Y-C",
  "SC-21-Y-A",
  "SC-20-Z-B",
  "SC-20-Z-D",
  "SD-20-X-B",
  "SD-20-X-D",
  "SD-21-V-A",
  "SD-21-V-C",
  "SD-20-X-C",
  "SD-20-V-B",
  "SD-20-X-A",
  "SC-20-Z-C",
  "SC-20-Z-A",
  "SC-20-Y-B",
  "SC-20-Y-D",
  "SD-20-V-A",
  "SC-20-Y-C",
  "SC-20-Y-A"
  
  ]
exports.cartasNorte = cartasNorte

// exported assets gerated from previous steps across different users 
// and projects. Merging them into a single collection for further 
// processing.
var rawCol = 
    ee.ImageCollection('projects/jpedrassoli/assets/MB-COLLECTION-11/PROB-COL11-V1').merge(
    ee.ImageCollection('users/joigenaro/MAPBIOMAS-COLLECTION-11/PROB-COL11-V1')).merge(
    ee.ImageCollection('projects/ee-spatialeanalytics/assets/MAPBIOMAS-COLLECTION-11/PROB-COL11-V1')).merge(
    ee.ImageCollection('projects/ee-jpedrassoli/assets/MAPBIOMAS-COLLECTION-11/PROB-COL11-V1')).merge(
    ee.ImageCollection('projects/juliopedrassoli/assets/MB-COLLECTION-11/PROB-COL11-V1')).merge(
    ee.ImageCollection('projects/bmm-mb-landsat/assets/col11/classification')).merge(
    ee.ImageCollection('projects/bmm-mb-cl01/assets/landsat_col11/classification')).merge(
    ee.ImageCollection('projects/bmm-mb-cl02/assets/landsat_col11/classification')).merge(
    ee.ImageCollection('projects/bmm-mb-cl03/assets/landsat_col11/classification')).merge(
    ee.ImageCollection('users/ers-mb-urb/col11/classification')).merge(
    ee.ImageCollection('projects/ee-ers/assets/mapbiomas/col11/classification')).merge(
    ee.ImageCollection('projects/ee-doc-environ/assets/classification')).merge(
    ee.ImageCollection('projects/ee-oficina/assets/classification')).merge(
    ee.ImageCollection('projects/ee-pb-fb/assets/mb/col11/classification')).merge(
    ee.ImageCollection('users/breno/mb_landsat_11/classification')).merge(
    ee.ImageCollection('users/brenomalheiros/mb_col11_classification'))

var col = rawCol
    .filter(ee.Filter.inList('grid', list).not())
    .filter(ee.Filter.inList('grid', cartasNorte).not())

function getImgProbCol11 (year){return col.filter(ee.Filter.eq('year', year)).select('class1_prob').median().rename('classification_' + year)}

/*
// name of the bands and their classes
class1_prob = urban
class2_prob = veg
class3_prob = water
class4_prob = mosaic
*/

// function to get all class probabilities for a given band
function getAllClassProb (band){return rawCol
  .select(
    ['class1_prob', 'class2_prob', 'class3_prob', 'class4_prob'],
    ['urban', 'veg', 'water', 'other']
  )
  .select(band)
  .sort('year', true)
}
// Map.addLayer(getImgAllProbCol11(1985), {}, 'getImgAllProbCol11')
exports.getAllClassProb = getAllClassProb

// function to get the mosaic of vegetation probability for a given year
function moisacVegByYear (year){
  return rawCol.filter(ee.Filter.eq('year', year)).median()
  .select(
      ['class2_prob'],
      ['veg']
  )
  .set('year', year)
}
exports.moisacVegByYear = moisacVegByYear

// function to get the mosaic of all class probabilities for a given year
function getImgAllProbCol11 (year){return rawCol.filter(ee.Filter.eq('year', year)).median().select(
  ['class1_prob', 'class2_prob', 'class3_prob', 'class4_prob'],
  ['urban', 'veg', 'water', 'other']
  )
}
// Map.addLayer(getImgAllProbCol11(1985), {}, 'getImgAllProbCol11')
exports.getImgAllProbCol11 = getImgAllProbCol11

// ---------------------------------------------------------------------------------------------------
// img collection da probabilidade harmonizada temporalmente
var probMean = ee.ImageCollection("projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean")

// lista de grids
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

// versao
var version = 1

// img da probabilidade harmonizada
var imgProbMean = ee.ImageCollection(gridList.map(
  function (grid){
    var asset = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA10/probMean/classification_'+ grid + '_v'+ version
    return ee.Image(asset)
    
  })).mosaic()

// funcao para obter uma imagem de probabilidade harmonizada temporalmente
function getImgProbmean (year){return imgProbMean.select('classification_' + year)}
// // ---------------------------------------------------------------------------------------
// // exemplo para um ano qualquer
// var year = 2024

// var img = ee.Image(getImgProbmean (year)).selfMask()
// Map.addLayer(img, {min:0, max:100}, 'prob col 10 ' + year)

// var img = ee.Image(getImgProbCol11 (year)).selfMask()
// Map.addLayer(img, {min:0, max:100}, 'prob col 11 ' + year)
// // var years = ee.List.sequence()

// function to mosaic the classification of col10 and col11 for a given year observing the lists
// of grids with unstable samples and the list of grids in the north of Brazil, 
// where the col10 classification procedures is more reliable than col11
function mosaicClassificationByYear (year){
  
  if (year <=2024){
    var yearCol10 = year
    var bname = 'classification_' + year
  } else {
    var yearCol10 = 2024
    var bname = 'classification_2025'
  }
      
  // col 10
  var img1 = ee.Image(getImgProbmean (yearCol10)).rename(bname)
  
  // col 11
  var img2 = ee.Image(getImgProbCol11 (year))
  
  return ee.ImageCollection([
    img1.toByte(), 
    img2.toByte(), // img2 goes on the top of img1
    ])
    .mosaic().toByte()
    .selfMask()
    .rename('classification_' + year)
    .set('year', year)
  
}
exports.mosaicClassificationByYear = mosaicClassificationByYear

var threshold = ee.Image('projects/ee-ers/assets/mapbiomas/col11/thresholdMedianByCartaImg')
function maskedClassification (year){
  return ee.Image(mosaicClassificationByYear (year)).gte(threshold.select('percentil'))
}

exports.maskedClassification = maskedClassification

var assetCol11 = ee.ImageCollection('projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/URBAN/classification_sf')
    // .aggregate_array('version').distinct()
    // .filter(ee.Filter.eq('version', 'C11_v1_SF')).mosaic()

function col11Results (version){return assetCol11.filter(ee.Filter.eq('version', version)).mosaic()}

exports.col11Results = col11Results


// procedures to merge the thresholds of col10 and col11 according to their reliability 
var cartas = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas')
var thresholdsCol10 = ee.Image('projects/ee-ers/assets/mapbiomas/col10/thresholdMeanByCartaImg')
    .clipToCollection(cartas.filter(ee.Filter.inList('grid_name', cartasNorte)))

var thresholdCompound = ee.ImageCollection([
  threshold,
  thresholdsCol10
  ]).mosaic()

exports.thresholdCompound = thresholdCompound
// Map.addLayer(thresholdCompound, {bands:['percentil'], max:100})




