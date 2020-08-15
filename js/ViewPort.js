var ViewPort = function() {
    this.pointsDict = {};

    this.boundingSphereDict = {};
    
    this.boundingBox = {};
    this.fileData = {};
    this.NUMOFSP = 20;
    this.threshhold = 15;
    this.featuresNum = 0;
    this.sqrtThreshhold = Math.sqrt(this.threshhold);
    this.sceneEl = document.createElement('a-scene');
    this.sceneEl.object3D.background = new THREE.Color( 0x222222 );
    this.sceneEl.setAttribute( 'keyboard-shortcuts', 'enterVR: false' );
    this.sceneEl.setAttribute('vr-mode-ui','enabled: false');
    this.initCameraPosition = null;
    var light = document.createElement('a-entity');
    light.setAttribute('light','type: ambient; color: #fff');

    this.sceneEl.appendChild(light);

    // create demo UI
    
    var geometry = new THREE.SphereGeometry( 3, 6, 3 );
    var logo = this.logo = document.createElement('a-entity');
    logo.setAttribute('logo','');
    
    this.sceneEl.appendChild(logo);


    

    var container = this.container = document.createElement('a-entity');
    container.setAttribute('id','container');
    this.sceneEl.appendChild(container);
    

    var boundingSphereContainer= this.boundingSphereContainer = document.createElement('a-entity');
    boundingSphereContainer.setAttribute('id','boundingSphereContainer');
    boundingSphereContainer.setAttribute( 'position','0 0 0' );
    boundingSphereContainer.setAttribute( 'visible',true );
    container.appendChild(boundingSphereContainer);
    
    var pointContainer= this.pointContainer = document.createElement('a-entity');
    pointContainer.setAttribute('id','pointContainer');
    pointContainer.setAttribute('position','0 0 0');
    pointContainer.setAttribute('visible',true);
    container.appendChild(pointContainer);

    var splImageContainer= this.splImageContainer = document.createElement('a-plane');
    splImageContainer.setAttribute('id','splImageContainer');
    splImageContainer.setAttribute( 'visible',false );
    console.log(splImageContainer.object3D)
    container.appendChild(splImageContainer);

    var pointsEl = this.pointsEl = document.createElement( 'a-entity' );
    pointsEl.setAttribute('class', 'clickable');
    pointsEl.setAttribute('id', 'points');
    pointContainer.appendChild( pointsEl );


    var outlierEl= this.outlierEl = document.createElement( 'a-entity' );
    outlierEl.setAttribute('id', 'outlier');
    pointContainer.appendChild( outlierEl );

    var axis = this.axis = new Axis(this);



    var cameraWrapperEl = this.cameraWrapperEl = document.createElement('a-entity');
    cameraWrapperEl.setAttribute('position','0 0 0');
  
    cameraWrapperEl.setAttribute('id','cameraWrapper');

    var cameraEl = this.cameraEl = document.createElement('a-camera');
    cameraEl.setAttribute('id','camera');
    
    cameraEl.setAttribute('wasd-controls-enabled','false');
    cameraEl.setAttribute('look-controls-enabled','false');
    cameraEl.setAttribute('user-height','0');
    cameraEl.setAttribute('near','5');
    
    this.hiddenChild = new THREE.Group();
    this.hiddenChild.position.set(3,0,-6);
    cameraEl.object3D.add(this.hiddenChild);
    
    var cursorEl = this.cursorEl = document.createElement('a-entity');

    cursorEl.setAttribute('raycaster','interval: 500; objects: .clickable; far:300;');
    cursorEl.setAttribute('cursor','fuse: true');
    
    cursorEl.setAttribute ('position', '0 0 -5.04');
    cursorEl.setAttribute ('geometry', 'primitive: ring; radiusInner: 0.140; radiusOuter: 0.175;thetaLength: 0; thetaStart: 90');
    cursorEl.setAttribute ('material', 'color: cyan; shader: flat;transparent:true; opacity:0.7');
    
    cursorEl.addEventListener('ableHover',function(e){
        cursorEl.setAttribute('cursor','fuse:'+ e.detail.bool);
    });

    var fusingStartAnimation = this.fusingStartAnimation = document.createElement('a-animation');
    fusingStartAnimation.setAttribute('begin','fusing');
    fusingStartAnimation.setAttribute('attribute','geometry.thetaLength');
    fusingStartAnimation.setAttribute('fill','forwards');
    fusingStartAnimation.setAttribute('from','0');
    fusingStartAnimation.setAttribute('to','360');
    fusingStartAnimation.setAttribute('dur','1500');   
    fusingStartAnimation.setAttribute('end','mouseleave');
    
    cursorEl.appendChild(fusingStartAnimation);

    
    
    var cursorCenter =  this.cursorCenter = document.createElement('a-entity');
    cursorCenter.setAttribute('position','0 0 0');
    cursorCenter.setAttribute('geometry','primitive: ring; radiusOuter: 0.120; radiusInner: 0.070');
    cursorCenter.setAttribute('material','color: #2ADD2A');
    cursorEl.appendChild(cursorCenter);

    this.isVrCursor(false);
    
    cameraEl.appendChild(cursorEl);

    this.compass = new Compass(cameraEl,container); 
    cameraWrapperEl.appendChild(cameraEl);
    this.sceneEl.appendChild(cameraWrapperEl);

    document.querySelector('body').appendChild(this.sceneEl);

    var mouseControl = this.mouseControl = new MouseControl( this );
    var highDemDetail  = this.highDemDetail = new HighDemDetail( this );
    var flatScreenEditor = this.flatScreenEditor = new FlatScreenEditor( this );
    
    var vrEditor= this.vrEditor = new VrEditor(this);


    var keyboardControl = this.keyboardControl = new KeyboardControl(this);
    var voiceControl  = this.voiceControl = new VoiceControl(this);
    var vrControl  = this.vrControl = new VrControl(this);
    var scope = this;
    

    this.sceneEl.addEventListener('enter-vr',function(){

        flatScreenEditor.hideFlatScreenUI();
        vrEditor.displayVrUI();
        mouseControl.enableMouseControl(false);
        keyboardControl.enableKeyboardControl(false);
        scope.isVrCursor(true);
        scope.voiceControl.enableVoiceControl(true);
        scope.vrControl.enableVrControl(true);

        
    });

    this.sceneEl.addEventListener('exit-vr',function(){
        //vrEditor.removeVrUI();
        vrEditor.hideVrUI();
        flatScreenEditor.displayFlatScreenUI();
        mouseControl.enableMouseControl(true);
        keyboardControl.enableKeyboardControl(true);
        scope.isVrCursor(false);
        scope.voiceControl.enableVoiceControl(false);
        scope.vrControl.enableVrControl(false);
    });


};



ViewPort.prototype = { 
    
    
    findSurrendingPoints: function(pointIndex, cluster){
        
        // find the point
        
        var centerPoint = this.fileData[cluster].findPoint(pointIndex);
        var surrendingPoints = {};
        var totalPointsLength = 0;
       // var relativeCluster = [];
       // config.displayCluster[key]
        // for ( var [currCluster, points] of Object.entries(viewPort.pointsDict)) {
        //     console.log(currCluster,points.visible)
        // }
        for ( var [currCluster, points] of Object.entries(this.fileData)) {

            if( currCluster == -1 || viewPort.pointsDict['mpoints__'+currCluster].visible == false) continue;
            if( points.boundingSphere.center.distanceTo(centerPoint) - points.boundingSphere.radius > this.sqrtThreshhold ) continue;
            
                var l = points.getSurrendingPoints(this.threshhold, centerPoint);
             
                if(l.length > 0 ) {
                    surrendingPoints[currCluster] = l;
                    totalPointsLength += l.length;
                }
            
        }
        
        if(totalPointsLength > this.NUMOFSP) {
         
            var deleteNum = totalPointsLength - this.NUMOFSP;
           // console.log('Needdelete' + deleteNum);
            var keys =Object.keys( surrendingPoints );
           //init heap
            var heap = new Heap(function(a, b) { return b.d - a.d});
            
            for (var i = 0 ; i < keys.length ; i += 1 ){
               
               var currPoints = surrendingPoints[keys[i]];
               heap.push( { k: keys[i], d: currPoints[currPoints.length - 1].d } );
               
            
            }
               
            for ( ; deleteNum > 0; deleteNum -= 1 ) {
            
                var deleteItem = heap.pop();
                var clusterNeedPop = deleteItem.k;
                var surrendingCluster = surrendingPoints[clusterNeedPop];
                surrendingPoints[clusterNeedPop].pop();
                
                if(surrendingCluster.length == 0) {
                    
                    delete surrendingPoints[clusterNeedPop]; 
                    continue;
            
                }
            
                heap.push( { k: clusterNeedPop, d: surrendingCluster[surrendingCluster.length - 1].d } );
                //
            }

            
        }
            
       this.highDemDetail.showHighDemDetail(surrendingPoints);
        
    },

    isVrCursor: function(bool) {
        
        
        var scope = this;
        
        scope.cursorEl.setAttribute('visible', bool);
        
        var clickHandler = function(evt) {
            
            var intersection = evt.detail.intersection;
            scope.findSurrendingPoints(intersection.index,intersection.object.name);
           
        };
        
        var mouseLeaveHandler = function(evt) {
            scope.cursorCenter.setAttribute('material', 'color', '#2ADD2A');
            scope.cursorEl.setAttribute('geometry', 'thetaLength', '0');
        };
        
        var fusingStartAnimationHandler = function() {
            scope.cursorCenter.setAttribute('material','color', '#ff0000');
         
        };
        
 
        if( bool == true ){
            
            scope.cursorEl.addEventListener('mouseleave', mouseLeaveHandler);
            scope.cursorEl.addEventListener('click', clickHandler);
            //scope.cursorEl.appendChild(scope.fusingStartAnimation);
            scope.fusingStartAnimation.addEventListener('animationstart', fusingStartAnimationHandler);

        
        }
        else{
            
            scope.cursorEl.removeEventListener('mouseleave', mouseLeaveHandler);
            scope.cursorEl.removeEventListener('click', clickHandler);
            scope.fusingStartAnimation.removeEventListener('animationstart', fusingStartAnimationHandler);
            
        }
    },

    initControlUIAndRendering : function( ) {

        this.initRendering( );
        this.boundingSphereContainer.setAttribute('visible',true);
        this.sceneEl.setAttribute('vr-mode-ui','enabled: true');
        this.cameraEl.setAttribute('look-controls-enabled','true');
        new DisplayDataCommand(this.compass.compassWrapperEl.object3D,true);

    },

    initRendering : function( ){
        
        
        var counter = 0;
        var scope = this;
        scope.sceneEl.removeChild(scope.logo);
        
    
        var fileData = scope.fileData;
        var clusterNum = Object.keys(fileData).length;
        var outlierEl = this.outlierEl;
        //console.log(clusterNum);
        //console.log(fileData);
        var boundingBox = {
            minX: Infinity,
            minY: Infinity,
            minZ: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
            maxZ: -Infinity
        };
        
        scope.pointsEl.addEventListener('object3dset', function(evt){ 

            var id = evt.detail.type;
            var object = evt.detail.object;
            var boundingSphere = object.geometry.boundingSphere;
            scope.pointsDict[id] = evt.detail.object;
            console.log(id);
            console.log(boundingSphere)
            //evt.detail.object.visible = false;
        
            renderBoundingSphere( id, boundingSphere, 0);
        
        });
        
        outlierEl.addEventListener('object3dset', function(evt){ 

            var id = evt.detail.type;
            var object = evt.detail.object;
            var boundingSphere = object.geometry.boundingSphere;
            //console.log(boundingSphere);
            scope.pointsDict[id] = evt.detail.object;
           
           // console.log(evt.detail.object);
            //evt.detail.object.visible = false;
            renderBoundingSphere( id, boundingSphere, 1);
        
        });
        
        var colorCount = 0;
        for( var key in this.fileData ) {
           
            if( this.fileData.hasOwnProperty( key ) ) {
                
                var currCluster = this.fileData[key];
                var id = 'mpoints__'+key;
                //console.log(key);
                config.displayCluster[id] = true; 
                if(key == -1){
                   // console.log("outlier");
                    config.color[id] = '#035A75';
                    outlierEl.setAttribute( id, { positions: currCluster.positions , size: 1, color: config.color[id], textureSrc: 'null', sizeAttenuation: false } );
                }else{
                    config.color[id] = config.defaultColor[colorCount];
                    config.displayBoundingSphere[id] = true; 
                    scope.pointsEl.setAttribute( id, { positions: currCluster.positions ,featuresNum: scope.featuresNum, size: 2, color: config.defaultColor[colorCount] } );
                }
                
            }
            colorCount += 1;
           
        }
     

        function renderBoundingSphere (id, boundingSphere, outlier ){
            
            counter += 1;
            if (outlier != 1) {
                // var key = id.replace('mpoints__','');
                // var boundingSphereEl = document.createElement( 'a-entity' );
    
                // boundingSphereEl.setAttribute( 'id', 'bounding' + id );
             
                // if( boundingSphere.radius != 0 ) 
                //     boundingSphereEl.setAttribute( 'geometry', 'primitive: sphere; radius: ' + boundingSphere.radius );
                // else boundingSphereEl.setAttribute( 'geometry', 'primitive: sphere; radius: 2' );
                // boundingSphereEl.setAttribute( 'position', boundingSphere.center.x +' '+boundingSphere.center.y+' '+boundingSphere.center.z );
                // boundingSphereEl.setAttribute( 'material', 'transparent:true; opacity: 0.4; color: '+ config.color[id]);
            
                fileData[key].boundingSphere = boundingSphere;
                // scope.boundingSphereDict[id] = boundingSphereEl;
                // scope.boundingSphereContainer.appendChild( boundingSphereEl );
            }
            boundingBox = calculateBoundingBox( boundingBox, boundingSphere );

            if (counter == clusterNum) {

                config.boundingBox = {
                    width : Math.round((boundingBox.maxX - boundingBox.minX)*1.3),
                    height : Math.round((boundingBox.maxY - boundingBox.minY)*1.3),
                    depth : Math.round((boundingBox.maxZ - boundingBox.minZ)*1.3),
                    maxCoor : Math.max( boundingBox.maxX, boundingBox.maxY, boundingBox.maxZ ),
                    minCoor : Math.min( boundingBox.minX, boundingBox.minY, boundingBox.minZ ),
                    center : new THREE.Vector3( (boundingBox.maxX + boundingBox.minX)/2, (boundingBox.maxY + boundingBox.minY)/2, (boundingBox.maxZ + boundingBox.minZ)/2 )

                    
                };
                scope.axis.renderAxis(boundingBox);
                var cameraLookatDistance = 1.2*Math.max( config.boundingBox.width,config.boundingBox.height,config.boundingBox.depth );
                scope.cameraWrapperEl.setAttribute( 'position', '0 0 ' + cameraLookatDistance );
                scope.initCameraPosition = scope.cameraWrapperEl.object3D.position.clone();
                //scope.cursorEl.components.raycaster.refreshObjects();
                scope.flatScreenEditor.initFlatScreenUI();
                scope.vrEditor.initVrEditorUI();
                scope.highDemDetail.init();
                scope.keyboardControl.init();
                scope.voiceControl.init();
                scope.vrControl.init();
                scope.keyboardControl.enableKeyboardControl(true);
                scope.mouseControl.enableMouseControl(true);

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


    renderingPoints : function( ) {
        //var scope = this;
        //console.log('start to rendering point');
        this.pointContainer.setAttribute('visible',true);

    },

    hidePoints : function( ) {
       // var scope = this;
        this.pointContainer.setAttribute('visible',false);

    },  

    reset : function( ) {
        this.cameraWrapperEl.object3D.position.copy(this.initCameraPosition);
        this.cameraEl.setAttribute('rotation','0 0 0');
        this.cameraWrapperEl.object3D.updateMatrixWorld ( true ); 
        //this.cameraWrapperEl.object3D.updateMatrix (  );
        //this.cameraWrapperEl.setAttribute( 'position', this.initCameraPosition );
        

    },

    renderingBoundingSphere : function( ) {
    //var this = this;
        console.log('start to rendering point');
        this.pointContainer.setAttribute('visible',true);

    }

}