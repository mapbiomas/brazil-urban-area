//// Function to Scaling factors - SR ////
exports.applyScaleFactors = function (image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  return image.addBands(opticalBands, null, true);
};


//// Function to Mask clouds - SR ////
exports.maskClouds_QA = function (image) {
  // Bits 4 and 3 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 4);
  var cloudsBitMask = (1 << 3);
  // Get the pixel QA band.
  var qa = image.select("QA_PIXEL");
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask);
};

 
//// Function to Mask clouds - Raw ////
function getQABits (image, start, end, newName) {
    // Compute the bits we need to extract.
    var pattern = 0;
    for (var i = start; i <= end; i++) {
       pattern += Math.pow(2, i);
    }
    // Return a single band image of the extracted QA bits, giving the band
    // a new name.
    return image.select([0], [newName])
                  .bitwiseAnd(pattern)
                  .rightShift(start);
}

function cloud_shadows(image) {
  // Select the QA band.
  var QA = image.select(['BQA']);
  // Get the internal_cloud_algorithm_flag bit.
  return getQABits(QA, 7,8, 'Cloud_shadows');
  // Return an image masking out cloudy areas.
}

function clouds (image) {
  // Select the QA band.
  var QA = image.select(['BQA']);
  // Get the internal_cloud_algorithm_flag bit.
  return getQABits(QA, 4,4, 'Cloud').neq(1);// Return an image masking out cloudy areas.
}

exports.maskClouds_BQA = function (image) {
  var cs = cloud_shadows(image);
  var c = clouds(image);
  image = image.updateMask(cs);
  return image.updateMask(c);
}

// Function to mask clouds using the quality band of Landsat 8.
exports.maskL_toa = function(image) {
  var qa = image.select('QA_PIXEL');
  /// Check that the cloud bit is off.
  // See https://www.usgs.gov/media/files/landsat-8-9-olitirs-collection-2-level-1-data-format-control-book
  var mask = qa.bitwiseAnd(1 << 3).eq(0);
  return image.updateMask(mask);
};

// Função - Mask clouds - Raw
// Landsat Collection 2 QA Bitmask
  exports.maskClouds_Raw = function (image) {
    return image.updateMask(image.select('QA_PIXEL').bitwiseAnd(parseInt('11010', 2)).eq(0));
  };
