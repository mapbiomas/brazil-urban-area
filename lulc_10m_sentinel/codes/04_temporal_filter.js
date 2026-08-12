/**
 * Applies temporal consistency and consolidation rules to annual urban maps,
 * then exports one image per year and supergrid.
 */

// Configure the input map sheets and asset collections.
var mapSheets = ee.FeatureCollection('projects/mapbiomas-workspace/AUXILIAR/cartas');

var inputAssets = [
  'projects/ee-breno-mb/assets/Sentinel-Col3/Sentinel_SF'
];
 
var outputAsset = 'projects/ee-breno-mb/assets/Sentinel-Col3/Sentinel_TF';
var inputVersions = [1];
var outputVersion = 2;

// Define the supergrids processed in this run.
var supergrids = [
  'NA-20','NA-21','NA-22','NB-20','SA-19','SA-20','SA-21','SA-22','SA-23',
  'SA-24','SB-18','SB-19','SB-20','SB-21','SB-22','SB-23','SB-24','SB-25',
  'SC-18','SC-19','SC-20','SC-21','SC-22','SC-23','SC-24','SC-25','SD-20',
  'SD-21','SD-22','SD-23','SD-24','SE-21','SE-22','SE-23','SE-24','SF-21',
  'SF-23','SF-24','SG-21','SG-22','SG-23','SH-21','SH-22','SI-22',

];

var n = 24;
var year_list = ee.List.sequence(2016, 2025).getInfo();
var years_mid = ee.List.sequence(2017, 2024).getInfo().reverse();
var first_years = [2016];
var last_years = [2025];  

// Use the previous Landsat year to anchor the first Sentinel year.
var landsat = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection10/mapbiomas_brazil_collection10_integration_v2');

supergrids.forEach(function(supergridName){
    
  var imc = ee.ImageCollection([]);
  inputAssets.forEach(function(assetPath){ 
    var result = ee.ImageCollection(assetPath)
                    .filter(ee.Filter.inList('version',inputVersions));
    imc = imc.merge(result);
  });
  
  print('Input images ' + supergridName, imc.size());
  
  var mosaic_sg = function(year){
    var col_sg = ee.List([]);
    
    var supergridFeatures = mapSheets.filter(ee.Filter.stringContains('grid_name', supergridName))
                       .map(function(ft){return ft.centroid();});
               
    var mosaic = ee.ImageCollection(imc.filterBounds(supergridFeatures.geometry())
                                       .filter(ee.Filter.eq('year', year)))
                                .max()
                                .set('grid', supergridName)
                                .set('year', year)
                                .set('version', outputVersion);
    col_sg = col_sg.add(mosaic);
    
    return ee.ImageCollection(col_sg);
  };
  
  var complete_col = ee.ImageCollection([]); 
  
  year_list.forEach(function (year){ 
    complete_col = complete_col.merge(mosaic_sg(year));
  });
  
  var inputAsset = complete_col;
  
  // Validate the first year with the preceding Landsat map and next Sentinel map.
  var filter_FY = first_years.map(function(year){
   
    var prev = year - 1
    var next = year + 1
    
  
    var year_prev = landsat.select('classification_' + prev).eq(n)
    var year_0 = inputAsset.filter(ee.Filter.eq('year',year)).max().eq(n).unmask()
    var year_next = inputAsset.filter(ee.Filter.eq('year',next)).max().eq(n).unmask()
  
    var cond_sum = ee.ImageCollection([year_prev,year_0,year_next])
                     .map(function(img){return img.rename('classification')})
                     .sum()
                     .gte(2)
                     .unmask()
                     .toByte()
                     .set('year', year)

    return cond_sum
  })

  // Keep middle-year urban pixels supported by two of three adjacent years.
  var filter_GR = years_mid.map(function(year){
    var prev = year - 1;
    var next = year + 1;
  
    var year_prev = inputAsset.filter(ee.Filter.eq('year', prev)).max().eq(n).unmask();
    var year_0 = inputAsset.filter(ee.Filter.eq('year', year)).max().eq(n).unmask();
    var year_next = inputAsset.filter(ee.Filter.eq('year', next)).max().eq(n).unmask();
  
    var cond_sum = ee.ImageCollection([year_prev, year_0, year_next])
                     .map(function(img){return img.rename('classification');})
                     .sum().gte(2).multiply(ee.Image(year_0))
                     .unmask()
                     .toByte()
                     .set('year', year);
  
    return cond_sum;
  }); 
  
  // Validate the last year with the two preceding Sentinel maps.
  var filter_LY = last_years.map(function(year){
    var prev2 = year - 2;
    var prev = year - 1;
  
    var year_prev2 = inputAsset.filter(ee.Filter.eq('year', prev2)).max().eq(n).unmask();
    var year_prev = inputAsset.filter(ee.Filter.eq('year', prev)).max().eq(n).unmask();
    var year_0 = inputAsset.filter(ee.Filter.eq('year', year)).max().eq(n).unmask();
    
    var cond_sum = ee.ImageCollection([year_prev2, year_prev, year_0])
                     .map(function(img){return img.rename('classification');})
                     .sum().gte(2).multiply(ee.Image(year_0))
                     .unmask()
                     .toByte()
                     .set('year', year);
  
    return cond_sum;
  });
  
  var inputFinal = ee.ImageCollection(filter_FY)
                      .merge(ee.ImageCollection(filter_LY))
                      .merge(ee.ImageCollection(filter_GR));
  
  var dict_year = ee.Dictionary({});
  
  year_list.forEach(function(year){
    var img = inputFinal.filter(ee.Filter.eq('year',year)).first();
    var key = 'classification_'+ year;
    dict_year = dict_year.set(key, img);
  });
  
  // Reapply the three-year majority rule to the intermediate results.
  years_mid.forEach(function(year){
    var next = year + 1;
    var prev = year - 1;
    
    var year_next = dict_year.get('classification_' + next);
    var year_0 = dict_year.get('classification_' + year);
    var year_prev = dict_year.get('classification_' + prev);
    
    var cond_sum = ee.ImageCollection([year_prev, year_next, year_0])
                   .sum().gte(2).multiply(ee.Image(year_0))
                   .toByte() 
                   .set('year', year);
    
    dict_year = dict_year.set('classification_'+year, cond_sum);                
  });
  
  
  // Require the first two years to persist through the next two observations.
  year_list.slice(0,2).forEach(function(year){
    var next2 = year + 2;
    var next = year + 1;
  
    var year_next2 = dict_year.get('classification_' + next2);
    var year_next = dict_year.get('classification_' + next);
    var year_0 = dict_year.get('classification_' + year);
    
    var cond_sum = ee.Image(year_0)
                   .multiply(ee.Image(year_next))
                   .multiply(ee.Image(year_next2))
                   .toByte() 
                   .set('year', year);
    
    dict_year = dict_year.set('classification_'+year, cond_sum);                
  });
  
  
  // Enforce persistence after the first validated urban occurrence.
  year_list.slice(1).forEach(function(year){
    var prev = year - 1;
  
    var year_0 = ee.Image(dict_year.get('classification_' + year));
    var year_prev = ee.Image(dict_year.get('classification_' + prev));
    
    var cond_sum = ee.ImageCollection([year_0, year_prev])
                   .max()
                   .toByte() 
                   .set('year', year);
    
    dict_year = dict_year.set('classification_'+year, cond_sum);                
  });

  // Assemble the consolidated annual images for export.
  var img_col_export = ee.List([]);
  
  year_list.forEach(function(year){
    var img = ee.Image(dict_year.get('classification_'+year))
               .selfMask()
               .rename('classification')
               .toByte() 
               .set('year',year);
    img_col_export = img_col_export.add(img); 
  });
  
  var region = ee.ImageCollection('projects/ee-bmm-mapbiomas/assets/Sentinel-Col-7/cartasBuffer')
                                .filter(ee.Filter.stringContains('grid', supergridName))
                                .geometry();

  // Convert binary values to class 24 and export each year.
  year_list.forEach(function(year){
    var img_year = ee.ImageCollection(img_col_export)
                     .filter(ee.Filter.eq('year', year))
                     .first()
                     .remap([0,1],[0,24])
                     .toByte() 
                     .set('year',year)
                     .set('grid', supergridName)
                     .set('version', outputVersion);
    
    var imageName = supergridName + '-' + year +'-'+ outputVersion;
    Export.image.toAsset({
        "image": img_year,
        "assetId": outputAsset + '/'+imageName,
        "description": imageName,
        "region": region,
        "scale": 10,
        "maxPixels": 1e13,
    });
  });

});
