var UploadFile = function( viewPort ) {

    var sceneEl  = viewPort.sceneEl;
    var normalizeParams = {};  
    var container = viewPort.container;
    var pointContainer =  viewPort.pointContainer;
    var boundingSphereContainer = viewPort.boundingSphereContainer;
    var fileData = viewPort.fileData;
    //var confirm = null;
    var noExtraFeatures = 0;
    //init GUI
    //var gui = new dat.GUI({ width: 275, closeOnTop:true, name:'Upload File' } );
    var loader = document.createElement('div');
    loader.setAttribute('class','loading');
    loader.style.display='none';
    sceneEl.appendChild(loader);
    


    // var overlay = document.createElement('div');
    // overlay.setAttribute('id','overlay');
    // overlay.style.display='none';
   // sceneEl.appendChild(overlay);
    //ERROR MESSAGE
    var errorMessageDiv = document.createElement("div"); 
    errorMessageDiv.setAttribute('class', 'errorMessageDiv');

    var errorMessage  =document.createElement('h2');
    errorMessage.setAttribute('class','h2');
    errorMessageDiv.appendChild(errorMessage);
    sceneEl.appendChild(errorMessageDiv);

    
    var sloganDiv = this.sloganDiv = document.createElement('div');
    sloganDiv.setAttribute('class','sloganDiv');
    
    var slogan = this.slogan = document.createElement('h1');
    slogan.setAttribute('class','h1');
    slogan.innerHTML = '<span style="color:#3e8e41">starmap</span>: Immersive 3D visualisation of single cell data using virtual reality';
    sloganDiv.appendChild(slogan);
    
    var demoDiv = this.demoDiv = document.createElement('div');
    demoDiv.setAttribute('class','demoDiv');
    

    //UPLOAD FILE
    var uploadFileButton = document.createElement("button");
    uploadFileButton.setAttribute("class", "uploadButton");
    uploadFileButton.innerHTML = 'Upload File<br />(.txt .csv .zip)';
   
    var uploadFileField = document.createElement("input");
    uploadFileField.setAttribute("id", "inputFileField");
    uploadFileField.setAttribute("type", "file");
    uploadFileField.setAttribute("style", 'display:none');
    uploadFileField.setAttribute("accept", ".txt, .csv, .zip");


    uploadFileButton.addEventListener('click',function(){
        uploadFileField.click();
     
    });
    demoDiv.appendChild(uploadFileButton);

    // //DEMO1
    // var button = document.createElement('button');
    // button.innerHTML = "Example One<br />(10K RNA-seq Data)";
    // button.setAttribute('class','demoButton');
    // button.addEventListener('click',function( ) {
    //     demo('10k_data');
    // });
    // demoDiv.appendChild(button);
    
    
    var button2 = document.createElement('button');
    button2.innerHTML = "Demo 1<br />(68K RNA-seq)";
    button2.setAttribute('class','demoButton');
    button2.addEventListener('click',function( ) {
        demo('RNAseq_68kpbmc_data');
    });
    demoDiv.appendChild(button2);
    

    var button3 = document.createElement('button');
    button3.innerHTML = "Demo 2<br />(500K FACS)";
    button3.setAttribute('class','demoButton');
    button3.addEventListener('click',function( ) {
        demo('FlowCytometry_500kUE_data');
    });
    demoDiv.appendChild(button3);
    sceneEl.appendChild(demoDiv);
    sceneEl.appendChild(sloganDiv);
    
    function demo(fileName) {
        loader.style.display='block';
        var promise = new JSZip.external.Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent('./sampleData/'+fileName+'.zip', function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
            });
        });
        promise.then(JSZip.loadAsync)                     // 2) chain with the zip promise
        .then(function(zip) {          
            return zip.file(fileName+".csv").async("string"); // 3) chain with the text content promise
        })
        .then(function success(data) {  
                              // 4) display the result
                var lines = data.split(/\r\n|\n/g);
                detectFeatures(lines[0]);
                convertToMatrix(lines);
                sceneEl.removeChild(demoDiv);
                sceneEl.removeChild(sloganDiv);
                loader.style.display='none';
                viewPort.initControlUIAndRendering( );
        }, function error(e) {
    
        });
    }

    function convertToMatrix ( rows ) {

        var keys = Object.keys(normalizeParams);
        var clusterIndex  = keys.indexOf('CLUSTER');
        keys.splice(clusterIndex, 1);
        var clusterColumnNum = normalizeParams.CLUSTER.index;
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
                if (isNaN(currVal)) {errorMessage.innerHTML = keys[j]+" contains non-numeric value"; return false;}
                if( currVal > currFeature.max)  currFeature.max = currVal;
                if( currVal < currFeature.min)  currFeature.min = currVal;
            }
        }
        for ( var i = 0; i < keys.length ; i += 1 ) {
            var currFeature = normalizeParams[keys[i]];
            njMatrix = nj.array(currFeature.data);
            if ( keys[i] == "X" ||  keys[i] == "Y" || keys[i] == "Z" )
                njMatrix = njMatrix.divide(currFeature.max).multiply(150);
                
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

            currCluster.positions.push(normalizeParams['X'].data[i],normalizeParams['Y'].data[i],normalizeParams['Z'].data[i] );
            for ( var feature of features) {
                //console.log(feature);
                if(clusterRecord[i] != -1) {
                    currCluster.features[feature].push(normalizeParams[feature].data[i]);
                }
            }

        }    
       
    }


    function detectFeatures( headerRow ) {
        
        var error = 0;
        var headerList = CSVtoArray( headerRow.toUpperCase( ) )[0];
        errorMessage.innerHTML = '';
        //console.log(headerList);
       
        if(headerList.indexOf('X') == -1) {
            errorMessage.innerHTML += ' X';
            error = 1;

        }if( headerList.indexOf('Y') == -1) {
            errorMessage.innerHTML += ' Y';
            error = 1;
        }if( headerList.indexOf('Z') == -1  ){
            errorMessage.innerHTML += ' Z';
            error = 1;
        }if(headerList.indexOf('CLUSTER') == -1) {
            errorMessage.innerHTML += ' ClUSTER';
            error = 1;

        }
        if (error == 1){
  
            errorMessage.innerHTML = 'File must contain required Attributes: ' + errorMessage.innerHTML;
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
        //console.log(normalizeParams)
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
        if (evt.target.files[0].name.split('.').pop().toLowerCase() != 'zip'){
         
            normalizeParams = {};  

            reader.onload = function(e) {
                data = reader.result;
                lines = data.split(/\r\n|\n/g);
                
                if (detectFeatures(lines[0])){
                    if(convertToMatrix(lines)){
                        fileUploaded();
                    }
                }
                loader.style.display='none';
                uploadFileField.value = '';     
            };         
            reader.readAsText(inputFile);

        }else{
            reader.addEventListener( 'load', function ( event ) {	
                var contents = event.target.result;
                var count = 0;
                var zip = new JSZip( );
                zip.loadAsync(contents).then(function (zip) {
                    var keys = Object.keys(zip.files);
                    var newKeys = keys.slice();
                
                    for (var key of keys) {
                        if (key.includes('__MACOSX/')) newKeys.splice( newKeys.indexOf(key),1);
                    }

                    //console.log(newKeys)
                    if ( newKeys.length > 1 ) {
                        errorMessage.innerHTML = 'Number of files in a .zip must be equal to one.';
                        loader.style.display='none';
                        uploadFileField.value = '';  
                       
                    }
                    else{  
                        var fileExtension = keys[0].split('.').pop();
                        if( fileExtension != 'txt' && fileExtension != 'csv' ){
                            errorMessage.innerHTML = 'File extension is not supported.';
                                loader.style.display='none';
                                uploadFileField.value = '';  
                        }
                        else{
                            zip.files[keys[0]].async('string').then(function (data) {
                                lines = data.split(/\r\n|\n/g);

                                if (detectFeatures(lines[0])){
                                    if(convertToMatrix(lines)){
                                        fileUploaded();
                                    }
                                }

                                loader.style.display='none';
                                uploadFileField.value = '';   
            
                            });
                        }

                    }
       
                    
                });

            }, false );
            reader.readAsBinaryString(inputFile);
        }
    };

    var uploadFileParams = {
        loadFile : function() { 
                uploadFileField.click();
        }
    };
    
    //gui.add(uploadFileParams,'loadFile').name('Load CSV file');


    var fileUploaded = function (){

        sceneEl.removeChild(demoDiv);
        sceneEl.removeChild(sloganDiv);
        sceneEl.removeChild(errorMessageDiv);
        viewPort.initControlUIAndRendering( );
    
        
    }

    // var confirmLogic = { startToExplore : fileUploaded };
 
    // function confirmUI() {

    //     // confirm button to enter the VR 
    //     confirm = gui.add(confirmLogic,'startToExplore').name("confirm");
     
   
        
    // }

};

       // console.log(headerRow)
        function CSVtoArray(text) {
            var p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
            for (l in text) {
                l = text[l];
                if ('"' === l) {
                    if (s && l === p) row[i] += l;
                    s = !s;
                } else if (',' === l && s) l = row[++i] = '';
                else if ('\n' === l && s) {
                    if ('\r' === p) row[i] = row[i].slice(0, -1);
                    row = ret[++r] = [l = '']; i = 0;
                } else row[i] += l;
                p = l;
            }
            return ret;
        }