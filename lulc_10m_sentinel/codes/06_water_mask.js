/**
 * Removes mapped water and coastal exclusion areas from the annual urban maps,
 * attaches publication metadata, and exports the final collection assets.
 */

// Configure the input collection and final publication asset.
var inputVersion = 2;

var assetOutput = 'projects/mapbiomas-brazil/assets/LAND-COVER-10M/COLLECTION-4/URBAN/classification';
var outputVersion = 2;

// Define the metadata attached to each exported image.
var theme = { 'type': 'theme', 'name': 'INFRAURBANA' };
var collectionId = 4.0;
var source = 'urbano';

var description = 'Urban classification generated from embeddings, automatic threshold selection, Landsat-supported temporal filtering, and water and beach masks.';

// Rasterize the imported coastal and hydrographic exclusion layers.
var coastalFeatures = AL.merge(ES).merge(PR).merge(RJ).merge(RS).merge(SC).merge(SE);
var coastalMask = coastalFeatures
  .reduceToImage({ properties: ['id'], reducer: ee.Reducer.first() })
  .gte(0)
  .rename('classification');

var years = ee.List.sequence(2016, 2025).getInfo();

var inputAssets = [
  'projects/ee-breno-mb/assets/Sentinel-Col3/Sentinel_SF2'
];

// Merge all configured input collections for the selected version.
var imc = ee.ImageCollection([]);
inputAssets.forEach(function (assetPath) {
  var result = ee.ImageCollection(assetPath)
    .filter(ee.Filter.eq('version', inputVersion));
  imc = imc.merge(result);
});

var beachesBuffer = beaches.map(function (ft) { return ft.buffer(15); });

var beachBufferMask = beachesBuffer
  .reduceToImage({ properties: ['code'], reducer: ee.Reducer.first() })
  .gte(0)
  .rename('classification');
var manualMask = manual
  .reduceToImage({ properties: ['id'], reducer: ee.Reducer.first() })
  .gte(0)
  .rename('classification');
var riverMask = rio
  .reduceToImage({ properties: ['id'], reducer: ee.Reducer.first() })
  .gte(0)
  .rename('classification');

// Combine all vector-based exclusion masks at the production resolution.
var coastalExclusionMask = ee.ImageCollection([
  beachBufferMask,
  coastalMask,
  manualMask,
  riverMask
]).max()
  .reproject({ crs: 'EPSG:4326', scale: 10 })
  .toByte();

// Apply annual water and coastal masks, then export the final class-24 image.
years.forEach(function (year) {
  var img_year = imc.filter(ee.Filter.eq('year', year))
    .filter(ee.Filter.eq('version', inputVersion))
    .mosaic().rename('classification')

  print('Classification ' + year, img_year);

  // Reuse the latest available water mask for years after 2022.
  if (year > 2022) {
    var maskYear = 2022;
  } else {
    var maskYear = year;
  }

  var waterMask = agua.filter(ee.Filter.eq('year', maskYear))
    .mosaic().rename('classification');

  var waterFiltered = img_year.where(waterMask.eq(1), 1);
  var finalClassification = waterFiltered.where(coastalExclusionMask.eq(1), 2).eq(24)
    .selfMask().multiply(24).toByte()

  var imageYear = finalClassification
    .set('territory', 'BRAZIL')
    .set(theme.type, theme.name)
    .set('collection_id', collectionId)
    .set('source', source)
    .set('version', outputVersion)
    .set('year', parseInt(year, 10))
    .set('description', description);
  var name = year + '-' + outputVersion;

  Export.image.toAsset({
    'image': imageYear,
    'description': name,
    'assetId': assetOutput + '/' + name,
    'pyramidingPolicy': {
      '.default': 'mode'
    },
    'region': geometry,
    'scale': 10,
    'maxPixels': 1e13
  });
});
