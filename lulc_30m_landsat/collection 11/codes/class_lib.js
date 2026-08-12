//Training sample preparation
function getFeatureSpace (image, samples){

  var samplesWithProperties = image.sampleRegions({ 
    collection:samples,
    scale:30,
    geometries:true,
    tileScale:16
    });

  return ee.FeatureCollection(samplesWithProperties);

};

function classifying (bands, samples, ntree, image_class){

  var classifier = ee.Classifier.smileRandomForest({
    numberOfTrees: ntree,
    minLeafPopulation: 5,
    // seed:143,
  })
  .train({
    'features':samples,
    // 'classProperty':'value',
    'classProperty':'class',
    'inputProperties':bands
  })
  // .setOutputMode('PROBABILITY')
  .setOutputMode('MULTIPROBABILITY')

  // print("explain classifier", classifier.explain());
  var classified = image_class.classify(classifier);
  
  return classified.multiply(100).byte();

}; 



////////////////////////////////////////////////////////////
exports.classifying = classifying;
exports.getFeatureSpace = getFeatureSpace; 