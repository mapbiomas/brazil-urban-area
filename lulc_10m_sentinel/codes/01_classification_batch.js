/**
 * Trains tile-specific Random Forest models with annual Satellite Embeddings
 * and exports urban probability images to Google Earth Engine assets.
 */

// Define the 1:250,000 map sheets processed by this batch.
var gridList = [
  "NA-19-Z-B",
  "NA-19-Z-D",
  "NA-19-Z-C",
  "NA-19-Z-A",
  "NA-19-Y-D",
  "NA-19-Y-B",
  "NA-20-V-A",
  "NA-20-V-D",
  "NA-20-V-B",
  "NA-20-Y-D",
  "NA-20-Y-C",
  "NA-20-Y-A",
  "NA-20-Z-D",
  "NA-20-Z-B",
  "NA-20-X-B",
  "NA-20-X-A",
  "NA-20-X-C",
  "NA-20-Z-A",
  "NA-20-X-D",
  "NA-21-Z-C",
  "NA-21-Z-A",
  "NA-21-X-C",
  "NA-21-Y-D",
  "NA-21-Y-C",
  "NA-21-Y-A",
  "NA-21-V-C",
  "NA-21-V-A",
  "NA-21-Z-B",
  "NA-21-X-D",
  "NA-21-Z-D",
  "NA-22-V-B",
  "NA-22-X-C",
  "NA-22-Z-A",
  "NA-22-Z-C",
  "NA-22-Y-D",
  "NA-22-Y-C",
  "NA-22-Y-B",
  "NA-22-Y-A",
  "NA-22-V-D",
  "NB-20-Y-D",
  "NB-20-Y-C",
  "NB-20-Z-D",
  "NB-20-Z-B",
  "NB-20-Z-C",
  "NB-21-Y-C",
  "NB-22-Y-D",
  "SA-19-X-B",
  "SA-19-X-A",
  "SA-19-V-D",
  "SA-19-Y-B",
  "SA-19-Y-D",
  "SA-19-Z-A",
  "SA-19-Z-C",
  "SA-19-Z-D",
  "SA-19-Z-B",
  "SA-19-X-D",
  "SA-20-V-B",
  "SA-20-V-A",
  "SA-20-V-C",
  "SA-20-Y-A",
  "SA-20-V-D",
  "SA-20-Y-D",
  "SA-20-Y-C",
  "SA-20-X-B",
  "SA-20-X-A",
  "SA-20-X-C",
  "SA-20-X-D",
  "SA-20-Z-A",
  "SA-20-Z-B",
  "SA-20-Z-C",
  "SA-20-Z-D",
  "SA-21-X-A",
  "SA-21-V-B",
  "SA-21-V-A",
  "SA-21-Z-C",
  "SA-21-Z-A",
  "SA-21-Y-D",
  "SA-21-Y-B",
  "SA-21-Y-A",
  "SA-21-V-D",
  "SA-21-V-C",
  "SA-21-X-C",
  "SA-21-Z-D",
  "SA-21-Z-B",
  "SA-21-X-D",
  "SA-21-Y-C",
  "SA-22-X-B",
  "SA-22-X-A",
  "SA-22-V-B",
  "SA-22-V-A",
  "SA-22-V-C",
  "SA-22-Y-C",
  "SA-22-Y-A",
  "SA-22-V-D",
  "SA-22-Z-A",
  "SA-22-Z-C",
  "SA-22-X-C",
  "SA-22-X-D",
  "SA-22-Z-D",
  "SA-22-Z-B",
  "SA-22-Y-B",
  "SA-22-Y-D",
  "SA-23-V-A",
  "SA-23-V-C",
  "SA-23-Y-A",
  "SA-23-Y-C",
  "SA-23-Y-D",
  "SA-23-Z-C",
  "SA-23-Z-D",
  "SA-23-Z-B",
  "SA-23-X-C",
  "SA-23-Z-A",
  "SA-23-Y-B",
  "SA-23-V-D",
  "SA-23-V-B",
  "SA-24-Y-C",
  "SA-24-Y-D",
  "SA-24-Z-C",
  "SA-24-Y-B",
  "SA-24-Y-A",
  "SB-18-Z-B",
  "SB-18-X-D",
  "SB-18-Z-D",
  "SB-19-V-B",
  "SB-19-V-C",
  "SB-19-V-A",
  "SB-19-Z-C",
  "SB-19-Y-D",
  "SB-19-Z-D",
  "SB-19-Z-A",
  "SB-19-X-D",
  "SB-19-X-B",
  "SB-19-Y-B",
  "SB-19-Y-C",
  "SB-19-Y-A",
  "SB-20-V-B",
  "SB-20-V-A",
  "SB-20-V-D",
  "SB-20-Y-B",
  "SB-20-Y-D",
  "SB-20-Y-C",
  "SB-20-X-A",
  "SB-20-X-B",
  "SB-20-Z-A",
  "SB-20-Z-C",
  "SB-20-Z-D",
  "SB-20-Z-B",
  "SB-20-X-C",
  "SB-20-X-D",
  "SB-21-V-A",
  "SB-21-V-D",
  "SB-21-Y-A",
  "SB-21-Y-B",
  "SB-21-Y-C",
  "SB-21-Y-D",
  "SB-21-Z-A",
  "SB-21-Z-C",
  "SB-21-X-C",
  "SB-21-X-A",
  "SB-21-Z-D",
  "SB-21-Z-B",
  "SB-21-X-D",
  "SB-21-X-B",
  "SB-22-V-A",
  "SB-22-V-B",
  "SB-22-X-A",
  "SB-22-X-B",
  "SB-22-X-C",
  "SB-22-X-D",
  "SB-22-Z-D",
  "SB-22-Z-B",
  "SB-22-Z-A",
  
  // Batch group 2.
  "SB-22-Z-C",
  "SB-22-Y-D",
  "SB-22-Y-C",
  "SB-22-Y-B",
  "SB-22-Y-A",
  "SB-22-V-D",
  "SB-22-V-C",
  "SB-23-V-C",
  "SB-23-V-A",
  "SB-23-Y-A",
  "SB-23-Y-C",
  "SB-23-Z-D",
  "SB-23-Z-C",
  "SB-23-Y-D",
  "SB-23-Y-B",
  "SB-23-Z-A",
  "SB-23-Z-B",
  "SB-23-X-D",
  "SB-23-X-C",
  "SB-23-V-D",
  "SB-23-X-A",
  "SB-23-V-B",
  "SB-23-X-B",
  "SB-24-Y-C",
  "SB-24-V-C",
  "SB-24-V-A",
  "SB-24-V-B",
  "SB-24-V-D",
  "SB-24-Y-A",
  "SB-24-Y-B",
  "SB-24-Y-D",
  "SB-24-Z-C",
  "SB-24-Z-B",
  "SB-24-Z-D",
  "SB-24-X-B",
  "SB-24-X-A",
  "SB-24-X-C",
  "SB-24-Z-A",
  "SB-24-X-D",
  "SB-25-V-C",
  "SB-25-Y-A",
  "SB-25-Y-C",
  "SC-18-X-B",
  "SC-18-X-D",
  "SC-19-Y-D",
  "SC-19-Y-B",
  "SC-19-V-D",
  "SC-19-Z-A",
  "SC-19-X-C",
  "SC-19-Z-B",
  "SC-19-X-D",
  "SC-19-X-B",
  "SC-19-X-A",
  "SC-19-V-B",
  "SC-19-V-A",
  "SC-19-V-C",
  "SC-19-Z-C",
  "SC-20-V-C",
  "SC-20-V-D",
  "SC-20-V-B",
  "SC-20-Y-B",
  "SC-20-Y-D",
  "SC-20-Y-C",
  "SC-20-Y-A",
  "SC-20-X-A",
  "SC-20-X-C",
  "SC-20-X-D",
  "SC-20-Z-B",
  "SC-20-Z-D",
  "SC-20-Z-C",
  "SC-20-Z-A",
  "SC-21-V-C",
  "SC-21-V-B",
  "SC-21-V-D",
  "SC-21-Y-D",
  "SC-21-Z-C",
  "SC-21-Z-A",
  "SC-21-X-C",
  "SC-21-Y-B",
  "SC-21-Y-C",
  "SC-21-Y-A",
  "SC-21-X-B",
  "SC-21-X-D",
  "SC-21-Z-B",
  "SC-21-Z-D",
  "SC-22-X-B",
  "SC-22-X-A",
  "SC-22-V-B",
  "SC-22-V-A",
  "SC-22-V-C",
  "SC-22-Y-A",
  "SC-22-Y-C",
  "SC-22-Y-B",
  "SC-22-Y-D",
  "SC-22-Z-C",
  "SC-22-Z-A",
  "SC-22-X-C",
  "SC-22-V-D",
  "SC-22-X-D",
  "SC-22-Z-D",
  "SC-22-Z-B",
  "SC-23-V-C",
  "SC-23-V-A",
  "SC-23-Y-C",
  "SC-23-Z-C",
  "SC-23-Y-D",
  "SC-23-Z-A",
  "SC-23-Y-B",
  "SC-23-X-C",
  "SC-23-V-D",
  "SC-23-Z-B",
  "SC-23-Z-D",
  "SC-23-X-D",
  "SC-23-X-B",
  "SC-23-X-A",
  "SC-23-V-B",
  "SC-23-Y-A",
  "SC-24-X-D",
  "SC-24-Z-B",
  "SC-24-Z-D",
  "SC-24-X-B",
  "SC-24-X-A",
  "SC-24-X-C",
  "SC-24-V-B",
  "SC-24-V-D",
  "SC-24-Z-A",
  "SC-24-Y-B",
  "SC-24-Z-C",
  "SC-24-Y-D",
  "SC-24-Y-C",
  "SC-24-Y-A",
  "SC-24-V-C",
  "SC-24-V-A",
  "SC-25-V-A",
  "SC-25-V-C",
  "SD-20-V-B",
  "SD-20-Z-D",
  "SD-20-Z-B",
  "SD-20-X-B",
  "SD-20-X-D",
  "SD-20-X-C",
  "SD-20-X-A",
  "SD-21-X-B",
  "SD-21-X-D",
  "SD-21-Z-D",
  "SD-21-Z-B",
  "SD-21-Y-C",
  "SD-21-Y-D",
  "SD-21-Y-A",
  "SD-21-Y-B",
  "SD-21-V-D",
  "SD-21-X-C",
  "SD-21-Z-A",
  "SD-21-Z-C",
  "SD-21-X-A",
  "SD-21-V-B",
  "SD-21-V-C",
  "SD-22-V-A",
  "SD-22-V-C",
  "SD-22-V-B",
  "SD-22-V-D",
  "SD-22-X-A",
  "SD-22-X-B",
  "SD-22-X-C",
  "SD-22-X-D",
  "SD-22-Z-A",
  "SD-22-Z-B",
  "SD-22-Z-C",
  "SD-22-Z-D",
  "SD-22-Y-D",
  "SD-22-Y-C",
  "SD-22-Y-B",
  "SD-22-Y-A",
  
  // Batch group 3.
  "SD-23-X-B",
  "SD-23-X-D",
  "SD-23-Z-B",
  "SD-23-Z-D",
  "SD-23-Z-A",
  "SD-23-Z-C",
  "SD-23-Y-D",
  "SD-23-Y-B",
  "SD-23-X-C",
  "SD-23-V-D",
  "SD-23-V-B",
  "SD-23-X-A",
  "SD-23-V-A",
  "SD-23-Y-A",
  "SD-23-V-C",
  "SD-23-Y-C",
  "SD-24-X-A",
  "SD-24-V-B",
  "SD-24-X-C",
  "SD-24-Z-C",
  "SD-24-Y-B",
  "SD-24-Z-A",
  "SD-24-V-D",
  "SD-24-V-A",
  "SD-24-V-C",
  "SD-24-Y-A",
  "SD-24-Y-C",
  "SD-24-Y-D",
  "SE-20-X-B",
  "SE-21-X-B",
  "SE-21-X-A",
  "SE-21-V-B",
  "SE-21-V-A",
  "SE-21-X-D",
  "SE-21-Z-B",
  "SE-21-Y-B",
  "SE-21-V-D",
  "SE-21-Y-D",
  "SE-21-Z-D",
  "SE-22-X-B",
  "SE-22-X-A",
  "SE-22-V-B",
  "SE-22-V-A",
  "SE-22-X-D",
  "SE-22-X-C",
  "SE-22-V-D",
  "SE-22-Y-B",
  "SE-22-Y-A",
  "SE-22-V-C",
  "SE-22-Y-C",
  "SE-22-Z-C",
  "SE-22-Z-A",
  "SE-22-Y-D",
  "SE-22-Z-B",
  "SE-22-Z-D",
  "SE-23-V-B",
  "SE-23-V-A",
  "SE-23-X-A",
  "SE-23-X-B",
  "SE-23-Y-D",
  "SE-23-Z-C",
  "SE-23-Z-D",
  "SE-23-Z-A",
  "SE-23-Y-B",
  "SE-23-X-C",
  "SE-23-V-D",
  "SE-23-X-D",
  "SE-23-Z-B",
  "SE-23-V-C",
  "SE-23-Y-A",
  "SE-23-Y-C",
  "SE-24-X-A",
  "SE-24-V-B",
  "SE-24-V-A",
  "SE-24-Y-C",
  "SE-24-V-C",
  "SE-24-Y-B",
  "SE-24-V-D",
  "SE-24-Y-D",
  "SE-24-Y-A",
  "SF-21-Z-A",
  "SF-21-Z-B",
  "SF-21-X-C",
  "SF-21-X-D",
  "SF-21-Y-B",
  "SF-21-V-D",
  "SF-21-V-B",
  "SF-21-X-A",
  "SF-21-Z-C",
  "SF-21-Z-D",
  "SF-21-X-B",
  "SF-22-V-A",
  "SF-22-V-C",
  "SF-22-Y-A",
  "SF-22-V-D",
  "SF-22-V-B",
  "SF-22-Y-B",
  "SF-22-X-C",
  "SF-22-Z-A",
  "SF-22-X-A",
  "SF-22-X-B",
  "SF-22-X-D",
  "SF-22-Z-B",
  "SF-22-Y-C",
  "SF-22-Y-D",
  "SF-22-Z-C",
  "SF-22-Z-D",
  "SF-23-Z-B",
  "SF-23-X-D",
  "SF-23-X-C",
  "SF-23-V-D",
  "SF-23-X-A",
  "SF-23-V-B",
  "SF-23-V-A",
  "SF-23-V-C",
  "SF-23-Y-A",
  "SF-23-Z-C",
  "SF-23-Z-D",
  "SF-23-Y-C",
  "SF-23-Z-A",
  "SF-23-Y-B",
  "SF-23-X-B",
  "SF-23-Y-D",
  "SF-24-Y-A",
  "SF-24-V-A",
  "SF-24-V-B",
  "SF-24-V-C",
  "SF-24-Y-C",
  "SG-21-Z-D",
  "SG-21-X-D",
  "SG-21-X-B",
  "SG-22-X-A",
  "SG-22-X-B",
  "SG-22-X-C",
  "SG-22-X-D",
  "SG-22-Z-B",
  "SG-22-Z-D",
  "SG-22-Z-A",
  "SG-22-Y-D",
  "SG-22-Y-B",
  "SG-22-Y-C",
  "SG-22-Y-A",
  "SG-22-V-D",
  "SG-22-V-B",
  "SG-22-V-A",
  "SG-22-V-C",
  "SG-22-Z-C",
  "SG-23-V-B",
  "SG-23-V-A",
  "SG-23-V-C",
  "SH-21-Y-B",
  "SH-21-V-D",
  "SH-21-X-A",
  "SH-21-X-C",
  "SH-21-X-D",
  "SH-21-X-B",
  "SH-21-Z-B",
  "SH-21-Z-D",
  "SH-21-Z-C",
  "SH-21-Z-A",
  "SH-22-X-A",
  "SH-22-V-B",
  "SH-22-V-A",
  "SH-22-V-C",
  "SH-22-Y-A",
  "SH-22-Y-C",
  "SH-22-Z-C",
  "SH-22-Z-A",
  "SH-22-X-C",
  "SH-22-V-D",
  "SH-22-X-B",
  "SH-22-X-D",
  "SH-22-Y-D",
  "SH-22-Y-B",
  "SI-22-V-A",
  "SI-22-V-C",
  "SI-22-V-B"
  ]

// Select all 64 AlphaEarth embedding dimensions used by the classifier.
var bands = [
  'A00','A01','A02','A03','A04','A05','A06','A07',
  'A08','A09','A10','A11','A12','A13','A14','A15',
  'A16','A17','A18','A19','A20','A21','A22','A23',
  'A24','A25','A26','A27','A28','A29','A30','A31',
  'A32','A33','A34','A35','A36','A37','A38','A39',
  'A40','A41','A42','A43','A44','A45','A46','A47',
  'A48','A49','A50','A51','A52','A53','A54','A55',
  'A56','A57','A58','A59','A60','A61','A62','A63'
];

// Configure the training samples and annual embedding collection.
var urbSamples = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/Urb';
var notUrbSamples = 'projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA9/SAMPLES/NUrb';
var ebd = ee.ImageCollection('GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL');

// Load the map-sheet boundaries used for context and export regions.
var mapSheets = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas');
var cartasHex = ee.FeatureCollection('projects/ee-mburb-land/assets/LandsatCol9_Inputs/Cartas_250mil_Hex');

// Build the annual embedding mosaic that intersects the processing context.
function getMosaic(year, roi){
  var yearlyEmbedding = ebd
  .filterDate(ee.Date.fromYMD(year,1,1), ee.Date.fromYMD(year+1,1,1))
  .filterBounds(roi)
  .mosaic();
  
  return yearlyEmbedding;
}

// Train a probability-mode Random Forest and scale probabilities to 0-100.
function classifying (bands, samples, ntree, image_class){

  var classifier = ee.Classifier.smileRandomForest({
    numberOfTrees: ntree,
    minLeafPopulation: 5
  })
  .train({
    'features':samples,
    'classProperty':'value',
    'inputProperties':bands
  })
  .setOutputMode('PROBABILITY');

  var classified = image_class.classify(classifier);
  
  return classified.multiply(100).byte();

}


// Return the neighboring training context and the central classification tile.
function getContext (grid){
  
  var ft = ee.FeatureCollection(cartasHex.filter(ee.Filter.eq('grid_name', grid))).geometry();
  
  var targetSheet = ee.Feature(mapSheets.filter(ee.Filter.eq('grid_name', grid)).first());
  
  var filtered = ee.FeatureCollection(mapSheets.filterBounds(targetSheet.geometry().buffer(2, 1)));
  
  return [
    // Neighboring sheets used to select training samples.
    filtered,
    
    // Central tile used to clip the output.
    ft
    ]
}

// Sample the embeddings, train the model, and classify the target tile.
function classification (year, context, regionToClassify, samples, bands){
  
  var mosaic = getMosaic(year, context);
  
  var samplesTrained = getFeatureSpace(mosaic, samples);
  
  var imgClassified = classifying(bands, samplesTrained, 120, mosaic.clip(regionToClassify));
  
  return imgClassified;
}

// Attach embedding values to the labeled training points.
function getFeatureSpace (image, samples){

  var samplesWithProperties = image.sampleRegions({
    collection:samples,
    properties: ['value'],
    scale: 10,
    tileScale: 10
  });

  return ee.FeatureCollection(samplesWithProperties);

}

// Balance the training classes and run one annual tile classification.
function classificationAnalysis (year, context, regionToClassify, sampleSize, bands){
  
  if (year > 2022){
    
    var sampleYear = 2022;
    
  } else {
    
    var sampleYear = year;
  }
  
  // Load and limit urban training samples within the neighboring context.
  var urbSamplesFc = ee.FeatureCollection(urbSamples + "/Samples_Urb_Train_v5_" + sampleYear);
  
  var urbToClassify = urbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .limit(sampleSize);
  
  // Load twice as many non-urban samples to preserve the configured balance.
  var notUrbSamplesFc = ee.FeatureCollection(notUrbSamples +"/Samples_NUrb_Train_v5_" + sampleYear);
  
  var notUrbToClassify = notUrbSamplesFc
  .filterBounds(context)
  .randomColumn().sort('random')
  .limit(sampleSize*balance);
  

  var samplesToclassify = urbToClassify.merge(notUrbToClassify);

  
  var imgClassified = classification(year, context, regionToClassify, samplesToclassify, bands);
  

  return ee.Image(imgClassified).toByte();
} 

// Configure the production years, metadata, sampling, and output collection.
var years = ee.List.sequence(2016, 2025).getInfo();
var prob_version = 1;
var col = 3;
var samples_version = 5;
var desc = 'Urban probability from Landsat-derived samples and embeddings';
var imgColToExport = 'projects/ee-breno-mb/assets/S2-URB-PROB-Col3/';
var sampleSize = 250;
var balance = 2;

gridList.forEach(function (carta){
  
  // Define the training context and target geometry for the current tile.
  var context = ee.FeatureCollection(getContext(carta)[0]).geometry().bounds(10);
  var regionToClassify = ee.Feature(getContext(carta)[1]).geometry();
  
  // Classify and export each configured year.
  years.forEach(function (year){
    
    var result = classificationAnalysis(year, context, regionToClassify, sampleSize, bands)
    // Attach publication metadata to the probability image.
    .set('territory', 'BRAZIL')
    .set('theme', 'Urban Area')
    .set('version', prob_version)
    .set('source', 'GT URBANO')
    .set('collection_id', col)
    .set('year', year)
    .set('grid', carta)
    .set('samples_version', samples_version)
    .set('description', desc);

    var description = 'classification_' + year + '_' + carta + '_v' + prob_version;
    var assetId = imgColToExport + description;

    Export.image.toAsset({
      image: result, 
      description: description, 
      assetId: assetId, 
      region: regionToClassify, 
      scale: 10, 
      maxPixels: 1e13
    });
  
  });
  
});


