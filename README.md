<div>
  <img src="image/logos.png" alt="University of São Paulo and UFSCar logos" width="260" align="right">
  <h1 style="padding-right: 280px;">MapBiomas Brazil <br> Urban Areas</h1>
</div>
<br>
Developed by MapBiomas Urban Areas Mapping Group, composed by students and researchers from University of São Paulo and Federal University of São Carlos.

---

## About

This repository contains the scripts and supporting resources used to map urban areas in Brazil as part of the MapBiomas Brazil initiative. The workflows are implemented primarily in the Google Earth Engine JavaScript API and combine satellite imagery, reference datasets, supervised classification, and spatial and temporal post-classification procedures.

The repository contains two complementary processing pipelines:

- a **30 m Landsat** workflow for the long-term historical series; and
- a **10 m Sentinel** workflow for more detailed annual urban-area mapping.

The methods, concepts, and accuracy assessment are documented in the Algorithm Theoretical Basis Document (ATBD) for Urban Areas, available through [MapBiomas](https://mapbiomas.org/).

---

## Repository structure

- [`lulc_30m_landsat`](lulc_30m_landsat/) — Scripts for annual urban-area mapping at **30 m resolution** using Landsat imagery. This pipeline covers the historical series from **1985 to 2024** and includes image preprocessing, mosaic generation, Random Forest classification, probability-threshold estimation, and spatial and temporal refinement.

- [`lulc_10m_sentinel`](lulc_10m_sentinel/) — Scripts for annual urban-area mapping at **10 m resolution** using Sentinel-based annual satellite embeddings. This pipeline covers **2016 to 2025** and includes tile-based Random Forest classification, threshold selection, spatial and temporal filtering, and water and coastal masking.

Each directory includes its own README with the relevant methodological scope, required assets, scripts, processing order, and implementation notes.

---

## General workflow

Both pipelines follow the same overall mapping logic:

1. Prepare satellite data and ancillary reference layers.
2. Train and apply supervised classifiers to generate annual urban-area probabilities.
3. Define probability thresholds using labeled samples and spatial units.
4. Apply spatial filters to constrain urban detections with supporting evidence.
5. Apply temporal filters to improve consistency across the annual series.
6. Export the final maps as MapBiomas urban class **24**.

---

## Requirements

- A [Google Earth Engine](https://earthengine.google.com/) account with access to the Code Editor.
- Permission to read the Earth Engine assets referenced in the scripts.
- Permission to write to the configured output asset collections.

Before running a pipeline, review its directory-specific README and update the asset paths, years, processing grids, and export settings to match your working environment.

---

## Citation and data use

If you use this repository or the resulting data, please cite MapBiomas in accordance with its [Terms of Use](https://brasil.mapbiomas.org/en/termos-de-uso/). MapBiomas data are public, open, and available under the Creative Commons CC-BY license.
