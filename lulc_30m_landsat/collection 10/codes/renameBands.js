/** 
 * @name
 *      rename
 * @description
 *     Padroniza os nomes  das bandas de imagens landsat 5,7, e sentinel 2
 * @argument
 *      Objecto contendo o atributo
 *          @attribute key {String}
 * @example
 *      var bands_l7 = rename('l7');
 * @returns
 *      Dictionary
 */ 
var bandNames = {
 
 'l5': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'pixel_qa', 'B6'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'pixel_qa', 'temp']
  },
   'l5_7': {
      'bandNames':['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'sr_atmos_opacity', 'pixel_qa'],
      'newNames':  ['blue', 'green', 'red', 'nir', 'swir1', 'thermal', 'swir2', 'sr_atmos_opacity', 'pixel_qa']
  },
  
 'l7': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'pixel_qa', 'B6'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'pixel_qa', 'temp']
  },

  'l8' : {
      'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'pixel_qa', 'B11'],
      'newNames': ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'thermal', 'pixel_qa', 'temp']
  },
  
  'l5toa': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'QA_PIXEL', 'B6'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'BQA', 'temp']
  },
  
 'l7toa': {
      'bandNames': ['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'QA_PIXEL', 'B6_VCID_1'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'BQA', 'temp']
  },

  'l8toa' : {
      'bandNames': ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'QA_PIXEL', 'B11'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2', 'THERMAL', 'QA_PIXEL', 'temp']
  },
  
  //Landsat Collection 2
  'SR_LT05' : {
      'bandNames': ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2']
  },
  
  'SR_LE07' : {
      'bandNames': ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2']
  },
  
  'SR_LC08' : {
      'bandNames': ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2']
  },
  
  'SR_LC09' : {
      'bandNames': ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'],
      'newNames': ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2']
  },

  //Landsat raw images -
  'RawLT05' : {//Collection 1
      'bandNames': ['B4', 'B5', 'B6'],
      'newNames': ['NIR', 'MIR', 'TIR']
  },
  
  'RawLE07' : {
      'bandNames': ['B4', 'B5', 'B6_VCID_1'],
      'newNames': ['NIR', 'MIR', 'TIR']
  },
  
  'RawLC08' : {
      'bandNames': ['B5', 'B6', 'B10'],
      'newNames': ['NIR', 'MIR', 'TIR']
  },
  
  'RawLC09' : {
      'bandNames': ['B5', 'B6', 'B10'],
      'newNames': ['NIR', 'MIR', 'TIR']
  },
  
  //Sentinel images
  'sentinel2' : {
      'bandNames': ['B2','B3','B4','B8','B10','B11','B12','QA60'],
      'newNames': ['blue','green','red','nir','cirrus','swir1','swir2','BQA']
    },
  'sentinel2_2' : {
    'bandNames': ['blue','green','red','nir','cirrus','swir1','swir2','QA60'],
    'newNames': ['blue','green','red','nir','cirrus','swir1','swir2','BQA']
  },
   'sentinel2_SR' : {
    'bandNames': ['B2','B3','B4','B8','B11','B12','QA60'],
    'newNames': ['blue','green','red','nir','swir1','swir2','pixel_qa']
  }
};

exports.rename = function (key) {

    return bandNames[key];
};