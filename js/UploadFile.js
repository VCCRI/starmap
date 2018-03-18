var UploadFile = function( viewPort ) {

    var sceneEl = viewPort.sceneEl;
    this.PARTICLE_SIZE = 45;
    var clusterNum = this.clusterNum = 0;
    
    var boundingSphereDict = {}
    var pointsDict = {}
    var normalizeParams = this.normalizeParams = {};  
    var container = viewPort.container;
    var pointContainer =  viewPort.pointContainer;
    var boundingSphereContainer = viewPort.boundingSphereContainer;
    var fileData = viewPort.fileData;
    var boundingBox = this.boundingBox = {
        minX: Infinity,
        minY: Infinity,
        minZ: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
        maxZ: -Infinity,
    }
    //init GUI
    var gui = new dat.GUI({ width: 275, closeOnTop:true, name:'Upload File' } );


    //Load CSV file
    var uploadFileField = document.createElement("input");
    uploadFileField.setAttribute("id", "inputFileField");
    uploadFileField.setAttribute("type", "file");
    uploadFileField.setAttribute("style", "visibility:hidden");
    //uploadFileField.setAttribute("accept", ".txt, .csv");
    
    uploadFileField.onchange = function(evt) {
        
  
        var inputFile = evt.target.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = d3.csvParse(reader.result);
            preProcessData(data)
            
            confirmUI();
            
            
            
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
        // if(!data[0].hasOwnProperty('x') || !data[0].hasOwnProperty('y') || !data[0].hasOwnProperty('z') || !data[0].hasOwnProperty('cluster')) {
        //     console.log('error');
        //   uploadFileField.value='';
        //   // TODO write text on screen
        //   return false;
        // }

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
            
            updateNormalizeParams(p);

            
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
                    p[currParamName] = normlizeParam(p[currParamName],normalizeParams[currParamName].max,50);
                }
                else if(p.cluster != '-1') {
                    p[currParamName] = normlizeFeature(p[currParamName],normalizeParams[currParamName],0.48);
                    currCluster.features[currParamName].push(p[currParamName]);
                }
                
            }
            currCluster.positions.push(p.x,p.y,p.z);
        }
        
    
    return true;
    }
    
    function postToApi(data) {
        
        var zip = new JSZip();
        var dataString = convertToString(data);
        // zip.file("data", convertToString(data));
        
        // zip.generateAsync({type:"blob"})
        // .then(function(content) {
        //         // see FileSaver.js
        //         console.log(content);
        // });
        
    }
    
    function convertToString(data) {
        
        var content = data.columns.join(',') +'\n';
        var keys = Object.keys(normalizeParams);
      
        var keyLen =keys.length;
        var j = 0;
        for( var i = 0 ; i < data.length ; i += 1 ) {
      
            for( j = 0; j < keyLen-1 ; j += 1 ) {
          
                content += data[i][keys[j]] + ',';
            }
            content += data[i][keys[j]]+'\n';
            
        }
        

        return content;
        
        
        
    }
    
    function updateNormalizeParams(p){
        
        for (var key of Object.keys(normalizeParams)) {
            
            var val = normalizeParams[key];
            var currVal = parseFloat(p[key]);
            if( currVal > val.max) val.max = currVal;
            if( currVal < val.min) val.min = currVal;
            
            //if(key =='x' || key == 'y' || key == 'z' )  val.mean += currVal;
                
            
            
        }
        
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
            viewPort.initControlUIAndRendering( );
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