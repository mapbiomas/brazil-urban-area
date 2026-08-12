/**
 * Applies morphological filtering to the temporally consolidated urban maps
 * and exports the refined annual classifications by supergrid.
 */

// Configure the temporal-filter inputs and second spatial-filter output.
var inputAssets = [
  'projects/ee-breno-mb/assets/Sentinel-Col3/Sentinel_TF',
  'projects/ee-claradias/assets/FILTROS-S2-URB'
];

var outputAsset = 'projects/ee-breno-mb/assets/Sentinel-Col3/Sentinel_SF2';
var years = ee.List.sequence(2016, 2025).getInfo();
var inputVersion = 2;
var outputVersion = 2;

// Fill small internal gaps and remove isolated urban patches.
var applySpatialFilter = function(image) {
  var kernel = ee.Kernel.circle({radius: 1});

  image = image.unmask(0)
    .focal_max({iterations: 1, kernel: kernel})
    .focal_min({iterations: 1, kernel: kernel});

  var connectedPixelLimit = 50;
  var backgroundPatchSize = image.remap([0, 1], [1, 0])
    .selfMask()
    .connectedPixelCount(connectedPixelLimit, true);

  image = image
    .where(backgroundPatchSize.lte(10), 1)
    .reproject({crs: 'EPSG:4326', scale: 10});

  image = image
    .focal_min({iterations: 1, kernel: kernel})
    .focal_max({iterations: 1, kernel: kernel});

  var urbanPatchSize = image.selfMask()
    .connectedPixelCount(connectedPixelLimit, true);

  return image
    .where(urbanPatchSize.lte(10), 0)
    .reproject({crs: 'EPSG:4326', scale: 10});
};

// Convert the filtered binary image to MapBiomas urban class 24.
var reclassifyUrban = function(image) {
  return image.remap([0, 1], [0, 24]).selfMask();
};

// Merge the annual input images available for one supergrid.
var getInputImage = function(year, supergridName) {
  var inputCollection = ee.ImageCollection([]);

  inputAssets.forEach(function(assetPath) {
    var images = ee.ImageCollection(assetPath)
      .filter(ee.Filter.eq('year', year))
      .filter(ee.Filter.eq('version', inputVersion))
      .filter(ee.Filter.stringContains('grid', supergridName));

    inputCollection = inputCollection.merge(images);
  });

  return inputCollection.max();
};

// Export one refined annual classification for the selected supergrid.
var exportImage = function(image, supergridName, year) {
  var imageName = supergridName + '-' + year + '-' + outputVersion;
  var region = ee.ImageCollection('projects/ee-bmm-mapbiomas/assets/Sentinel-Col-7/cartasBuffer')
    .filter(ee.Filter.stringContains('grid', supergridName))
    .geometry();

  Export.image.toAsset({
    image: image,
    assetId: outputAsset + '/' + imageName,
    description: imageName,
    region: region,
    scale: 10,
    maxPixels: 1e13,
    pyramidingPolicy: {
      '.default': 'mode'
    }
  });
};

// Define the supergrids enabled for this processing run.
var supergrids = [
  'NA-20', 'NA-21', 'NA-22', 'NB-20',
  'SA-19', 'SA-20', 'SA-21', 'SA-22', 'SA-23', 'SA-24',
  'SB-18', 'SB-19', 'SB-20', 'SB-21', 'SB-22', 'SB-23', 'SB-24', 'SB-25',
  'SC-18', 'SC-19', 'SC-20', 'SC-21', 'SC-22', 'SC-23', 'SC-24', 'SC-25',
  'SD-20', 'SD-21', 'SD-22', 'SD-23', 'SD-24',
  'SE-21', 'SE-22', 'SE-23', 'SE-24',
  'SF-21', 'SF-22', 'SF-23', 'SF-24',
  'SG-21', 'SG-22', 'SG-23',
  'SH-21', 'SH-22', 'SI-22'
];

// Filter and export every configured year and supergrid.
years.forEach(function(year) {
  supergrids.forEach(function(supergridName) {
    var input = getInputImage(year, supergridName).eq(24);
    var filtered = applySpatialFilter(input);
    var classification = reclassifyUrban(filtered)
      .select(['remapped'], ['classification'])
      .toByte();

    var output = ee.ImageCollection(classification)
      .mosaic()
      .set('year', year)
      .set('grid', supergridName)
      .set('version', outputVersion);

    exportImage(output, supergridName, year);
  });
});
