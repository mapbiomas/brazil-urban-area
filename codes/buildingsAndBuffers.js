/*  
======================================

### Get buildings with Buffer ###
contact: ma.hirye@alumni.usp.br

=======================================
*/

var assetPath = "projects/ee-mburb-land-c10/assets/Testes/Mask_Build_wBuf_v2";
var version = "v2";
var year = 2023;

var buf_building = 25;
var build_buf_hole = 5;
var build_buf_noise = 22;

var data_name = "buildings_bufferd_inCol9_resolution"
var desc = data_name + " - "+version+": Google Open Buildings v3 + buffer ("+buf_building+"), in MapBiomas Col9 pixels resolution, with closed holes (lte("+buf_building+") pixels) and erased noises (gte("+build_buf_noise+") pixels)";


/********** grid_1mi  **********/
var grid_1mi = ee.FeatureCollection("projects/ee-mburb/assets/BASES/Cartas_1mi_4326");
Map.addLayer(grid_1mi, {}, "grids", false);
print(grid_1mi);
var grids = grid_1mi.aggregate_array("grid_name");

/********** Brazilian territory **********/
var brasil = ee.FeatureCollection("users/mahirye_usp/LimBR_2019").map(function(feat){return feat.set("no", 1)});
print(brasil);

/********** Col 9 **********/
var Palettes = require('users/mapbiomas/modules:Palettes.js');
var palette = Palettes.get('classification9');
var col9 = ee.Image("projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1");
var col9_2023 = col9.select("classification_2023");//.clip(geometry);

/********** Buildings **********/
var buildings = ee.FeatureCollection("GOOGLE/Research/open-buildings/v3/polygons").filter('confidence >= 0.65');
var buildings_in_brazil = buildings.filterBounds(brasil);
// Map.addLayer(buildings_in_brazil, {}, "buildings_in_brazil", false);
var buildings_id = buildings_in_brazil.map(function(feat){return feat.set("building", 1).buffer(buf_building);});


/********** Create raster with buildings buffered **********/
var buildings_im = buildings_id.reduceToImage({properties:["building"],reducer:ee.Reducer.sum()}).toInt()//.clip(geometry);
// Map.addLayer(buildings_im, {}, "buildings_im", false);

var build_buf_inCol9res = col9_2023.gte(1).selfMask().remap([1],[0]).add(buildings_im).gte(1)
// Map.addLayer(build_buf_inCol9res.reproject({crs:'EPSG:4326', scale:30}), {min: 0, max: 100}, "build_buf_inCol9res", true);
// Map.addLayer(build_buf_inCol9res.selfMask().reproject({crs:'EPSG:4326', scale:30}), {}, "build_buf_inCol9res", true);



/********** Eliminate holes and noises **********/
var count_hole = build_buf_inCol9res
  .eq(0).selfMask()
  .connectedPixelCount({maxSize:build_buf_hole+1, eightConnected:false,});
// Map.addLayer(count_hole.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:thres_SF_hole+2, pallete:["white", "green"]}, "count_hole "+year, true);
// print("count_hole", count_hole);

var build_buf_inCol9res_NoHole = build_buf_inCol9res.where(count_hole.lte(build_buf_hole), 1).reproject({crs:'EPSG:4326', scale:30});
// Map.addLayer(im_au_year_SF_NoHole.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:1, pallete:["white", "orange"]}, "im_au_year_SF_NoHole "+year, true);
// print("im_au_year_SF_NoHole", im_au_year_SF_NoHole);
  
var count_noise = build_buf_inCol9res_NoHole
  .eq(1).selfMask()
  .connectedPixelCount({maxSize:build_buf_noise+1, eightConnected:false,});
// Map.addLayer(count_noise.reproject({crs:'EPSG:4326', scale:30}), {min:0, max:1, pallete:["white", "green"]}, "count_noise "+year, true);
// print("count_noise", count_noise);


//********** Export Images to Asset
// grids = ["NA-22"]
// grids.forEach (function(grid_name){
// grids_not_done.getInfo().forEach (function(grid_name){
grids.getInfo().forEach (function(grid_name){

  // var im_to_exp = buildings_rural_in15_in21_in25_2023
  var im_to_exp = build_buf_inCol9res.rename("buildbuff").unmask()
    .set('version', version)
    .set("description", desc)
    .set("grid_name", grid_name)
    .set("year", year)
  ;
  
  // Map.addLayer(im_to_exp.reproject({crs:'EPSG:4326', scale:30}).clip(grid_1mi.filter(ee.Filter.eq("grid_name",grid_name)).first().geometry()), {}, "im_to_exp", true);
  
  Export.image.toAsset({
    "image": im_to_exp.toByte(),
    "description": data_name + '_' + grid_name + '_' + version,
    "assetId": assetPath + "/" + data_name + '_' + grid_name + "_"+ version,
    "region": grid_1mi.filter(ee.Filter.eq("grid_name",grid_name)).first().geometry(),
    "scale": 30,
    "maxPixels": 1e13
  });

});

