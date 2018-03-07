var UploadFile = function( viewPort ) {

    var sceneEl = viewPort.sceneEl;
    var fileData = this.fileData = {};
    this.PARTICLE_SIZE = 45;
    var clusterNum = this.clusterNum = 0;
    var boundingSphereDict = {}
    var pointsDict = {}

    var container = viewPort.container;
    var pointContainer =  viewPort.pointContainer;
    var boundingSphereContainer = viewPort.boundingSphereContainer;

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
    uploadFileField.onchange = function(evt) {
  
        var inputFile = evt.target.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = d3.csvParse(reader.result);
            formatData(data);
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
    function formatData(data) {

        var len = data.length;
        for(var i = 0; i < len; i++ ) {
            var  p = data[i];
            var index = parseInt(p.cluster);
            if (!fileData.hasOwnProperty(index)) {
                fileData[index] = new Points();
            }
            //remain two decimal place
            fileData[index].positions.push(simplify(p.x),simplify(p.y),simplify(p.z));
            
        }


    }
    

    function confirmUI() {

        // confirm button to enter the VR 
        var fileUploaded = function (){
            //boundingBoxEl.setAttribute( 'visible', false );
            gui.destroy();
            viewPort.initControlUIAndRendering( fileData );
        }

        var obj = { startToExplore : fileUploaded };
        gui.add(obj,'startToExplore').name("confirm");
        
    }

    function simplify(num) {

        return Math.round10(parseFloat(num),-2);
        
    }



}