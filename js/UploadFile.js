var UploadFile = function( viewPort ) {

    var sceneEl = this.sceneEl = viewPort.sceneEl;
    this.PARTICLE_SIZE = 45;
    var clusterNum = this.clusterNum = 0;
    
    var boundingSphereDict = {}
    var pointsDict = {}
    var normalizeParams = this.normalizeParams = {};  
    var container = viewPort.container;
    var pointContainer =  viewPort.pointContainer;
    var boundingSphereContainer = viewPort.boundingSphereContainer;
    var fileData = viewPort.fileData;

    //init GUI
    var gui = new dat.GUI({ width: 275, closeOnTop:true, name:'Upload File' } );
    // var loader = document.createElement('div');
    // loader.setAttribute('class','loader');
    // sceneEl.appendChild(loader);
    //Load CSV file
    var uploadFileField = document.createElement("input");
    uploadFileField.setAttribute("id", "inputFileField");
    uploadFileField.setAttribute("type", "file");
    uploadFileField.setAttribute("style", "visibility:hidden");
    uploadFileField.setAttribute("accept", ".txt, .csv");
    
    
    var sloganDiv = this.sloganDiv = document.createElement('div');
    sloganDiv.setAttribute('class','sloganDiv');
    
    var slogan = this.slogan = document.createElement('h1');
    slogan.setAttribute('class','h1');
    slogan.innerHTML = 'Drive Into Your Data With <span style="color:#3e8e41">STARMAP</span>'
    sloganDiv.appendChild(slogan);
    
    
    var demoDiv = this.demoDiv = document.createElement('div');
    demoDiv.setAttribute('class','demoDiv');
    
    
    
    var button = document.createElement('button');
    button.innerHTML = "Example One";
    button.setAttribute('class','demoButton');
    button.addEventListener('click',function( ) {
        demo('10k_data.csv')
    })
    demoDiv.appendChild(button);
    
    
    var button2 = document.createElement('button');
    button2.innerHTML = "Example Two";
    button2.setAttribute('class','demoButton')
    button2.addEventListener('click',function( ) {
        demo('250k_data.csv')
    })
    demoDiv.appendChild(button2);
    
    
    var button3 = document.createElement('button');
    
    button3.innerHTML = "Example Three";
    button3.setAttribute('class','demoButton')
    button3.addEventListener('click',function( ) {
        demo('300k_data.csv')
    })
    demoDiv.appendChild(button3);
    sceneEl.appendChild(demoDiv);
    sceneEl.appendChild(sloganDiv);
    
    function demo(fileName) {
        
        d3.text("sampleData/"+fileName, function(data) {
    
            
            lines = data.split(/\r\n|\n/g);

            detectFeatures(lines[0]);

            convertToMatrix(lines);
          
          //  a  = nj.array(lines);

             
            //console.log(data);
            // preProcessData(data);
            gui.destroy();
            sceneEl.removeChild(demoDiv);
            sceneEl.removeChild(sloganDiv);
            console.log('end');
            viewPort.initControlUIAndRendering( );
            
        })

    }

    function convertToMatrix ( rows ) {
        var keys = Object.keys(normalizeParams);
        var clusterIndex  = keys.indexOf('CLUSTER');
        keys.splice(clusterIndex, 1);
        var clusterColumnNum = normalizeParams['CLUSTER'].index;
        var clusterRecord = [];

      
        for (var i = 1 ; i < rows.length -1 ; i += 1) {

            var columns = rows[i].split(",");

            var newCluster = columns[clusterColumnNum];
            clusterRecord.push(newCluster);
            if (!fileData.hasOwnProperty(newCluster)) {
                fileData[newCluster] = new Points();
                for (var key of keys) {
                    if(key == 'X' || key == 'Y' || key == 'Z' ) continue;
                    fileData[newCluster].features[key] = [];
                }
            }

            if (columns.length == 0) continue;

            for ( var j = 0; j < keys.length ; j += 1 ) {
                var currFeature = normalizeParams[keys[j]];
                var currVal = parseFloat(columns[currFeature.index]);
                currFeature.data.push(currVal);
                if (isNaN(currVal)) {console.log("has NAN value "+keys[j]+" "+i);return false;}
                if( currVal > currFeature.max)  currFeature.max = currVal;
                if( currVal < currFeature.min)  currFeature.min = currVal;
            }

        }

        for ( var i = 0; i < keys.length ; i += 1 ) {
            var currFeature = normalizeParams[keys[i]];
            njMatrix = nj.array(currFeature.data);
            if ( keys[i] == "X" ||  keys[i] == "Y" || keys[i] == "Z" )
                njMatrix = njMatrix.divide(currFeature.max).multiply(150)
                
            
            else njMatrix = njMatrix.subtract(currFeature.min).divide(currFeature.max-currFeature.min).multiply(0.48)
            currFeature.data = njMatrix.tolist();
          //  ((value-range.min)/range.range)*newRange)
        }
      
        console.log(normalizeParams)
        prepareRenderingData(clusterRecord,keys);
          console.log(fileData )
        return true;
    }


    function prepareRenderingData( clusterRecord,features ) {
 
        features.splice(features.indexOf('X'), 1);
        features.splice(features.indexOf('Y'), 1);
        features.splice(features.indexOf('Z'), 1);
        viewPort.featuresNum = features.length;
        // var xIndex = normalizeParams['CLUSTER'].index;
        // var yIndex = normalizeParams['CLUSTER'].index;
        // var zIndex = normalizeParams['CLUSTER'].index;

        for (var i = 0; i < clusterRecord.length; i+=1 ) {
    
            currCluster = fileData[clusterRecord[i]];
            // console.log(normalizeParams['X'])
            // break
            currCluster.positions.push(normalizeParams['X'].data[i],normalizeParams['Y'].data[i],normalizeParams['Z'].data[i] )
            for ( var feature of features) {
                //console.log(feature);
                if(clusterRecord[i] != -1) {
                    currCluster.features[feature].push(normalizeParams[feature].data[i]);
                }
            }

        }


        
    }




    function detectFeatures( headerRow ) {
        var headerList = headerRow.toUpperCase().split(",");
        if(headerList.indexOf('X') == -1 || headerList.indexOf('Y') == -1 || headerList.indexOf('Z') == -1 || headerList.indexOf('CLUSTER') == -1) 
        {
            // console.log(headerList.indexOf('X') )
            // console.log(headerList.indexOf('Y') )
            // console.log(headerList.indexOf('Z') )
            // console.log(headerList[9]== 'CLUSTER')
            console.log(headerList)
            return false;
        }
        for( var i = 0 ; i < headerList.length ; i += 1 ) {
            var currFeature = headerList[i];
            if( currFeature.length == 0 || currFeature == '""' ) continue;
            if( currFeature != 'X' && currFeature !='Y' && currFeature != 'Z' && currFeature != 'CLUSTER' ) {

                var feature = {};
                feature[currFeature] = function(){};
                config.featureMap.push(feature);

            }
            normalizeParams[currFeature] = {};
            normalizeParams[currFeature].data = [];
            normalizeParams[currFeature].index = i;
            normalizeParams[currFeature].max = -Infinity;
            normalizeParams[currFeature].min = Infinity;


        }
        console.log(normalizeParams)
        return true;

    }
    
    uploadFileField.onchange = function(evt) {
        
  
        var inputFile = evt.target.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {

            console.log('start');
            var data = d3.csvParse(reader.result);

            if(preProcessData(data)) confirmUI();
            else uploadFileField.value='';
            console.log('end');
            
            
        }
                    
        reader.readAsText(inputFile);

    };

    var uploadFileParams = {
        loadFile : function() { 
                uploadFileField.click();
        }
    };
    
    gui.add(uploadFileParams,'loadFile').name('Load CSV file');



    //data process, store points to an object
    function preProcessData(data) {
        //error detection
        if(!data[0].hasOwnProperty('x') || !data[0].hasOwnProperty('y') || !data[0].hasOwnProperty('z') || !data[0].hasOwnProperty('cluster')) 

          // TODO write text on screen
          return false;
        

        for(var key in data[0]) {
            
            if( !data[0].hasOwnProperty(key) ) continue;
            if( key =='cluster' || key == '' ) continue;
            if( key != 'x' && key !='y' && key != 'z' ) {
                var feature = {};
                feature[key] = function(){};
                config.featureMap.push(feature);
                
            }
            normalizeParams[key] = {};
            normalizeParams[key].max = -Infinity;
            normalizeParams[key].min = Infinity;
            //normalizeParams[key].mean = 0;
            
        }
        
        
        var len = data.length;
        
        for(var i = 0; i < len; i+=1 ) {
            var p = data[i];
            var index = p.cluster;
            
            if (!updateNormalizeParams(p))  return false;
            

            
            if (!fileData.hasOwnProperty(index)) {
                fileData[index] = new Points();
                for (var key of Object.keys(normalizeParams)) {
                    if(key == 'x' || key == 'y' || key == 'z' ) continue;
                    fileData[index].features[key] = [];
                }
            }
            
        }
        
    
        for (var key of Object.keys(normalizeParams)) {
            
            normalizeParams[key].range = normalizeParams[key].max - normalizeParams[key].min;
            //value.mean = value.mean/len;
        }
        
        //console.log(normalizeParams);
        var keys = Object.keys(normalizeParams);
        var keyLen = keys.length;
        viewPort.featuresNum = keyLen - 3;
        
        for(var i = 0; i < len; i++ ) {
            var p = data[i];
            var index = p.cluster;
            var currCluster = fileData[index];
            for ( var j = 0; j < keyLen; j+=1 ) {   
                var currParamName = keys[j];
          
                if ( currParamName == 'x' || currParamName == 'y' || currParamName == 'z') { 
                    p[currParamName] = normlizeParam(p[currParamName],normalizeParams[currParamName].max,150);
                }
                else if(p.cluster != -1) {
                    p[currParamName] = normlizeFeature(p[currParamName],normalizeParams[currParamName],0.48);
                    currCluster.features[currParamName].push(p[currParamName]);
                }
                
            }
            currCluster.positions.push(p.x,p.y,p.z);
        }

        console.log(fileData)
        return true;
    }
    
 
    
    function updateNormalizeParams(p){
        
        for (var key of Object.keys(normalizeParams)) {
            
            var val = normalizeParams[key];
            var currVal = parseFloat(p[key]);
            if (isNaN(currVal)) return false;
            if( currVal > val.max) val.max = currVal;
            if( currVal < val.min) val.min = currVal;
            
            //if(key =='x' || key == 'y' || key == 'z' )  val.mean += currVal;
                
            
            
        }
        return true
        
    }
    
    function normlizeParam(value, range, newRange) {
        if( range == 0 ) return parseFloat(value); 
        return simplify(value/range*newRange)
        
    }
    
    function normlizeFeature(value, range, newRange) {
        
        return simplify(((value-range.min)/range.range)*newRange)
        
    }
    
    function confirmUI() {

        // confirm button to enter the VR 
        var fileUploaded = function (){
            //boundingBoxEl.setAttribute( 'visible', false );
            gui.destroy();
            sceneEl.removeChild(demoDiv);
            sceneEl.removeChild(sloganDiv);
            viewPort.initControlUIAndRendering( );
            //location.reload();
           
        }

        var obj = { startToExplore : fileUploaded };
        gui.add(obj,'startToExplore').name("confirm");
        
    }

    function simplify(num) {

        return Math.round10(parseFloat(num),-2);
        
    }

    function normalizeData( data) {
        
        
    }

}