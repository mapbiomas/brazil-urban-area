// info
var ranges = [
  // group 1
  '1985_to_2020',
  
  // group 2
  '1990_to_2020',
  
  // group 3
  '1995_to_2020',
  
  // group 4
  '2000_to_2020',
  
  // group 5
  '2005_to_2020',
  
  // group 6
  '2010_to_2020',
  
  // group 7
  '2015_to_2020',
  ]

// classes
var classValue = [
  
  // 1 = urban
  1,
  
  // 2 = forest formations
  2,
  
  // 3 = water
  3,
  
  // 4 = farming
  4
  
  ]

function getSamples (listOfAddress){
  
  var mergedCollection = ee.FeatureCollection(
    listOfAddress.map(function(address) {
      return ee.FeatureCollection(address);
    })
  ).flatten()
  
  return mergedCollection
}

exports.getSamples = getSamples

// get the list of years and the corresponding sample ranges
var dicToGetSamples = {};
var init = 1985, final = 2025;
var rangeYears = 8

for (var year = init; year <= final; year++) {

    // Calculate the starting year using integer division
    var startYear = Math.floor(year / rangeYears) * rangeYears;
    
    // Handle edge cases for years before 1990 and after 2015
    if (year <= 1985+rangeYears) {
        startYear = 1985;
    }
    
    dicToGetSamples[year] = startYear + '_to_2020';
}

// print(dicToGetSamples)
exports.dicToGetSamples = dicToGetSamples

// cartas das capitais
var capitais = [
  "SF-23-Y-D",
  "SF-23-Z-C",
  "SF-23-Z-D",
  "SF-23-Z-B",
  "SF-23-Z-A",
  "SF-23-X-A",
  "SE-23-Z-C",
  "SF-24-V-B",
  "SB-25-V-C",
  "SB-25-Y-C",
  "SC-25-V-A",
  "SC-25-V-C",
  "SC-24-Z-B",
  "SC-24-Z-D",
  "SD-24-X-A",
  "SD-24-X-C",
  "SB-23-X-D",
  "SB-23-X-B",
  "SA-24-Z-C",
  "SA-23-Z-A",
  "NA-22-Z-A",
  "NA-22-Z-C",
  "NA-22-Y-D",
  "SA-22-V-B",
  "NA-20-X-D",
  "NA-20-X-B",
  "SC-19-Y-B",
  "SC-19-Z-A",
  "SC-19-X-C",
  "SC-19-Z-B",
  "SC-19-X-D",
  "SA-20-X-D",
  "SA-20-Z-B",
  "SA-20-Z-D",
  "SB-20-Y-D",
  "SC-20-V-A",
  "SC-20-V-C",
  "SC-20-V-D",
  "SC-20-V-B",
  "SB-20-Z-C",
  "SC-20-X-A",
  "SA-21-Y-C",
  "SA-21-Y-A",
  "SA-22-X-D",
  "SC-22-X-D",
  "SC-22-Z-B",
  "SC-23-Y-A",
  "SD-22-Z-D",
  "SD-23-Y-C",
  "SE-23-V-A",
  "SE-22-X-B",
  "SD-21-Z-D",
  "SD-21-Z-C",
  "SC-20-Y-B",
  "SC-20-Y-A",
  "SF-21-X-D",
  "SF-21-X-B",
  "SF-22-V-A",
  "SF-22-V-C",
  "SG-22-X-D",
  "SF-23-Y-C",
  "SG-23-V-A",
  "SG-22-Z-D",
  "SH-22-Y-B",
  "SH-22-V-D"
]
exports.capitais = capitais

// cartas utilizadas para testes
var cartastest = [
  "SE-23-Z-C",
  "SF-24-V-A",
  "SB-25-Y-C",
  "SC-24-X-A",
  "SD-24-Y-D",
  "SD-24-V-A",
  "SC-23-Y-B",
  "SC-24-V-A",
  "SB-23-X-D",
  "SA-24-Z-C",
  "SA-23-Z-A",
  "SC-19-X-C",
  "SC-20-V-B",
  "SA-22-X-D",
  "SB-22-X-D",
  "SC-21-Z-D",
  "SD-22-X-A",
  "SE-22-X-B",
  "SE-22-V-A",
  "SE-21-V-B",
  "SE-21-Y-D",
  "SC-20-Z-C",
  "SH-21-X-D",
  "SF-21-X-B",
  "SE-22-Z-D",
  "SG-22-X-D",
  "SF-23-Y-C",
  "SG-22-Z-D",
  "SG-22-V-B",
  "SH-22-V-D",
  
  // add adhoc
  'SA-21-Y-C', // manaus
  'NA-20-X-D', // boa vista
  
]
exports.cartastest = cartastest

// 'super cartas' para toda a classificacao
// cada carta envolve seu entorno (vizinhanca de 8)
// metodo usado para gerar amostras de treinamento para a classificacao
var cartasCompleteSetToClassify = [
  "SF-23-Z-D",
  "SF-23-X-B",
  "SE-23-X-D",
  "SE-24-V-D",
  "SF-24-V-B",
  "SB-25-V-C",
  "SC-25-V-A",
  "SC-24-X-A",
  "SC-24-Z-C",
  "SD-24-Z-A",
  "SD-23-Z-B",
  "SC-23-Z-D",
  "SC-23-X-B",
  "SB-23-X-D",
  "SA-24-Z-C",
  "SB-24-X-C",
  "SA-23-Z-B",
  "NA-22-V-B",
  "SA-23-V-A",
  "NA-22-Y-D",
  "NA-21-X-D",
  "NA-21-Z-C",
  "NA-20-Z-D",
  "NA-20-X-B",
  "NB-20-Z-B",
  "NA-20-V-A",
  "NA-20-Y-C",
  "NA-19-Y-D",
  "SC-19-Y-D",
  "SC-19-V-B",
  "SB-19-V-D",
  "SB-18-X-D",
  "SC-18-X-B",
  "SA-19-Y-B",
  "SA-20-Y-A",
  "SA-20-Z-B",
  "SB-20-V-C",
  "SC-20-V-A",
  "SC-20-X-B",
  "SB-20-X-D",
  "SC-21-X-A",
  "SB-21-X-C",
  "SA-21-Z-A",
  "SA-22-Y-B",
  "SA-23-Y-A",
  "SB-23-V-C",
  "SC-22-V-B",
  "SB-22-V-D",
  "SC-22-Y-D",
  "SC-23-V-A",
  "SC-23-Y-C",
  "SD-23-Y-A",
  "SE-23-V-C",
  "SE-22-V-D",
  "SD-22-Y-B",
  "SE-21-X-C",
  "SE-20-X-B",
  "SD-20-Z-B",
  "SD-21-Z-A",
  "SC-21-Z-C",
  "SC-20-Z-D",
  "SC-20-Y-C",
  "SH-21-X-C",
  "SG-21-Z-D",
  "SG-21-X-D",
  "SF-21-Z-C",
  "SF-21-X-A",
  "SF-22-V-B",
  "SF-22-Y-D",
  "SF-23-V-A",
  "SF-23-Y-C",
  "SG-22-Z-B",
  "SG-22-Y-B",
  "SI-22-V-B",
  "SH-22-V-D",
  "SH-22-X-D",
  "SH-21-Z-C"
]
exports.cartasCompleteSetToClassify = cartasCompleteSetToClassify


