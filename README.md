<a href="url"><img src="QRcodeAndLogo/logo.png" align="left" height="108" alt="starmap"></a>
# starmap: Immersive three dimensional visualisation of single cell data using smartphone-enabled virtual reality

Authors: Andrian Yang, Yu Yao, Jianfu Li and Joshua W. K. Ho

Contact: j.ho@victorchang.edu.au

Copyright © 2018, Victor Chang Cardiac Research Institute

## Synopsis

starmap is a web-based VR-enabled visualisation tool which combines both 3D scatter plot visualisation and star plot (radial chart) visualisation to allow for better understanding of the data visualised. starmap can accessed from both desktop and mobile from the following [link](https://vccri.github.io/starmap/).

## Input data

starmap accepts both csv file as well as zip-compressed csv file as the input format. The csv file need to contain a header row with the following column names - x, y, z and cluster - corresponding to the 3D coordinates of points and cluster assigned for the point (with outliers assigned the value of -1). In addition to the required columns, starmap also accepts extra columns (up to 12) corresponding to features which will be visualised in the star plot. The values for all columns must be of numeric types.

To see an example of input data, please see the sampleData folder which contains two example datasets based on previously published single-cell RNA-seq data and flow cytometry data.

## Usage instructions

starmap support a number of input methods for interacting with the visualisation - keyboard, remote control and voice control. Note that voice control is available only in chrome (desktop and mobile) as voice control utilises SpeechRecognition API which is currently only supported by chrome.

A summary of the control scheme for keyboard and voice control is included in the table below.

| Command | keyboard control | voice command |
| ------- | ---------------- | ------------- |
| forward | w | forward |
| backward | s | backward |
| left | a | left |
| right | d | right |
| zoom in | q | in |
| zoom out | e | out | 
| rotate Y-axis clockwise | left arrow | N\A |
| rotate Y-axis anti-clockwise | right arrow | rotate |
| rotate X-axis clockwise | up arrow | N\A |
| rotate X-axis anti-clockwise | down arrow | N\A |
| click on toolbox (VR mode) | N\A | select |
| reset toolbox (VR mode) | N\A | reset |
| reset view (VR mode) | N\A | init |

The control scheme for remote control is shown below.

<a href="url"><img src="image/gamepad.png" align="left" alt="control scheme for remote control"></a>
