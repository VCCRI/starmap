var UploadFile = function( viewPort ) {

    var sceneEl  = viewPort.sceneEl;
    var normalizeParams = {};  
    var container = viewPort.container;
    var pointContainer =  viewPort.pointContainer;
    var boundingSphereContainer = viewPort.boundingSphereContainer;
    var fileData = viewPort.fileData;
    var confirm = null;
    var noExtraFeatures = 0;
    //init GUI
    var gui = new dat.GUI({ width: 275, closeOnTop:true, name:'Upload File' } );
    var loader = document.createElement('div');
    loader.setAttribute('class','loading');
    loader.style.display='none';
    sceneEl.appendChild(loader);


    // var overlay = document.createElement('div');
    // overlay.setAttribute('id','overlay');
    // overlay.style.display='none';
   // sceneEl.appendChild(overlay);
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
    slogan.innerHTML = '<span style="color:#3e8e41">STARMAP</span>: Immersive 3D Visualisation of Single Cell Data Using Virtual Reality'
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
        loader.style.display='block';
        d3.text("sampleData/"+fileName, function(data) {
            //alert('start parsing')
            lines = data.split(/\r\n|\n/g);
           
            detectFeatures(lines[0]);
            convertToMatrix(lines);
            gui.destroy();
            sceneEl.removeChild(demoDiv);
            sceneEl.removeChild(sloganDiv);
            loader.style.display='none';
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
            //detect different clusters and initialize render data
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
       
        }
      
        prepareRenderingData(clusterRecord,keys);

        return true;
    }


    function prepareRenderingData( clusterRecord,features ) {
 
        features.splice(features.indexOf('X'), 1);
        features.splice(features.indexOf('Y'), 1);
        features.splice(features.indexOf('Z'), 1);
        viewPort.featuresNum = features.length;

        for (var i = 0; i < clusterRecord.length; i+=1 ) {
    
            currCluster = fileData[clusterRecord[i]];

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
        
        if (confirm != null) {
            gui.remove(confirm);
            confirm = null;
        }
        var headerList = headerRow.toUpperCase().split(",");
        if(headerList.indexOf('X') == -1 || headerList.indexOf('Y') == -1 || headerList.indexOf('Z') == -1 || headerList.indexOf('CLUSTER') == -1) 
        {
            // console.log(headerList.indexOf('X') )
            // console.log(headerList.indexOf('Y') )
            // console.log(headerList.indexOf('Z') )
            // console.log(headerList[9]== 'CLUSTER')

            return false;
        }
        // var realHeaderList = [];

        // for ( var i = 0 ; i < headerList.length ; i += 1 ) {

        // }
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
        if(Object.keys(normalizeParams).length == 4) {

            addAxisAsFeature();
        }
        console.log(normalizeParams)
        return true;

    }

    function addAxisAsFeature() {
        var axisList = ['X_AXIS','Y_AXIS','Z_AXIS'];
        var indexs = [normalizeParams.X.index,normalizeParams.Y.index,normalizeParams.Z.index];
        for ( var i = 0 ; i < 3 ; i += 1 ){


            currFeature = axisList[i]

            var feature = {};
            feature[currFeature] = function(){};
            config.featureMap.push(feature);
            normalizeParams[currFeature] = {};
            normalizeParams[currFeature].data = [];
            normalizeParams[currFeature].index = indexs[i];
            normalizeParams[currFeature].max = -Infinity;
            normalizeParams[currFeature].min = Infinity;
        }
    }
    
    uploadFileField.onchange = function(evt) {
        
        loader.style.display='block';
        fileData = viewPort.fileData = {};
        noExtraFeatures = 0;
        var inputFile = evt.target.files[0];
        var reader = new FileReader();

        normalizeParams = {};  

        reader.onload = function(e) {
            data = reader.result;
            lines = data.split(/\r\n|\n/g);
            if (detectFeatures(lines[0])){
                if(convertToMatrix(lines)){
                   confirmUI();
                }
            }
            loader.style.display='none';
            uploadFileField.value='';     
        }           
        reader.readAsText(inputFile);
    };

    var uploadFileParams = {
        loadFile : function() { 
                uploadFileField.click();
        }
    };
    
    gui.add(uploadFileParams,'loadFile').name('Load CSV file');


    var fileUploaded = function (){
        //boundingBoxEl.setAttribute( 'visible', false );
        gui.destroy();
        sceneEl.removeChild(demoDiv);
        sceneEl.removeChild(sloganDiv);
        viewPort.initControlUIAndRendering( );
        //location.reload();
        
    }

    var confirmLogic = { startToExplore : fileUploaded };
 
    function confirmUI() {

        // confirm button to enter the VR 
        confirm = gui.add(confirmLogic,'startToExplore').name("confirm");
     
   
        
    }

}