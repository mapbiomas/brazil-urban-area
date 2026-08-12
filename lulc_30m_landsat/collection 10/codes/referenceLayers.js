/*  
======================================

### Post-processing - Get Spatial Mask ###
Collection: 10

=======================================
*/

var version = "v9"; 
var output_path = "projects/ee-mburb-land-c10/assets/Testes/Mask_Spatial_"+version;

var vers_build = "v2";
var thres_irs = 500;

var description = "Spatial Mask: im_buildings-wBuff (vers = "+vers_build+") + AreasUrbanizadas2019 (excl. Densa - Outros equipamentos urbanos [330] )  + IRS (thres="+thres_irs+") + Favelas (IBGE, 2020)"

var escala = 30;


/****** Functions ******/

var exp = function (IM, DESC, ID, REG, SC){
  Export.image.toAsset({
    image:  IM,
    description:  DESC,
    assetId:  ID,
    region:  REG,
    scale:  SC,
    maxPixels:  100000000000,
    pyramidingPolicy: {".default": "mode"},
  });
};

 

/****** Import data ******/
var BR = ee.FeatureCollection("projects/ee-mburb/assets/BASES/BR_BBOX_4326").first().geometry();


// Number of buildings per pixel 30m - Open Buildings
var col_buildings = ee.ImageCollection('projects/ee-mburb-land-c10/assets/Testes/Mask_Build_wBuf_'+vers_build);
var im_buildings = col_buildings.mosaic();
Map.addLayer(im_buildings, {}, "im_buildings", false);
// Map.addLayer(im_buildings.updateMask(im_buildings.lte(thres_build)).selfMask(), {palette:['white','f0ff4e','f54eff','2051ff','70000e','ffffff'], min:0, max:5}, "im_buildings", false);

// Área Urbanizadas 2019
var ibge_urbanareas2019 = ee.ImageCollection("projects/ee-mayhirye/assets/Bases_IBGE/AU2022_AreasUrbanizadas2019_Brasil_WGS84").mosaic();
// Map.addLayer(ibge_urbanareas2019.selfMask(), {}, "ibge_urbanareas2019", false); //poderia retirar outras feições de AU (equipamentos, p. ex)
var ibge_urbanareas2019_neq330 = ibge_urbanareas2019.neq(330); //330 = Densa - Outros equipamentos urbanos
// Map.addLayer(ibge_urbanareas2019_neq330.selfMask(), {}, "ibge_urbanareas2019_neq330", false);


// IRS 2023
var irs = ee.ImageCollection('users/efjustiniano/IRS2023/IRS2023_v2').sum()
var irsUrb = irs.gte(thres_irs) 
// Map.addLayer(irsUrb.selfMask(), {}, "irsUrb", false);

// AGSN 2010 and 2020
// var agsn2010 = ee.Image('users/pedrassoli_julio/COL7/AGSN_2010_RASTER_MASK').remap([0],[1]).unmask()
// Map.addLayer(agsn2010.selfMask(), {}, "agsn2010", false);
var agsn2020 = ee.Image('users/pedrassoli_julio/COL7/AGSN_2020_RASTER_MASK').remap([0],[1]).unmask()
// Map.addLayer(agsn2020.selfMask(), {}, "agsn2020", false);


/****** Create and Export the mask ******/

var spatialMask = ee.ImageCollection([
  im_buildings.byte().unmask().rename('spatialMask'),
  ibge_urbanareas2019_neq330.byte().unmask().rename('spatialMask'),
  // setCens_NRural_2020.byte().unmask().rename('spatialMask'),
  irs.gte(500).byte().unmask().rename('spatialMask'),
  // im_VIIRS.byte().unmask().rename('spatialMask'),
  agsn2020.byte().unmask().rename('spatialMask'),
  ]).max()
  // .multiply(irsUrb.rename('spatialMask').toByte())
  // .gte(1)
  ;

// Map.addLayer(spatialMask.selfMask(), {}, "spatialMask", false);
// Map.addLayer(spatialMask.gte(1).selfMask(), {palette:["white", "black"]}, "spatialMask", false);
exp (spatialMask, "spatialMask", output_path, BR, escala);
