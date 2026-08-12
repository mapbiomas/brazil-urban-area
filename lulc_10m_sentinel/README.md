<div class="fluid-row" id="header">
  <div id="column">
    <div class="blocks">
      <img src="image/LogosMapBiomasUAgroup.png" alt="MapBiomas Urban Areas Mapping Group" align="right">
    </div>
  </div>
  <h1 class="title toc-ignore">Urban Areas - 10 m Collection 4</h1>
</div>

Developed by the MapBiomas Urban Areas Mapping Group, with contributions from LabCart, LASERE, NEEPC, NEPA, QUAPA, YBY, and UFBA.

## About

This repository documents the Google Earth Engine workflow used to produce the MapBiomas 10 m urban-area classification. The method uses annual AlphaEarth Satellite Embeddings, supervised Random Forest classification, map-sheet-specific probability thresholds, and spatial and temporal post-classification rules.

The broader concepts, training strategy, feature space, filters, and validation approach are described in the Urban Areas Algorithm Theoretical Basis Document (ATBD), available through [MapBiomas](https://mapbiomas.org/).

## Methodological scope

| Topic | Coverage in this repository |
|:---|:---|
| Satellite representation | Loads the 64 annual dimensions from `GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL`. |
| Classification | Trains tile-specific Random Forest models and exports urban probability images. |
| Threshold selection | Tests candidate probability cutoffs against labeled samples for each map sheet. |
| Spatial post-classification | Limits detections with census, mapped urban-area, and road-infrastructure evidence. |
| Temporal post-classification | Applies first-year, middle-year, last-year, and consolidation rules. |
| Final masking and publication | Removes configured water and coastal exclusions and exports class 24 with collection metadata. |

## Repository structure

```text
.
|-- README.md
|-- DOCUMENTATION_NOTES.md
|-- codes/
|   |-- 01_classification_batch.js
|   |-- 02_best_thresholds.js
|   |-- 03_spatial_filter.js
|   |-- 04_temporal_filter.js
|   |-- 05_spatial_filter_2.js
|   `-- 06_water_mask.js
`-- image/
    `-- LogosMapBiomasUAgroup.png
```

## Processing workflow

| Step | Script | Purpose | Main output |
|:---:|:---|:---|:---|
| 1 | [`01_classification_batch.js`](codes/01_classification_batch.js) | Samples annual embeddings, trains a Random Forest per map sheet, and classifies the target tile. | Urban probability images scaled from 0 to 100. |
| 2 | [`02_best_thresholds.js`](codes/02_best_thresholds.js) | Tests thresholds from 25 to 75 and selects the value with the highest overall accuracy for each sheet. | Threshold features containing the cutoff and accuracy. |
| 3 | [`03_spatial_filter.js`](codes/03_spatial_filter.js) | Applies the selected threshold and ancillary spatial mask, then converts detections to MapBiomas class 24. | Annual spatially constrained classifications by supergrid. |
| 4 | [`04_temporal_filter.js`](codes/04_temporal_filter.js) | Applies temporal consistency and persistence rules across the annual series. | Annual temporally consolidated classifications by supergrid. |
| 5 | [`05_spatial_filter_2.js`](codes/05_spatial_filter_2.js) | Fills small internal gaps, removes isolated urban patches, and reclassifies the result as class 24. | Morphologically refined annual classifications in `Sentinel_SF2`. |
| 6 | [`06_water_mask.js`](codes/06_water_mask.js) | Applies water and coastal exclusions, attaches publication metadata, and exports the final images. | Final annual urban classification assets. |

## Requirements

- A [Google Earth Engine](https://earthengine.google.com/) account with Code Editor access.
- Read access to every Earth Engine asset referenced by the scripts.
- Write access to the configured output collections.

The scripts use the Earth Engine JavaScript API and are intended to run in the Code Editor. They are not Node.js command-line programs.

## How to use

1. Create a folder in an Earth Engine Code Editor repository.
2. Add the scripts from `codes/` while preserving their numeric order.
3. Review the configuration block near the beginning or end of each script:
   - input and output asset paths;
   - input and output versions;
   - years to process;
   - map-sheet or supergrid lists;
   - sample size, class balance, and threshold range.
4. Confirm that each upstream output matches the downstream input collection before starting export tasks.
5. Run the scripts in sequence and start the generated Earth Engine tasks after inspecting their regions, names, and metadata.

> The committed configuration contains production-specific year and supergrid selections. Review [DOCUMENTATION_NOTES.md](DOCUMENTATION_NOTES.md) before starting a complete batch.

## Key method settings

- Feature space: 64 annual AlphaEarth embedding bands (`A00` through `A63`).
- Classifier: Random Forest with 120 trees and a minimum leaf population of 5.
- Training balance: 250 urban samples and up to 500 non-urban samples per tile context.
- Probability output: byte values from 0 to 100.
- Threshold candidates: 25 to 75 in increments of 5.
- Urban class: MapBiomas class 24.
- Spatial resolution: 10 m.
- Production period: 2016-2025.

## Temporal rules

The temporal filter evaluates three-year neighborhoods and then consolidates the annual series:

- The first Sentinel year uses the preceding Landsat classification and the next Sentinel year.
- Middle years retain urban detections supported by at least two adjacent observations while preserving the current-year detection.
- The last year uses the two preceding Sentinel years.
- Consolidation rules strengthen early-year persistence and prevent later reversals after a validated urban occurrence.

## Reproducibility notes

- Years after 2022 reuse the 2022 training samples and water mask where configured.
- Probability tiles are merged from multiple project accounts before thresholding.
- The temporal-filter output from step 4 is consumed by step 5, whose `Sentinel_SF2` output is consumed by the final masking step.
