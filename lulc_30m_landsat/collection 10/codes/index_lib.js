/* 
======================================

### Index Library  ###

=======================================
*/
var calcNDVI = function(image) {
  var out = image.expression(
  '(NIR - RED) / (NIR + RED)',{ 
      'NIR': image.select('NIR'), 
      'RED': image.select('RED')});
  return out.rename('NDVI');
};


//McFeeters, 1996 (https://doi.org/10.1080/01431169608948714)
var calcNDWIm = function(image) {  
  var out = image.expression(
  '(GREEN - NIR) / (GREEN + NIR)',{ 
      'GREEN': image.select('GREEN'), 
      'NIR': image.select('NIR')});
  return out.rename('NDWIm');
};


//Xu, 2005 (https://doi.org/10.1080/01431160600589179)
var calcMNDWI = function(image) { 
  var out = image.expression(
  '(GREEN - SWIR1) / (GREEN + SWIR1)',{ 
      'GREEN': image.select('GREEN'), 
      'SWIR1': image.select('SWIR1')});
  return out.rename('MNDWI');
};

// Calculate AWEI
var calcAWEIsh = function (image){// https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6111878/
  var out = image.expression(
    'BLUE + 2.5 * GREEN - 1.5 * (NIR + SWIR1) - 0.25 * SWIR2',{
      'BLUE': image.select('BLUE'),
      'GREEN': image.select('GREEN'),
      'NIR': image.select('NIR'),
      'SWIR1': image.select('SWIR1'),
      'SWIR2': image.select('SWIR2'),
    })
  return out.rename('AWEIsh')
}

// Zha et al., 2003
var calcNDBI = function(image){
  var out = image.expression(
  '(SWIR1 - NIR) / (SWIR1 + NIR)',{ 
      'SWIR1': image.select('SWIR1'), 
      'NIR': image.select('NIR')});
  return out.rename('NDBI');
}; 

var calcUI = function(image){
  var out = image.expression(
  '(SWIR2 - NIR) / (SWIR2 + NIR)',{ 
      'SWIR2': image.select('SWIR2'), 
      'NIR': image.select('NIR')});
  return out.rename('UI');
};


// apenas o sinal eh diferente do ndbi
var calcNDUI = function(image){
  var out = image.expression(
  '(NIR - SWIR1) / (NIR + SWIR1)',{ 
      'SWIR1': image.select('SWIR1'), 
      'NIR': image.select('NIR')});
  return out.rename('NDUI');
};


var calcBSI = function(image){
  var out = image.expression(
  '((SWIR1 + RED)-(NIR + BLUE))/((SWIR1 + RED)+(NIR + BLUE))',{ 
      'SWIR1': image.select('SWIR1'), 
      'RED': image.select('RED'), 
      'NIR': image.select('NIR'), 
      'BLUE': image.select('BLUE')});
  return out.rename('BSI');
};

// apenas o sinal eh diferente de UI
var calcNBR = function(image){
  var out = image.expression(
  '(NIR - SWIR2) / (NIR + SWIR2)',{ 
      'NIR': image.select('NIR'), 
      'SWIR2': image.select('SWIR2')});
  return out.rename('NBR');
};

// Calculate SAVI
var calcSAVI = function (image) {
  
  var out = image.expression(
    '((NIR-RED) / (NIR + RED + 0.5))*1.5',{
      'NIR': image.select('NIR'), 
      'RED': image.select('RED')}); 

  return out.rename('SAVI')
}


// De Pinho, C.M.D.; Ummus, M.E.; Novack, T. Extração De Feições Urbanas Em Imagens De Alta Resolução Espacial A Partir Do Estudo Do Comportamento Espectral Dos Alvos. Rev. Bras. De Cartogr. 2011, 63, 439–448.
//https://seer.ufu.br/index.php/revistabrasileiracartografia/article/download/49213/26178/202998
var calcNDRI = function(image){
  var out = image.expression(
  '(RED - BLUE) / (RED + BLUE)',{ 
      'RED': image.select('RED'), 
      'BLUE': image.select('BLUE')});
  return out.rename('NDRI');
}; 


// Santos, Bruno Dias dos, Carolina Moutinho Duque de Pinho, Gilberto Eidi Teramoto Oliveira, Thales Sehn Korting, Maria Isabel Sobral Escada, e Silvana Amaral. “Identifying Precarious Settlements and Urban Fabric Typologies Based on GEOBIA and Data Mining in Brazilian Amazon Cities”. Remote Sensing 14, nº 3 (janeiro de 2022): 704. 
// https://doi.org/10.3390/rs14030704
var calcBAI = function(image){
  var out = image.expression(
  '(BLUE - NIR) / (BLUE + NIR)',{ 
      'NIR': image.select('NIR'), 
      'BLUE': image.select('BLUE')});
  return out.rename('BAI');
}; 

/////// Non-normalized indexes ////////

var calcEVI = function(image) {
 var out = image.expression(
    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',{ 
      'NIR': image.select('NIR'),  
      'BLUE': image.select('BLUE'),
      'RED': image.select('RED')});
  return out.rename('EVI');
};


var calcEVI2 = function(image) {
 var out = image.expression(
    '2.5 * ((NIR - RED) / (NIR + 2.4 * RED + 1))',{ 
      'NIR': image.select('NIR'), 
      'RED': image.select('RED')});
  return out.rename('EVI2');
};


var calcBU = function(image){
  var out = image.expression(
  'NDBI - NDVI', {
    'NDBI': image.select('NDBI'), 
    'NDVI': image.select('NDVI')});
  return image.addBands(out.rename('BU'));
};


// //////// Index with thermal bands (DN) //////// 
// var calcEBBI = function(image) {
//   var out = image.expression(
//     '((MIR - NIR) / (10 * ((MIR + TIR)**0.5)))',{ 
//       'MIR': image.select('MIR'), 
//       'NIR': image.select('NIR'), 
//       'TIR': image.select('TIR')});
//   return out.rename('EBBI');
// };

//////// Index with thermal bands (DN) //////// 
var calcEBBI = function(image) {
  var out = image.expression(
    '((MIR - NIR) / (10 * ((MIR + TIR)**0.5)))',{ 
      'MIR': image.select('MIR'), 
      'NIR': image.select('NIR'), 
      'TIR': image.select('TIR')});
  return out.rename('EBBI');
};

// mistura espectral
var calcSMA = function (image) {
  var endmembers = [
      [119.0, 475.0, 169.0, 6250.0, 2399.0, 675.0], /*gv*/
      [1514.0, 1597.0, 1421.0, 3053.0, 7707.0, 1975.0], /*npv*/
      [1799.0, 2479.0, 3158.0, 5437.0, 7707.0, 6646.0], /*soil*/
      [4031.0, 8714.0, 7900.0, 8989.0, 7002.0, 6607.0] /*cloud*/
  ];
  var endmembers_sEscal = [
      [0.0119, 0.0475, 0.0169, 0.6250, 0.2399, 0.0675], /*gv*/
      [0.1514, 0.1597, 0.1421, 0.3053, 0.7707, 0.1975], /*npv*/
      [0.1799, 0.2479, 0.3158, 0.5437, 0.7707, 0.6646], /*soil*/
      [0.4031, 0.8714, 0.7900, 0.8989, 0.7002, 0.6607] /*cloud*/
  ];
  var bandNames = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2'];
  //var bandNames = ['B2', 'B3', 'B4', 'B8', 'B11', 'B12'];
  var outBandNames = ['GV', 'NPV', 'SOIL', 'CLOUD'];
  // uminxing data
  var fractions = ee.Image(image)
      .select(bandNames)
      .unmix(endmembers_sEscal)
      .max(0)
      .multiply(100)
      .byte();
  fractions = fractions.rename(outBandNames);
  // get shade and gvs
  var summed = fractions.expression('b("GV") + b("NPV") + b("SOIL")');
  var shd = summed.subtract(100).abs().byte();
  var gvs = fractions.select("GV")
      .divide(summed)
      .multiply(100)
      .toUint16()
      .byte();
  var out = fractions.addBands(gvs.rename("GVS").addBands(shd.rename("SHADE")));
  return out.copyProperties(image);
};

// ndfi
var calcNDFI = function (image) {
  var gvs = image.select("GVS");
  var npvSoil = image.expression('b("NPV") + b("SOIL")');
  var ndfi = ee.Image.cat(gvs, npvSoil)
      .normalizedDifference()
      .rename('NDFI');
  // rescale NDFI from 0 until 2000
  var NDFI = ndfi.expression('byte(b("NDFI") * 100 + 100)');
  return NDFI.copyProperties(image);
};

var calcSMASmall = function (image) {
  var endmembers_SR = [
    [0.178,0.337,0.458,0.559,0.683,0.645], /*Substrate*/
    [0.030,0.060,0.031,0.669,0.240,0.096], /*Vegetation*/
    [0.019,0.010,0.005,0.007,0.003,0.002] /*Dark*/];
  var bandNames = ['BLUE', 'GREEN', 'RED', 'NIR', 'SWIR1', 'SWIR2'];
  var outBandNames = ['SUBS', 'VEG', 'DARK'];
  // uminxing data
  var fractions = ee.Image(image).select(bandNames)
      .unmix(endmembers_SR, true, false)
      .max(0)
      .multiply(100)
      .byte();
  return fractions.rename(outBandNames);
};


/////// Exportação das funções ///////
exports.calcNDVI = calcNDVI;
exports.calcEVI = calcEVI;
exports.calcEVI2 = calcEVI2;
exports.calcMNDWI = calcMNDWI;
exports.calcNDWIm = calcNDWIm;
exports.calcAWEIsh = calcAWEIsh;

exports.calcNDBI = calcNDBI;
exports.calcUI = calcUI;
exports.calcNDUI = calcNDUI;
exports.calcBSI = calcBSI;
exports.calcNBR = calcNBR;
exports.calcNDRI = calcNDRI;
exports.calcBAI = calcBAI;
exports.calcBU = calcBU;
exports.calcSAVI = calcSAVI

exports.calcEBBI = calcEBBI;
exports.calcSMA = calcSMA
exports.calcNDFI = calcNDFI
exports.calcSMASmall = calcSMASmall