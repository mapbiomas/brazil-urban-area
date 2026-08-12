<div class="fluid-row" id="header">
    <h1 class="title toc-ignore">Urban Area</h1>
</div>

Developed by MapBiomas Urban Areas Mapping team, composed by students and researchers from USP, including the NEPA (laboratory from EESC/USP) and UFSCar.

# About
This documentation provides general information on the urban area mapping procedures developed by the MapBiomas Project for Collection 10 products. The applied concepts and the main accuracy results are presented in the Algorithm Theoretical Basis Document (ATBD) for urban areas (see https://mapbiomas.org/). Here we highlight the sequential procedures to map urban areas based on satellite imagery and reference base-maps.<br/>

# How to use
## Basics
Some basic steps are necessary before starting programming. They are:<br/> 
- Create an account in the GEE platform. It can be done here https://earthengine.google.com/<br/>
- Create a GEE repository in the code editor and upload the modules in it. <br/>

## Which topics of the ATBD do we cover here? 
_Topics covered in this git_

|Topic| Description
|:---|:---
✅ Samples gathering| Includes all codes necessary to get samples based on stable classes over time.
✅ Satellite imagery| Includes all codes to obtain a complete mosaic with all bands used during the classification
✅ Classification algorithm| Includes all codes applied for urban mapping within Google Earth Engine based on Random Forest (RF) algorithm. 
✅ Post-processing steps| Includes post-classification codes applied for urban areas refinement. 

<br/>

## Supporting codes
_Codes necessary to support the classification and access previous results._

|Codes| Description
|:---|:---
**[listsAndDicts.js](codes/mb_batch/listsAndDicts.js)**| Code with lists and dictionaries involving time ranges, class values, and classification grid. 
**[collections.js](codes/mb_batch/collections.js)**| Code with information to access previous collections of urban areas mapping results. This code is necessary to get samples in the nexts steps. 

<br/>

## Satellite imagery
_Codes necessary for satellite imagery._

|Codes| Description
|:---|:---
**[stablesSamples.js](codes/stablesSamples.js)**| Code used to generate stable samples based on stable areas over diferent ranges of time starting in 1985.
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
**[temporalStabByRegion.js](codes/temporalStabByRegion.js)** | After producing the classification (as a probability layer) by year and grid unit, a temporal harmonization is applied. This is a simply calculation of the mean probability considering a range of five years for each year. 
**[bestProb_preProcessingByGridByYear.js](codes/bestProb_preProcessingByGridByYear.js)** | Using the probability harmonized layer, this code prepares the necessary files to estimate the best probability threshold to be used as a cut-off value for binary classification of urban areas. The result is processed by grid and year and analyzed externally. 
**[meanThresholdsByGridAsImage.js](codes/meanThresholdsByGridAsImage.js)** | After calculating the best threshold externally (see [Urban classification threshold analysis using python](#Urban-classification-threshold-analysis-using-python)), an image with best selected threshold is produced to be used as a mask value by grid.

<br/>

### Urban classification threshold analysis using python
_Codes necessary for calculating the best threshold for urban areas binary classification._

|Codes| Description
|:---|:---
**[batchResults.js](codes/batchResults.js)**| Code necessary to merge the probability assets created in previous steps. 
**[preProcessingThreshold.ipynb](codes/preProcessingThreshold.ipynb)**| Calculate the best threshold to be used as a cut-off value for urban binary classification. The results are presented by grid and year containing both the Receiver Operating Characteristic (ROC) curve and percentiles analysis. The average threshold table is the main output of this code, which must be ingested in GEE as a .CSV file.

<br/>

## Post-processing steps
_Ancillary datasets created to mask areas where urbanization can be detected (spatial filter mask)_
|Codes| Description
|:---|:---
**[buildingsAndBuffers.js](codes/buildingsAndBuffers.js)**| Code necessary to create a raster from which buildings and their surroundings are considered to mask the occurrence of urban areas.
**[referenceLayers.js](codes/referenceLayers.js)**| Code necessary to create a raster from which reference datasets are prepared to compose the spatial mask of occurrence of urban areas. Examples of data are census tracts, roads and infrastructures, and slums.

<br>

_Codes used for applying the probability threshold and filters (temporal and spatial) for refinement of the results_
|Codes| Description
|:---|:---
**[posProcessingFilter.js](codes/posProcessingFilter.js)**| Code necessary to provide spatial and temporal consistency. The code operates several steps: <br> - Obtain breakpoints from which urban classification frequency after a year under analysis is greater than non-urban classification frequency. This code enables an analysis of "when" a pixel becomes urban throughout the time series. <br> - Apply the selected probability threshold and provide temporal consistency throughout the time series based on breakpoint analysis and limit the occurrence of urban areas within spatial masks (temporal filter + spatial filter).
<br/>

## Urban vegetation
_Codes necessary to get urban vegetation (within urban areas)._
|Codes| Description
|:---|:---
**[veg_urb.js](codes/veg_urb.js)**| Code necessary to detail urban areas identifying vegetation coverages.

<br>

# Post-processing steps
_Steps necessary to conduct the urban areas classification_

1) In your GEE repository, create a folder where you will save the codes
2) After creating a file for each one of the GEE codes above mentioned, adequate all the repository address to your folders
3) The sequence of codes are:\
-> **stablesSamples.js**\
-> **classification_batch.js** \
-> **bestProb_preProcessingByGridByYear.js**\
-> **preProcessingThreshold.ipynb**\
-> **meanThresholdsByGridAsImage.js**\
-> **buildingsAndBuffers.js**\
-> **referenceLayers.js**\
-> **posProcessingFilter.js**\
-> **veg_urb.js**