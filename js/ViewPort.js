var ViewPort = function() {
    this.pointsDict = {}

    this.boundingSphereDict = {}

    this.boundingBox = {}

    this.sceneEl = document.createElement('a-scene');
    //this.sceneEl.setAttribute('vr-mode-ui','enabled: false');
    //this.sceneEl.setAttribute('light','defaultLightEnabled:false');
    this.sceneEl.object3D.background = new THREE.Color( 0x222222 );
    //this.sceneEl.object3D.remove( this.sceneEl.object3D.children[0]);
    var light = document.createElement('a-entity');
    light.setAttribute('light','type: ambient; color: #fff');

    this.sceneEl.appendChild(light);

    var container = this.container = document.createElement('a-entity');
    container.setAttribute('id','container');
    //container.setAttribute('drag-rotate-component','');
    this.sceneEl.appendChild(container);

    var boundingSphereContainer= this.boundingSphereContainer = document.createElement('a-entity');
    boundingSphereContainer.setAttribute('id','boundingSphereContainer');
    boundingSphereContainer.setAttribute( 'position','0 0 0' );
    boundingSphereContainer.setAttribute( 'visible',true );
    container.appendChild(boundingSphereContainer);
    
    var pointContainer= this.pointContainer = document.createElement('a-entity');
    pointContainer.setAttribute('id','pointContainer');
    pointContainer.setAttribute('position','0 0 0');
    pointContainer.setAttribute("visible",true);
    container.appendChild(pointContainer);

    var cameraWrapperEl = this.cameraWrapperEl = document.createElement('a-entity');
    cameraWrapperEl.setAttribute('position','0 0 0');
  
    cameraWrapperEl.setAttribute('id','cameraWrapper');

    var cameraEl = this.cameraEl = document.createElement('a-camera');
    cameraEl.setAttribute('id','camera');
    cameraEl.setAttribute('keyboardcontrol','');
    cameraEl.setAttribute('wasd-controls-enabled','false');

    //cameraEl.setAttribute('look-controls-enabled','false');
    
    var hiddenEl = document.createElement('a-entity');
    //hiddenEl.setAttribute('position','0.5 1 -2');
    hiddenEl.setAttribute('position','0 0 -5');
    hiddenEl.setAttribute('id','hiddenEl');
    cameraEl.appendChild(hiddenEl);
    this.compass = new Compass(cameraEl,container); 
    cameraWrapperEl.appendChild(cameraEl);

    this.sceneEl.appendChild(cameraWrapperEl);


    
   // var vrEditor= this.vrEditor= new VrEditor(viewPort,cameraEl);
    var flatScreenEditor = this.flatScreenEditor = new FlatScreenEditor(this);

    this.sceneEl.addEventListener("enter-vr",function(){

        flatScreenEditor.hideFlatScreenUI();
        //vrEditor.addVrUI();
    });

    this.sceneEl.addEventListener("exit-vr",function(){
        //vrEditor.removeVrUI();
        flatScreenEditor.displayFlatScreenUI();

    });
    document.querySelector('body').appendChild(this.sceneEl);

}







ViewPort.prototype = { 

    initControlUIAndRendering : function( clustersData ) {

        //var scope = this;
        this.initRendering( clustersData );
        this.boundingSphereContainer.setAttribute("visible",true);
        this.sceneEl.setAttribute('vr-mode-ui','enabled: true');
        new DisplayDataCommand(this.compass,true);
        // this.vrEditor.initVrUI();
        // this.flatScreenEditor.initFlatScreenUI();

    },

    initRendering : function( clustersData ){

        var counter = 0;
        var scope = this;
        var clusterNum = Object.keys(clustersData).length;

        var boundingBox = {
            minX: Infinity,
            minY: Infinity,
            minZ: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
            maxZ: -Infinity
        };

        for( var key in clustersData ) {
            
            if( clustersData.hasOwnProperty( key ) ) {

                var currCluster = clustersData[key];
                var pointsEl = document.createElement( 'a-entity' );
                config.color[key] = '#' + ( '000000' + Math.random().toString( 16 ).slice( 2, 8 ).toUpperCase() ).slice( -6 );
                console.log(config.color[key]);
                config.displayCluster[key] = false; 
                config.displayBoundingSphere[key] = true; 

                pointsEl.setAttribute( 'points', { positions : currCluster.positions , color :  config.color[key] } );
                pointsEl.setAttribute( 'id', key );
                pointsEl.setAttribute( 'visible', false );
                scope.pointContainer.appendChild( pointsEl );
               
                pointsEl.addEventListener("loaded", function(evt){ renderBoundingSphere(evt, config.color )} );

                this.pointsDict[key] = pointsEl;

            }
        }

        function renderBoundingSphere ( evt, color ){
            
            counter += 1;
            var id = evt.detail.target.id;
            var boundingSphere = evt.detail.target.components.points.getBoundingSphere();
            var boundingSphereEl = document.createElement( 'a-entity' );
            console.log("clolor",color);
            //var randomColor = '#' + ( '000000' + Math.random().toString( 16 ).slice( 2, 8 ).toUpperCase() ).slice( -6 );
            boundingSphereEl.setAttribute( 'id', 'bounding' + id );
            boundingSphereEl.setAttribute( 'geometry', 'primitive: sphere; radius: ' + boundingSphere.radius );
        
            boundingSphereEl.setAttribute( 'position', boundingSphere.center.x +" "+boundingSphere.center.y+" "+boundingSphere.center.z );
            boundingSphereEl.setAttribute( 'material', 'transparent:true; opacity: 0.5; color: '+ color[id]);
     
            scope.boundingSphereDict[id] = boundingSphereEl;
            scope.boundingSphereContainer.appendChild( boundingSphereEl );

            boundingBox = calculateBoundingBox( boundingBox, boundingSphere );

            if (counter == clusterNum) {

                scope.boundingBox = {
                    width: Math.round((boundingBox.maxX - boundingBox.minX)*1.3),
                    height: Math.round((boundingBox.maxY - boundingBox.minY)*1.3),
                    depth: Math.round((boundingBox.maxZ - boundingBox.minZ)*1.3),
                    center:  {
                        x: (boundingBox.maxX + boundingBox.minX)/2,
                        y: (boundingBox.maxY + boundingBox.minY)/2,
                        z: (boundingBox.maxZ + boundingBox.minZ)/2
                    }
                }

                //add a bounding box of all cluster
                // var boundingBoxEl = document.createElement( 'a-entity' );
                // boundingBoxEl.setAttribute( 'id','boundingBoxEl' );
                // boundingBoxEl.setAttribute( 'geometry','primitive: box; width: ' + scope.boundingBox.width + '; height: '+ scope.boundingBox.height + '; depth: '+ scope.boundingBox.depth );
                // boundingBoxEl.setAttribute( 'position', scope.boundingBox.center.x+' '+ scope.boundingBox.center.y+' '+ scope.boundingBox.center.z );
                // boundingBoxEl.setAttribute( 'material', 'transparent:true; opacity: 0.5; color: #abacad' );
                //boundingBoxEl.setAttribute('drag-rotate-component','');
               // scope.container.appendChild( boundingBoxEl );
                //var axis = new Axis( scope );
                var cameraLookatDistance = 1.5*Math.max( scope.boundingBox.width,scope.boundingBox.height,scope.boundingBox.depth );
                scope.cameraWrapperEl.setAttribute( 'position','0 0 ' + cameraLookatDistance );
                scope.flatScreenEditor.addFlatScreenUI();
    

            }
       
        }

        function calculateBoundingBox( boundingBox, boundingSphere ){

            var center = boundingSphere.center;
            var radius = boundingSphere.radius;
            var currMaxX = center.x + radius;
            var currMinX = center.x - radius;
            var currMaxY = center.y + radius;
            var currMinY = center.y - radius;
            var currMaxZ = center.z + radius;
            var currMinZ = center.z - radius;
            if( boundingBox.maxX < currMaxX ) boundingBox.maxX = currMaxX;
            if( boundingBox.minX > currMinX ) boundingBox.minX = currMinX;
            if( boundingBox.maxY < currMaxY ) boundingBox.maxY = currMaxY;
            if( boundingBox.minY > currMinY ) boundingBox.minY = currMinY;
            if( boundingBox.maxZ < currMaxZ ) boundingBox.maxZ = currMaxZ;
            if( boundingBox.minZ > currMinZ ) boundingBox.minZ = currMinZ;
            return boundingBox;

        }

    },

    swithToFlatScreenMode : function(  ) {

       // var scope = this;
        this.sceneEl.setAttribute('vr-mode-ui','enabled: false');
        
    },

    initVrGUI : function( ) {
        console.log("hello");
    },

    renderingPoints : function( ) {
        //var scope = this;
        console.log("start to rendering point");
        this.pointContainer.setAttribute("visible",true);

    },

    hidePoints : function( ) {
       // var scope = this;
        console.log("start to rendering point");
        this.pointContainer.setAttribute("visible",false);

    },  

    renderingBoundingSphere : function( ) {
    //var this = this;
        console.log("start to rendering point");
        this.pointContainer.setAttribute("visible",true);

    },

    hidePoints : function( ) {
       // var scope = this;
        console.log("start to rendering point");
        this.pointContainer.setAttribute("visible",false);

    }


}