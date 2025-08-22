<div class="fluid-row" id="header">
    <div id="column">
        <div class = "blocks">
            <img src='image/LogosMapBiomasUAgroup.png' height='auto' width='auto' align='right'>
        </div>
    </div>
    <h1 class="title toc-ignore">Urban Area</h1>
</div>

Developed by MapBiomas Urban Areas Mapping Group, composed by students and researchers from:
- LabCart <br/>
- LASERE <br/>
- NEEPC <br/>
- NEPA <br/>
- QUAPÁ <br/>
- YBY <br/>
- UFBA <br/>

# About
This documentation contains general information about the urban areas mapping procedures developed by MapBiomas project in Collection 10 products. Both the concepts that were applied and the main accuracy results are detailed in the Algorithm Theoretical Basis Document (ATBD) about urban areas (see https://mapbiomas.org/). Here we highlight the sequential procedures to classify urban areas from satellite imagery and reference base-maps.<br/>

# How to use
## Basics
Some basic steps are necessary before starting programming. They are:<br/> 
- Create an account in the GEE platform. It can be done here https://earthengine.google.com/<br/>
- Create a GEE repository in the code editor and upload the modules in it. <br/>

## Which topics of the ATBD do we cover here? 
_Topics covered in this git_

|Topic| Description (if not included, why?)
|:---|:---
✅ Satellite imagery| Includes all codes to obtain a complete mosaic with all bands used during the classification
✅ Classification algorithm| Includes all codes applied for urban mapping within Google Earth Engine based on Random Forest (RF) algorithm. 
✅ Post-processing steps| Includes post-classification codes applied for urban areas refinement. 
<br/>

## Satellite imagery
_Codes necessary for satellite imagery._

|Codes| Description
|:---|:---
**[preProcessing_lib.js](codes/preProcessing_lib.js)**| Code with functions to scale Landsat images, remove clouds and shadow clouds.
**[renameBands.js](codes/renameBands.js)** | Code with dictionaries and functions useful for adequate Landsat band names (including all Landsat missions).
**[index_lib.js](codes/index_lib.js)** | Library with index calculation functions used during the mosaic production.
**[mosaic_production.js](codes/mosaic_production.js)** | Generates mosaics from Landsat images covering all the time series.
<br/>

The **[mosaic_production.js](codes/mosaic_production.js)** is the main code - within which pre-processing, rename bands, and indices are operated. It is called during the classification procedures.

## Classification algorithm
### Classification steps within Google Earth Engine

_Codes necessary for conducting the classification._

|Codes| Description
|:---|:---
**[class_lib.js](codes/class_lib.js)** | Sets up a classification procedure using Random Forest (RF) algorithm.
**[classification_batch.js](codes/classification_batch.js)** | Perform the classification using mosaics, samples, and the classifier. The classification is performed annually based on a regular grid. The result is a probability layer. 
**[temporalStabilizationByRegion.js](codes/temporalStabilizationByRegion.js)** | After producing the classification (as a probability layer) by year and grid unit, a temporal harmonization is applied. This is a simply calculation of the mean probability considering a range of five years for each year.
**[bestProb_preProcessingByGridByYear.js](codes/bestProb_preProcessingByGridByYear.js)** | Using the probability harmonized layer, this code prepares the necessary files to estimate the best probability threshold to be used as a cut-off value for binary classification of urban areas. The result is processed by grid and year and analyzed externally. 
**[meanThresholdsByGridAsImage.js](codes/meanThresholdsByGridAsImage.js)** | After calculating the best threshold externally (see [Urban classification threshold analysis using python](#Urban-classification-threshold-analysis-using-python)), an image with best selected threshold is produced to be used as a mask value by grid.
<br/>

### Urban classification threshold analysis using python
_Codes necessary for calculating the best threshold for urban areas binary classification._

|Codes| Description
|:---|:---
**[preProcessingThreshold.ipynb](codes/preProcessingThreshold.ipynb)**| Calculate the best threshold to be used as a cut-off value for urban binary classification. The results are presented by grid and year containing both the Receiver Operating Characteristic (ROC) curve and percentiles analysis. The average threshold table is the main output of this code, which must be ingested in GEE as a .CSV file.
<br/>

## Post-processing steps
_Codes used for applying the probability threshold and filters (temporal and spatial) for refinement of the results_

|Codes| Description
|:---|:---
**gettingTemporalBreakPoints**| Code necessary to obtain breakpoints from which urban classification frequency after a year under analysis is greater than non-urban classification frequency. This code enables an analysis of "when" a pixel becomes urban throughout the time series.
**temporalFilter**| Code necessary to apply the selected probability threshold and provide temporal consistency throughout the time series based on breakpoint analysis.
**spatialFilter**| Code necessary for spatial adjustments related to the minimal quantity of pixels to be considered urban as well as operating closing operations to include urban green or non-built areas. Several layers of reference are considered here, as census tracts, density of roads and infrastructures, and others. 
<br/>

# Processing steps
_Steps necessary to conduct the urban areas classification_

1) In your GEE repository, create a folder where you will save the codes
2) After creating a file for each one of the GEE codes above mentioned, adequate all the repository address to your folder
3) The sequence of codes are:\
-> **classification_batch.js** \
-> **temporalStabilizationByRegion.js**\
-> **bestProb_preProcessingByGridByYear.js**\
-> **preProcessingThreshold.ipynb**\
-> **meanThresholdsByGridAsImage.js**\
-> **gettingTemporalBreakPoints**\
-> **temporalFilter**\
-> **spatialFilter**
