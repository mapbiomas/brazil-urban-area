// require with the block of collections
var batchCollections = require('users/edimilsonrodriguessantos/mapbiomas:mb_batch/collections.js')

// require with the block for prob
var resultsBatch = require('users/edimilsonrodriguessantos/mapbiomas:Col11/results/batchResults.js')
/*
this module contains the function below, facilitating the access to the probability classification by year (col11)
mosaicClassificationByYear (year) --> gets the prob classification by year (col11)
*/

// This will be used in the next few lines.
var join = ee.Join.saveAll({matchesKey: 'images'})

// here is a filter that we considered to combine the images 
// the "difference" refers to a quantity of years that were considered as temporal range
// for example: difference is 2, then the range is [years-2, years+2]
var filter = ee.Filter.maxDifference({
  difference: 2, 
  leftField: 'year',  
  rightField: 'year'
})

function getImageYear (year) {
  return ee.Image(resultsBatch.mosaicClassificationByYear (year)).rename('classification').unmask()
}

// this is the key part of the probability "harmonization" 
function temporalHarmonization (year){
    
    var years = yearsDict[year]
    
    // function to create a set of images considering the temporal range
    // and calculate the mean probability value
    function meanWithinMatchingImages (image){
      
      var year = image.get('year')
      
      var imgs = ee.ImageCollection.fromImages(image.get('images'))
      
      var meanResult = imgs.reduce(ee.Reducer.mean())
      
      return ee.Image(meanResult).toByte().set('year', year)
      
    }
    
    // 1) we create a colllection of images covering all the years
    var colToApplyAFilter = ee.ImageCollection(years.map(getImageYear))
    
    // 2) we combined this collection with itself to enable us to calculate the average
    // probability value in a time window.
    var joinedColl = join.apply(colToApplyAFilter, colToApplyAFilter, filter)
    
    // 3) here is the harmonized image collection
    var smoothedColl = ee.ImageCollection(joinedColl.map(meanWithinMatchingImages))
    
    return ee.Image(smoothedColl.filter(ee.Filter.eq('year', year)).first())
}

// this function applies a neighborhood filter to the image, using a circular kernel of radius 6 pixels. It first masks the image based on a threshold value, then reduces the neighborhood using the mean reducer, and finally reprojects the result to EPSG:4326 with a scale of 30 meters.
function neighborhoodFilter (image){
  
  var kernel = ee.Kernel.circle(6)
  
  var image = image.updateMask(image.gte(threshold.select('percentil').multiply(0.7)))
  
  var filtered = image.reduceNeighborhood({
    reducer: ee.Reducer.mean(),
    kernel: kernel
  }).reproject('EPSG:4326', null, 30);
  
  return filtered
}

// this dictionary contains the years that will be used to calculate the average probability value for each year. For example, for the year 1985, the average will be calculated using the years 1985, 1986, and 1987. For the year 1986, the average will be calculated using the years 1985, 1986, 1987, and 1988. This pattern continues for all years up to 2025.
var yearsDict = {
    1985: [1985, 1986, 1987,],
    1986: [1985, 1986, 1987, 1988,],
    1987: [1985, 1986, 1987, 1988, 1989,],
    1988: [1986, 1987, 1988, 1989, 1990,],
    1989: [1987, 1988, 1989, 1990, 1991,],
    1990: [1988, 1989, 1990, 1991, 1992,],
    1991: [1989, 1990, 1991, 1992, 1993,],
    1992: [1990, 1991, 1992, 1993, 1994,],
    1993: [1991, 1992, 1993, 1994, 1995,],
    1994: [1992, 1993, 1994, 1995, 1996,],
    1995: [1993, 1994, 1995, 1996, 1997,],
    1996: [1994, 1995, 1996, 1997, 1998,],
    1997: [1995, 1996, 1997, 1998, 1999,],
    1998: [1996, 1997, 1998, 1999, 2000,],
    1999: [1997, 1998, 1999, 2000, 2001,],
    2000: [1998, 1999, 2000, 2001, 2002,],
    2001: [1999, 2000, 2001, 2002, 2003,],
    2002: [2000, 2001, 2002, 2003, 2004,],
    2003: [2001, 2002, 2003, 2004, 2005,],
    2004: [2002, 2003, 2004, 2005, 2006,],
    2005: [2003, 2004, 2005, 2006, 2007,],
    2006: [2004, 2005, 2006, 2007, 2008,],
    2007: [2005, 2006, 2007, 2008, 2009,],
    2008: [2006, 2007, 2008, 2009, 2010,],
    2009: [2007, 2008, 2009, 2010, 2011,],
    2010: [2008, 2009, 2010, 2011, 2012,],
    2011: [2009, 2010, 2011, 2012, 2013,],
    2012: [2010, 2011, 2012, 2013, 2014,],
    2013: [2011, 2012, 2013, 2014, 2015,],
    2014: [2012, 2013, 2014, 2015, 2016,],
    2015: [2013, 2014, 2015, 2016, 2017,],
    2016: [2014, 2015, 2016, 2017, 2018,],
    2017: [2015, 2016, 2017, 2018, 2019,],
    2018: [2016, 2017, 2018, 2019, 2020,],
    2019: [2017, 2018, 2019, 2020, 2021,],
    2020: [2018, 2019, 2020, 2021, 2022,],
    2021: [2019, 2020, 2021, 2022, 2023,],
    2022: [2020, 2021, 2022, 2023, 2024,],
    2023: [2021, 2022, 2023, 2024, 2025,],
    2024: [2022, 2023, 2024, 2025,],
    2025: [2023, 2024, 2025,],
}

// ----------------------
// infrastrucure and roads index, used as a mask to avoid false positives in urban areas
var irs = ee.ImageCollection('users/efjustiniano/IRS2023/IRS2023_v2').sum()
// Map.addLayer(irs)

var threshold = ee.Image('projects/ee-ers/assets/mapbiomas/col11/thresholdMedianByCartaImg')
var mask = threshold.select('percentil').multiply(0.9)

// here is the main function of this module, which applies a pre-filter to the classification image for a given year. The pre-filtering process involves several steps, including temporal harmonization, neighborhood filtering, and applying rules based on probability values for different land cover classes (water, vegetation, and others). The final result is a masked image that highlights areas classified as urban for the specified year.
function applyPreFilter (year){
  
    var imgYear = getImageYear(year) 
    // Map.addLayer(imgYear, {min:0, max:100}, 'original')
    
    var avgYear = imgYear.gte(mask)
    // Map.addLayer(avgYear, {}, 'avgYear')
    
    var imgYearAvg = temporalHarmonization (year)
    // Map.addLayer(imgYearAvg, {min:0, max:100}, 'average')
    
    // var avgMasked = imgYearAvg.gte(mask)
    // // Map.addLayer(avgMasked, {}, 'avgMasked')
    
    // // ----------------------
    // // with neighborhood rule
    var imgYearAvgNeighb = neighborhoodFilter (imgYearAvg)
    // Map.addLayer(imgYearAvgNeighb, {min:0, max:100, palette:['yellow', 'orange', 'red']}, 'imgYearAvgNeighb')
    
    var avgMaskedNeighb = imgYearAvgNeighb.gte(mask)
    // Map.addLayer(avgMaskedNeighb, {}, 'avgMaskedNeighb')
    
    // ----------------------
    var imgProb = ee.Image(resultsBatch.getImgAllProbCol11 (year))
    // Map.addLayer(imgProb, {}, 'imgProb')
    
    var avgMaskedNeighb_opened = avgMaskedNeighb
        
        // rule for water
        .where(imgProb.select('water').gte(50).and(imgProb.select('urban').lte(20)), 0)
        
        // rule for vegetation
        .where(imgProb.select('veg').gte(60).and(imgProb.select('urban').lte(20)), 0)
        
        // rule for others
        .where(imgProb.select('other').gte(60).and(imgProb.select('urban').lte(20)), 0)
        
        .selfMask()
    
    if (year <= 2023){avgMaskedNeighb_opened = avgMaskedNeighb_opened.multiply(irs.gte(400))}
    
    return avgMaskedNeighb_opened.rename('classification_' + year)
}

exports.applyPreFilter = applyPreFilter