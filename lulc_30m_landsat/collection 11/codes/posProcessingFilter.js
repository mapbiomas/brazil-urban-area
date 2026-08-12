/*
========================================================================
 PÓS-PROCESSAMENTO — MapBiomas Coleção 11 | Áreas Urbanizadas
 v3b: breakPoint endurecido para atacar superestimação sistêmica
      - cond_ii: 50% → BP_PERCENTUAL_MINIMO (70%) dos anos restantes
      - cond_iv: mínimo dinâmico min(BP_ANOS_MINIMOS, anosRestantes)
      - 2025: sem TF retroativo (permite crescimento real) 
========================================================================

╔══════════════════════════════════════════════════════════════════════╗
║              GUIA DE CONFIGURAÇÃO — LEIA ANTES DE RODAR             ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║  DADOS DE ENTRADA (configure na seção abaixo):                       ║
║                                                                      ║
║  1. asset_input                                                      ║
║     Caminho do seu asset GEE com a imagem binarizada.               ║
║     Requisitos:                                                      ║
║       - Imagem com 41 bandas (anos 1985 a 2025)                     ║
║       - Valores: 0 = não urbano | 1 = urbano                        ║
║       - Nomes de banda no formato:                                   ║
║         "classification_YYYY_v1_threshold_YYYY"                     ║
║       - Sem pixels noData (todos os pixels têm 0 ou 1)              ║
║                                                                      ║
║  2. asset_spatialMask                                                ║
║     Máscara espacial binária: 1 = área onde urbanização é possível  ║
║                                                                      ║
║  3. asset_cartas250mil                                               ║
║     FeatureCollection com a grade de cartas 1:250.000               ║
║     Campo obrigatório: "grid_name" (ex: "SE-21-Y-B")               ║
║                                                                      ║
║  4. asset_cartas_hex                                                 ║
║     FeatureCollection da grade hexagonal de cartas válidas          ║
║                                                                      ║
║  DADO DE SAÍDA:                                                      ║
║  • Tipo: ImageCollection no GEE Asset                               ║
║  • Estrutura: uma imagem por carta 1:250.000                        ║
║  • Cada imagem tem 41 bandas (classification_1985 a 2025)           ║
║  • Valores: 0 = não urbano | 1 = urbano                             ║
║  • Resolução: 30 metros | CRS: EPSG:4326                            ║
║  • Política de pirâmide: mode                                        ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
*/


// SEÇÃO 0 - CONSTRUÇÃO DA SERIE BRUTA PRÉ FILTRO
var firstYear = 1985
var yearsList = ee.List.sequence(firstYear, 2025).getInfo()
var bandsNamesByYear = []
var bandsIds = ee.List.sequence(0, yearsList.length-1).getInfo()

for (var i =0; i < yearsList.length; i++){
  var y = firstYear + i
  var newBandName = 'classification_' + y
  bandsNamesByYear.push(newBandName)
}

var batchFilters = require('users/edimilsonrodriguessantos/mapbiomas:Col11/filters/batchFilters.js')
var final = ee.ImageCollection(yearsList.map(batchFilters.applyPreFilter))
              .toBands().select(bandsIds, bandsNamesByYear)

// info - just some metadata, dont mind them
var prob_version = 1
var outputVersion = 1 // in this version, temp. filter with diff == 2 years
var colNumber = 11
var mosaic_version = 1
var samples_version = 1
var desc = 'col 11; mosaico adaptado da cl 10; 200 urb samples/800 not urb samples; v1.' 


// ====================================================================
// SEÇÃO 1 — CONFIGURAÇÕES (EDITE APENAS AQUI)
// ====================================================================

// --- Entrada: imagem binarizada (0/1 por ano) ---
var asset_input = final;

// --- Máscara espacial ---
var asset_spatialMask = "projects/ee-mburb-land-c10/assets/Testes/Mask_Spatial_v9";

// --- Grade de cartas 1:250.000 ---
var asset_cartas250mil = "projects/ee-mburb-land-c10/assets/Inputs/Cartas_250mil";

// --- Grade hexagonal de cartas válidas ---
var asset_cartas_hex = "projects/ee-mburb-land-c10/assets/Inputs/Cartas_250mil_Hex";

// --- Saída ---
// var output_path = "users/spatialeanalytics/MAPBIOMAS-COLLECTION-11/C11_V2_DSF_PERCENTILE";
var output_path = 'projects/mapbiomas-brazil/assets/LAND-COVER/COLLECTION-11/URBAN/classification_sf'

// --- Identificador de versão ---
var vn = 6 // criacao de uma etapa de pre-filtro usando filtro espacial adicional e substituindo cartas do norte
var vers = "C11_v"+vn+"_SF"; // <-- EDITE

// --- Filtros espaciais ---
// version 5
var thres_SF_hole  = 280; // Buracos internos < 280 pixels (~25ha) são preenchidos como urbano
var thres_SF_noise = 10;  // Manchas urbanas isoladas < 44 pixels (~4ha) são removidas

// --- Escala de exportação ---
var escala = 30; // metros

// --- Limitar processamento a uma ROI durante testes? ---
var useROI = false;
// var ROI = ee.Geometry.Rectangle([-47.0, -23.5, -46.5, -23.0]);

// --- Quais cartas exportar? ---
var export_mode = "all"; // "all" ou "list"
var list_cartas_manual = ["SE-21-Y-B", "SE-21-Y-D"];

// ── Parâmetros do breakPoint (v3b) ───────────────────────────────
// Ajuste aqui para calibrar sem mexer no resto do código.
//
// BP_PERCENTUAL_MINIMO: fração mínima dos anos restantes em que o
//   pixel deve estar urbano para consolidar (cond_ii).
//   v1 original = 0.5 | v3b = 0.7
//   Quanto maior, menos pixels consolidam → menos superestimação.
//
// BP_ANOS_MINIMOS: mínimo absoluto de anos urbanos para consolidar
//   (cond_iv dinâmico). Aplica min(BP_ANOS_MINIMOS, anosRestantes)
//   para não bloquear os anos finais da série.
//   v1 original = inexistente | v3b = 5
var BP_PERCENTUAL_MINIMO = 0.5;
var BP_ANOS_MINIMOS      = 5;

// ====================================================================
// FIM DAS CONFIGURAÇÕES
// ====================================================================


// ====================================================================
// SEÇÃO 2 — INICIALIZAÇÃO E PRINT DE CONFIGURAÇÕES
// ====================================================================

print("=== Configurações v1 ===");
print("asset_input:", asset_input);
print("output_path:", output_path);
print("vers:", vers);
print("BP_PERCENTUAL_MINIMO:", BP_PERCENTUAL_MINIMO, "(v1 era 0.5)");
print("BP_ANOS_MINIMOS:", BP_ANOS_MINIMOS, "(v1 não tinha)");
print("thres_SF_hole:", thres_SF_hole, "pixels (~" + (thres_SF_hole * 900 / 10000).toFixed(0) + " ha)");
print("thres_SF_noise:", thres_SF_noise, "pixels (~" + (thres_SF_noise * 900 / 10000).toFixed(1) + " ha)");
print("useROI:", useROI);
print("export_mode:", export_mode);

// Cria o asset de saída (ImageCollection)
//ee.data.createAsset({'type': 'ImageCollection'}, output_path);


// ====================================================================
// SEÇÃO 3 — ANOS DA SÉRIE TEMPORAL
// ====================================================================

var anos_final   = 2025;
var anos_inicial = 1985;

var years          = ee.List.sequence(anos_inicial, anos_final, 1).getInfo();
// var years_excl2025 = ee.List.sequence(anos_inicial, 2024, 1).getInfo();
var years_excl1985 = ee.List.sequence(1986, anos_final, 1).getInfo();


// ====================================================================
// SEÇÃO 4 — CARTAS E GRADE
// ====================================================================

var cartas250mil = ee.FeatureCollection(asset_cartas250mil);

var list_cartas;
if (export_mode === "all") {
  list_cartas = cartas250mil.aggregate_array("grid_name").getInfo();
  print("Total de cartas para exportar:", list_cartas.length);
} else {
  list_cartas = list_cartas_manual;
  print("Cartas selecionadas:", list_cartas);
}

var cartas_hex_col = ee.FeatureCollection(asset_cartas_hex);
var cartas_hex_im = ee.Image(
  cartas_hex_col
    .map(function(feat) { return feat.set('territory', 3); })
    .reduceToImage({properties: ["territory"], reducer: ee.Reducer.first()})
);

// Map.addLayer(cartas250mil, {}, "Cartas 250mil", false);


// ====================================================================
// SEÇÃO 5 — MÁSCARA ESPACIAL
// ====================================================================

var spatialMask = ee.Image(asset_spatialMask).gte(1);


// ====================================================================
// SEÇÃO 6 — CARREGAR E PREPARAR O DADO DE ENTRADA
// ====================================================================
var im_ProbLim = final

if (useROI) { im_ProbLim = im_ProbLim.clip(ROI); }
im_ProbLim = ee.Image(im_ProbLim);

var im_ProbLim_bandNames = im_ProbLim.bandNames();
var imCol_ProbLim = ee.ImageCollection.fromImages(
  im_ProbLim_bandNames.map(function(bandName) {
    bandName = ee.String(bandName);
    var singleBand = im_ProbLim.select([bandName]).rename("classification")
      .set('bandName', bandName);
    return singleBand;
  })
);

// Map.addLayer(
//   imCol_ProbLim.filter(ee.Filter.eq("bandName", "classification_2025")).first(),
//   {min: 0, max: 1, palette: ["white", "red"]},
//   "Entrada binarizada 2025", false
// );


// ====================================================================
// SEÇÃO 7 — FUNÇÕES AUXILIARES
// ====================================================================

var col_to_image = function(LISTYEARS, COL) {
  var im_final = ee.Image([]);
  LISTYEARS.forEach(function(year) {
    var im_year = COL.filter(ee.Filter.eq("year", year)).first();
    im_final = im_final.addBands(im_year.rename("classification_" + year));
  });
  return im_final;
};

var exp = function(IM, DESC, ID, REG, SC) {
  Export.image.toAsset({
    image:            IM,
    description:      DESC,
    assetId:          ID,
    region:           REG,
    scale:            SC,
    maxPixels:        1e13,
    pyramidingPolicy: {".default": "mode"},
  });
};


// ====================================================================
// SEÇÃO 8 — PREPARAR COLEÇÃO TEMPORAL COM METADADOS
// ====================================================================

var imCol_ProbLim_cStamp = imCol_ProbLim.map(function(im) {
  var ano = ee.Number.parse(ee.String(im.get("bandName")).slice(-4));
  return im
    .rename(['class'])
    .unmask(0)
    .set('system:time_start', ee.Date.fromYMD(ano, 8, 1).millis())
    .set('year', ano);
});

var imCol_ProbLim_cStamp_completo = ee.ImageCollection([]);
years.forEach(function(year) {
  var im_year = imCol_ProbLim_cStamp
    .filter(ee.Filter.eq("year", year))
    .first()
    .unmask(0)
    .set('year', year)
    .set('system:time_start', ee.Date.fromYMD(year, 8, 1).millis());
  imCol_ProbLim_cStamp_completo = imCol_ProbLim_cStamp_completo
    .merge(ee.ImageCollection([im_year]));
});

var im_ProbLim_cStamp_completo = col_to_image(years, imCol_ProbLim_cStamp_completo);


// ====================================================================
// FILTRO A — GapFill (preenchimento de lacunas temporais)
//
// Como a imagem NÃO tem noData, este filtro não altera os dados.
// Mantido por consistência com o fluxo original.
// ====================================================================

var GapFill = function(LIST_YEARS, VAL1, VAL2, VAL3, COL_IN) {
  var COL = COL_IN;
  LIST_YEARS.forEach(function(year) {
    var veg_year = COL.filter(ee.Filter.eq("year", year)).first();
    var year1 = ee.Number(year).add(VAL1).getInfo();
    var year2 = ee.Number(year).add(VAL2).getInfo();
    var year3 = ee.Number(year).add(VAL3).getInfo();

    var col_anos = ee.ImageCollection([
      veg_year,
      COL.filter(ee.Filter.eq("year", year1)).first(),
      COL.filter(ee.Filter.eq("year", year2)).first(),
      COL.filter(ee.Filter.eq("year", year3)).first(),
    ]);

    var moda = col_anos.reduce(ee.Reducer.mode());
    var veg_year_filt = veg_year
      .where(veg_year.eq(2), moda.remap([0, 1, 2], [0, 1, 0]));

    COL = ee.ImageCollection(COL)
      .filter(ee.Filter.neq("year", year))
      .merge(ee.ImageCollection([veg_year_filt]));
  });
  return COL;
};

var GF_2025    = GapFill([2025], -1, -2, -3, imCol_ProbLim_cStamp_completo);
var GF_2025e24 = GapFill([2024],  1, -1, -2, GF_2025);
var GF_Middle  = GapFill(ee.List.sequence(1986, 2023, 1).reverse().getInfo(),  1,  2, -1, GF_2025e24);
var col_GF     = GapFill([1985],  1,  2,  3, GF_Middle);

var im_GF = col_to_image(years, col_GF);


// ====================================================================
// FILTRO B — Filtro Temporal: 5 anos únicos (sem alterações vs v1)
//
// 2025 mantido sem TF — permite crescimento urbano real em 2025.
// A superestimação sistêmica é corrigida no breakPoint (Filtro C).
// ====================================================================

var TempFilter_wMask_5yearsunique = function(LIST_YEARS, VAL1, VAL2, VAL3, VAL4, COL_IN) {
  var col_out = COL_IN.filter(ee.Filter.inList('year', LIST_YEARS).not());

  var col_anos = LIST_YEARS.map(function(year) {
    var im_year = COL_IN.filter(ee.Filter.eq('year', year)).first();
    var soma_5anos = ee.ImageCollection(ee.List([
      im_year,
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL1))).first(),
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL2))).first(),
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL3))).first(),
      COL_IN.filter(ee.Filter.eq('year', ee.Number(year).add(VAL4))).first()
    ])).sum();

    var mascara_unico = im_year.multiply(soma_5anos.eq(1).unmask());
    return im_year
      .where(mascara_unico.eq(1), 0)
      .set('year', year);
  });

  return col_out.merge(ee.ImageCollection(col_anos));
};

// 2025: sem filtro (igual à v1 original — permite crescimento real)
var TF_2025   = col_GF;
var TF_2024   = TempFilter_wMask_5yearsunique([2024],  1, -1, -2, -3, TF_2025);
var TF_Middle = TempFilter_wMask_5yearsunique(
                  ee.List.sequence(1986, 2023, 1).reverse().getInfo(),
                  2, 1, -1, -2, TF_2024);
var TF_1986   = TempFilter_wMask_5yearsunique([1986], -1,  1,  2,  3, TF_Middle);
var col_TF_5yearsunique = TempFilter_wMask_5yearsunique([1985],  1,  2,  3,  4, TF_1986);

col_TF_5yearsunique = col_TF_5yearsunique.sort('year');
var im_TF_5yearsunique = col_to_image(years, col_TF_5yearsunique);


// ====================================================================
// FILTRO C — Filtro Temporal: ponto de quebra (breakPoint)
//
// MUDANÇAS v3b em relação à v1 original:
//
// [1] cond_ii: percentual aumentado de 0.5 para BP_PERCENTUAL_MINIMO
//     Motivo: com 50%, pixels instáveis que alternavam 0/1 ao longo
//     da série consolidavam facilmente e inflavam TODOS os anos
//     seguintes via accumulateForward. Com 70%, exige-se consistência
//     temporal maior antes de consolidar.
//     Este é o principal ajuste contra a superestimação sistêmica.
//
// [2] cond_iv: mínimo dinâmico min(BP_ANOS_MINIMOS, anosRestantes)
//     Motivo: proteção adicional para transições recentes onde
//     cond_ii sozinho ainda pode ser permissivo. O mínimo dinâmico
//     evita bloquear completamente os anos finais da série — um
//     mínimo fixo bloquearia 2022-2025 inteiramente.
//
// cond_i e cond_iii: sem alterações
// ====================================================================

col_TF_5yearsunique = col_TF_5yearsunique.map(function(im) {
  var ano = im.get("year");
  return im.set('system:time_start', ee.Date.fromYMD(ano, 8, 1).millis());
});

var getTransitions_valid = function(LISTYEARS, COL_IN) {
  return ee.ImageCollection(
    LISTYEARS.map(function(year) {
      var year_prev    = ee.Number(year).subtract(1).getInfo();
      var im_year      = ee.Image(COL_IN.filter(ee.Filter.eq("year", year)).first());
      var im_year_prev = ee.Image(COL_IN.filter(ee.Filter.eq("year", year_prev)).first());
      var diff = im_year.subtract(im_year_prev);
      return im_year.remap([0, 1], [0, 0])
        .where(diff.eq(1), 1)
        .set("year", year)
        .rename(["transvalid"]);
    })
  );
};

var im_1985_transValid = col_TF_5yearsunique
  .filter(ee.Filter.eq("year", 1985)).first()
  .rename(["transvalid"]);
var col_transicaoValid = ee.ImageCollection(im_1985_transValid)
  .merge(getTransitions_valid(years_excl1985, col_TF_5yearsunique));

var getUrbToEnd = function(LISTYEARS, IMCOL, MASK) {
  return ee.ImageCollection(
    LISTYEARS.map(function(year) {
      year = ee.Number(year);
      var im_mask_year = MASK.filter(ee.Filter.eq('year', year)).first();
      var soma_urb = IMCOL.filter(ee.Filter.gte('year', year)).reduce(ee.Reducer.sum());
      return im_mask_year.remap([0, 1], [0, 0])
        .where(im_mask_year.eq(1), soma_urb)
        .set('year', year)
        .rename("classification");
    })
  );
};

var col_UrbToEnd = getUrbToEnd(years, col_TF_5yearsunique, col_transicaoValid);

var getBreakpoints = function(col_transicaoValid, col_UrbToEnd, finalYear) {
  return col_transicaoValid.map(function(imgTransicaoValid) {
    var year          = ee.Number(imgTransicaoValid.get('year'));
    var imgUrbToEnd   = col_UrbToEnd.filter(ee.Filter.eq('year', year)).first();
    var anosRestantes = ee.Number(finalYear).subtract(year).add(1);

    var cond_i   = imgTransicaoValid.eq(1);

    // MUDANÇA v3b [1]: percentual mínimo aumentado de 0.5 para BP_PERCENTUAL_MINIMO
    var cond_ii  = imgUrbToEnd.gte(anosRestantes.multiply(BP_PERCENTUAL_MINIMO));

    var cond_iii = imgUrbToEnd.gte(1);

    // MUDANÇA v3b [2]: mínimo dinâmico — evita bloquear anos finais da série
    // min(BP_ANOS_MINIMOS, anosRestantes): para anos com poucos anos restantes,
    // o mínimo é relaxado proporcionalmente.
    // Ex: transição em 2022 (4 anos restantes) → mínimo efetivo = 4
    //     transição em 2018 (8 anos restantes) → mínimo efetivo = 5
    var min_anos_efetivo = ee.Number(BP_ANOS_MINIMOS).min(anosRestantes);
    var cond_iv  = imgUrbToEnd.gte(min_anos_efetivo);

    var breakpoint = cond_i.and(cond_ii).and(cond_iii).and(cond_iv);

    return breakpoint.updateMask(breakpoint)
      .set('year', year)
      .set('system:time_start', imgTransicaoValid.get('system:time_start'))
      .unmask(0);
  });
};

var col_Breaks  = getBreakpoints(col_transicaoValid, col_UrbToEnd, anos_final);
var list_Breaks = col_Breaks.sort('year').toList(col_Breaks.size());

var accumulateForward = function(imgList) {
  var size  = imgList.size();
  var first = ee.Image(imgList.get(0));
  var init  = { list: ee.List([first]), acc: first };

  var iterate = ee.List.sequence(1, size.subtract(1)).iterate(function(i, state) {
    state    = ee.Dictionary(state);
    var acc  = ee.Image(state.get('acc'));
    var list = ee.List(state.get('list'));
    var img  = ee.Image(imgList.get(i));
    var newAcc = acc.max(img);
    return ee.Dictionary({
      list: list.add(
        newAcc
          .set('year', img.get('year'))
          .set('system:time_start', img.get('system:time_start'))
      ),
      acc: newAcc
    });
  }, init);

  return ee.ImageCollection(ee.List(ee.Dictionary(iterate).get('list')));
};

var col_TF = accumulateForward(list_Breaks);
var im_TF  = col_to_image(years, col_TF);


// ====================================================================
// FILTRO D — Filtro Espacial (SF) — sem alterações vs v1
// ====================================================================

var list_au_SF1 = ee.List([]);
years.forEach(function(year) {
  var au_year = col_TF.filter(ee.Filter.eq("year", year)).first();
  var mask_SF = au_year.multiply(spatialMask);
  list_au_SF1 = list_au_SF1.add(
    mask_SF
      .set("year", year)
      .set('system:time_start', ee.Date.fromYMD(year, 8, 1).millis())
  );
});
var col_au_SF_1 = ee.ImageCollection(list_au_SF1);

var list_au_SF2 = ee.List([]);
years.forEach(function(year) {
  var au_year = col_au_SF_1.filter(ee.Filter.eq("year", year)).first();

  var count_hole = au_year.eq(0).selfMask()
    .connectedPixelCount({maxSize: thres_SF_hole + 1, eightConnected: false});
  var im_noHole = au_year
    .where(count_hole.lt(thres_SF_hole), 1)
    .reproject({crs: 'EPSG:4326', scale: 30});

  var count_noise = im_noHole.eq(1).selfMask()
    .connectedPixelCount({maxSize: thres_SF_noise + 1, eightConnected: false});
  var im_SF = im_noHole
    .where(count_noise.lt(thres_SF_noise), 0)
    .reproject({crs: 'EPSG:4326', scale: 30});

  list_au_SF2 = list_au_SF2.add(
    im_SF
      .set("year",    year)
      .set('system:time_start', ee.Date.fromYMD(year, 8, 1).millis())
      .set('bandName', "classification_" + year)
  );
});

var col_au_SF_2 = ee.ImageCollection(list_au_SF2);

var im_au_SF_2 = col_au_SF_2.toBands();
var bandNames_SF2_original = col_au_SF_2.aggregate_array('bandName');
var bandNames_SF2_novo = bandNames_SF2_original.map(function(name) {
  var partes = ee.String(name).split('_');
  return ee.String('classification_').cat(ee.List(partes).get(-1));
});
im_au_SF_2 = im_au_SF_2.rename(bandNames_SF2_novo);


// ====================================================================
// SEÇÃO 9 — IMAGEM FINAL E EXPORTAÇÃO
// ====================================================================

var description_final = [
  "Col11 v5 |", 
  "A-GapFill (sem efeito, sem noData);",
  "B-TF5yearsUnique (2025 sem filtro);",
  "C-TFbreakPoint (cond_ii>=" + BP_PERCENTUAL_MINIMO + " cond_iv>=min(" + BP_ANOS_MINIMOS + ",anosRest));",
  "D-SF mask + holes(lt" + thres_SF_hole + ") + noise(lt" + thres_SF_noise + ")"
].join(" ");

var im_au_final = im_au_SF_2
  .set("collection_version", "Col11_v1")
  .set("description",        description_final)
  .set("version",            vers)
  .updateMask(cartas_hex_im.eq(3))
  .unmask(0);

// Map.addLayer(
//   im_au_final.select("classification_2025"),
//   {min: 0, max: 1, palette: ["white", "red"]},
//   "Resultado final 2025 (v3b)", true
// );

// print("Imagem final pronta:", im_au_final);
// print("Descrição:", description_final);
// print("Iniciando exportação de", list_cartas.length, "cartas...");

var gridListByCarta1 = [
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

]

var gridListByCarta2 = [  
  // gridset 2
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

]

var gridListByCarta3 = [  
  // gridset 3
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

]

var gridListByCarta4 = [  
  // gridset 4
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
]

var gridListByCarta5 = [
  // gridset 5
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
]

var gridListByCarta6 = [
  // gridset 5
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

// ------ running ---------
// // ed
// var list_cartas = gridListByCarta1
// var list_cartas = gridListByCarta2

// // breno
// var list_cartas = gridListByCarta3
// var list_cartas = gridListByCarta4

// // julio
// var list_cartas = gridListByCarta5
// var list_cartas = gridListByCarta6


list_cartas.forEach(function(grid) {
  var carta    = cartas250mil.filter(ee.Filter.eq("grid_name", grid));
  var im_carta = im_au_final.set("grid_name", grid);
  exp(
    im_carta,
    vers + "_" + grid,
    output_path + "/" + grid + "_v" + vn,
    carta.geometry(),
    escala
  );
});

// print("Tarefas criadas. Vá ao painel 'Tasks' e clique em 'Run All'.");