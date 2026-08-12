/**
 * Applies tile-specific probability thresholds and the ancillary spatial mask,
 * then exports binary urban classifications by supergrid.
 */

// Configure input probability assets, thresholds, and export metadata.
var assetThreshold = 'projects/ee-breno-mb/assets/Sentinel-Col3/Thresholds_Embeddings/';
var probabilityAssets = [
  'projects/ee-bmm-mapbiomas/assets/S2-URB-PROB-Col3',
  'projects/ee-breno-mb/assets/S2-URB-PROB-Col3',
  'projects/ee-claraddays/assets/S2-URB-PROB-Col3',
  'projects/ee-claradias/assets/S2-URB-PROB-Col3'
];

var outputAsset = 'projects/ee-breno-mb/assets/Sentinel-Col3/Sentinel_SF';
var years = ee.List.sequence(2016, 2025).getInfo();
var prob_version = 1;
var bestThresholdVersion = 1;
var version = 1;
var irs_threshold = 500;

years.forEach(function(year){
// Define the supergrids that contain mapped urban areas.
var supergrids = [
  'NA-20','NA-21','NA-22','NB-20','SA-19','SA-20','SA-21','SA-22','SA-23',
  'SA-24','SB-18','SB-19','SB-20','SB-21','SB-22','SB-23','SB-24','SB-25',
  'SC-18','SC-19','SC-20','SC-21','SC-22','SC-23','SC-24','SC-25','SD-20',
  'SD-21','SD-22','SD-23','SD-24','SE-21','SE-22','SE-23','SE-24','SF-21',
  'SF-22','SF-23','SF-24','SG-21','SG-22','SG-23','SH-21','SH-22','SI-22',
  ];

// Exclude sheets reported with zero urban area in the Landsat Collection 9 check.
var zeroUrbanGrids = [
  "SF-24-Y-C",  "SA-23-V-B",  "NB-22-Y-D",  "NA-22-Y-C",  "NA-22-Y-A",  "NA-21-Z-B",  "NA-21-X-D",  "NA-21-Z-D",  "SA-21-X-A",  "NA-21-Z-C",  "NA-21-Z-A",  "NA-21-X-C",  "NA-21-Y-D",  "SA-21-V-B",  "NA-21-V-C",  "NB-21-Y-C",  "NB-20-Z-B",  "NB-20-Z-C",  "NB-20-Y-D",  "NB-20-Y-C",  "NA-20-V-A",  "NA-19-X-D",
  "NA-20-V-D",  "NA-20-V-B",  "NA-20-Z-A",  "SA-20-V-B",  "NA-20-Y-D",  "NA-20-Y-C",  "NA-20-Y-A",  "NA-19-Z-B",  "NA-19-Z-D",  "SA-19-X-A",  "NA-19-Z-C",  "NA-19-Z-A",  "NA-19-Y-D",  "NA-19-Y-B",  "NA-19-X-C",  "SC-19-Y-D",  "SC-19-X-A",  "SB-19-Z-C",  "SB-19-X-D",  "SB-19-V-C",  "SB-18-Z-B",  "SB-18-X-D",  
  "SA-19-V-D",  "SA-20-V-D",  "SA-20-Z-A",  "SB-20-X-A",  "SB-20-X-B",  "SB-20-Z-B",  "SB-20-X-C",  "SB-21-V-D",  "SB-21-Y-A",  "SC-21-V-B",  "SB-21-Y-D",  "SB-21-Z-C",  "SB-21-X-D",  "SA-21-V-D",  "SB-22-V-A",  "SB-22-V-B",  "SB-22-Y-D",  "SC-22-V-B",  "SC-22-V-A",  "SB-22-Y-C",  "SB-22-Y-A",  "SB-22-V-C",
  "SE-21-V-D",  "SE-20-X-B",  "SD-20-Z-D",  "SD-20-X-C",  "SF-21-V-B",
  'SE-21-Z-A', 'SE-21-Z-C','SD-21-V-A'
];

// Merge the threshold exports and remove sheets without urban reference area.
var thresholdGroupIds = ee.List.sequence(1, 12).getInfo();

var thresholdGrid = thresholdGroupIds.map(
  function(i){
     var name = 'Threshold_Grid-v'+ bestThresholdVersion + '_' + i + '_' + year;
    return ee.FeatureCollection(assetThreshold + name);
  });
thresholdGrid = ee.FeatureCollection(thresholdGrid).flatten();
var availableGrids = thresholdGrid.aggregate_array('grid').removeAll(zeroUrbanGrids);
thresholdGrid = thresholdGrid.filter(ee.Filter.inList('grid', availableGrids));

// Combine census, urban-area, and road-infrastructure evidence into one mask.
var spatialMask = function() {
  var agsn2010 = ee.Image('users/pedrassoli_julio/COL7/AGSN_2010_RASTER_MASK').remap([0],[1]).unmask();
  var agsn2020 = ee.Image('users/pedrassoli_julio/COL7/AGSN_2020_RASTER_MASK').remap([0],[1]).unmask();
  var setCens = ee.Image('users/pedrassoli_julio/COL7/SC_2010_URB_RASTER_MASK');
  var ibge_urbanareas2019 = ee.Image('users/pedrassoli_julio/MB-URB-COLLECTION-8/IBGE-URBAN-AREAS-2019/IBGE-URBAN-AREA-2019-FILLED-raster').byte();
  var irs = ee.ImageCollection('users/efjustiniano/IRS2023/IRS2023_v2').sum();
  var irsUrb = irs.gte(irs_threshold);

  var mask = ee.ImageCollection([
                     agsn2010.rename('spatialMask').toByte(),
                     agsn2020.rename('spatialMask').toByte(),
                     setCens.rename('spatialMask').toByte(),
                     ibge_urbanareas2019.rename('spatialMask').toByte(),
                     irsUrb.rename('spatialMask').toByte()
                   ]).max()
                   .multiply(irsUrb.rename('spatialMask').toByte())
                   .gte(1).unmask();
  return mask;
};

// Convert the binary mask to MapBiomas urban class 24.
var reclassImage = function(image_filt) {
  var image = image_filt.remap([0,1], [0,24]);
  return image.selfMask();
};


// Mosaic the probability tiles matching one year and supergrid.
var getInfraProbImage = function(year,grid) {
  var infraprob = ee.ImageCollection([]);
  
  probabilityAssets.forEach(function(assetPath){ 
    var result = ee.ImageCollection(assetPath)
                  .filter(ee.Filter.eq('year',year))
                  .filter(ee.Filter.eq('version',prob_version))
                  .filter(ee.Filter.stringContains('grid', grid));
    infraprob = infraprob.merge(result);
  });

  return infraprob.max();
};

// Export one annual supergrid classification.
var exportImage = function(image, supergridName, year){
  var imageName = supergridName + '-' + year + '-' + version;
  var region = ee.ImageCollection('projects/ee-bmm-mapbiomas/assets/Sentinel-Col-7/cartasBuffer')
                        .filter(ee.Filter.stringContains('grid', supergridName))
                        .geometry();
  
  Export.image.toAsset({
        "image": image,
        "assetId": outputAsset + '/' + imageName,
        "description": imageName,
        "region": region,
        "scale": 10,
        "maxPixels": 1e13,
        'pyramidingPolicy': {
              ".default": "mode"
          }
      });
};

// Threshold, mask, and export every configured supergrid.
supergrids.map(function (supergridName){
  var sg = thresholdGrid.filter(ee.Filter.stringContains('grid', supergridName));
  
      
  var img_grid = sg.map(function(grid){
      var grid_name = ee.String(grid.get('grid'));
      var bestProbThreshold = ee.Number(grid.get('bestProbThreshold'));
      var probImage = getInfraProbImage(year, grid_name).gte(bestProbThreshold).unmask();

      var getImageThreshold = probImage.multiply(spatialMask());
      var reclassIMG = reclassImage(getImageThreshold)
                        .select(['remapped'],['classification']).toByte();
      return reclassIMG;
  });

  img_grid = ee.ImageCollection(img_grid).mosaic()
                                         .set('year',year)
                                         .set('grid',supergridName)
                                         .set('version',version);

  exportImage(img_grid, supergridName, year);

  return img_grid;
});
});
