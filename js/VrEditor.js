var VrEditor = function(viewPort) {

    this.viewPortCamera = null;
    this.sceneEl = viewPort.sceneEl;
    this.scene = this.sceneEl.object3D;
    this.gui = dat.GUIVR.create( 'Settings' );
    
    // console.log(this.gui);
    //       this.gui.dom.setAttribute('class', 'clickable');
    this.guiEl = document.createElement('a-entity');  
    this.viewPort = viewPort;
    this.guiContainer = this.guiEl.object3D;
    this.cameraWrapperEl = viewPort.cameraWrapperEl;
    this.guiContainer.add(this.gui);
 //   this.initPositionOffset = {x: 2, y: 2, z: 5.5};
    this.unitVector = new THREE.Vector3(0, 1, 0);
    this.hiddenChild = viewPort.hiddenChild;
}

VrEditor.prototype = {

    initVrEditorUI : function() {
        var scope = this;
        var cameraWrapperEl = scope.cameraWrapperEl;
        var cameraPosition = cameraWrapperEl.object3D.position;
        scope.viewPortCamera = scope.viewPort.cameraEl.object3D.getObjectByProperty( "type", "PerspectiveCamera" );
        var gazeInput = dat.GUIVR.addInputObject( scope.viewPortCamera, scope.viewPort.cursorEl.components.raycaster.raycaster );
        


       // scope.scene.add( gazeInput.cursor );
        
      //  gazeInput.cursor.position.set(0, 0, -5.1)

        ['pressMenu']
        .forEach( function(e){
            window.addEventListener(e, function(){
                gazeInput.pressed( true );

            }, false );
        });
        
        ['pressedMenu']
        .forEach( function(e) {
             window.addEventListener(e, function(){
                 
                gazeInput.pressed( true );
                setTimeout(function(){gazeInput.pressed( false )},200)

            }, false );
        });
        
        ['releaseMenu']
        .forEach( function(e){
            window.addEventListener(e, function(){
                gazeInput.pressed( false );
      
            }, false );
        });

        //var { camera, renderer } = this.sceneEl;
        
        
        scope.gui.position.x = 0;
        scope.gui.position.y = 0;
        scope.gui.position.z = 0;
        scope.gui.scale.set(3,3,3);
 
    
        var newPos = this.hiddenChild.getWorldPosition();
        this.guiEl.setAttribute('position', newPos.x + ' ' + newPos.y + ' ' + newPos.z );
        scope.guiContainer.lookAt(cameraPosition);

       
        

        scope.gui.add(config, 'showAllPoints' ).name( 'Display All Points' ).listen( ).onChange( function ( isDisplay ) {
            //console.log(isDisplay);
             for( var key in config.displayCluster ) {
                config.displayCluster[key] = isDisplay.value;
                new DisplayDataCommand( scope.viewPort.pointsDict[key], isDisplay.value );
            }
        });
        
        
        scope.gui.add(config, 'showAllBounding' ).name( 'Display All Bounding Sphere' ).listen( ).onChange( function ( isDisplay  ) {
            
           for( var key in config.displayBoundingSphere ) {
                
                config.displayBoundingSphere[key] = isDisplay.value;
                new DisplayDataCommand( scope.viewPort.boundingSphereDict[key].object3D, isDisplay.value );
            }
 
        });

        //add show points, show bounding and change color for each cluster
        for( var cluster in config.color ) { 
            
            var name = cluster.replace( 'mpoints__','' );
            if( name != -1 ) var folderName = 'Cluster ' + name;
            else var folderName = 'Outliers';
            var clusterFolder = dat.GUIVR.create( folderName, config.color[cluster] );
            clusterFolder.add( config.displayCluster, cluster ).name( 'Display Points' ).listen( ).onChange( function( isDisplay ) {
                //console.log(isDisplay)
                 new DisplayDataCommand( scope.viewPort.pointsDict[isDisplay.name], isDisplay.value );
                           
 
            });
             if(name != '-1') {
            clusterFolder.add( config.displayBoundingSphere, cluster ).name( 'Display Bounding' ).listen( ).onChange(
                 function( isDisplay ) {
                     //console.log(isDisplay)
                      new DisplayDataCommand( scope.viewPort.boundingSphereDict[isDisplay.name].object3D, isDisplay.value );
             
                }
            );
             }

            scope.gui.addFolder( clusterFolder );
           
    
        }
        
        
        var featureMapFolder = dat.GUIVR.create( 'Feature Map', '#FFFFFF' );
        
        for ( var i = 0 ; i < config.featureMap.length ; i += 1 ) {
            
            var name = i + 1;
            featureMapFolder.add(config.featureMap[i] , Object.keys(config.featureMap[i])[0] ).name( name + " " );
        }
            
        scope.gui.addFolder( featureMapFolder );
        var b = scope.viewPort.cameraEl;
        var a = scope.viewPort.cameraWrapperEl;
      

        window.addEventListener( 'keydown', function( e ) {
            e.preventDefault( );
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            
            if(map[79]){
              scope.guiEl.emit("pressMenu");
              map = {};
            }else if(map[71]){
                scope.guiEl.emit("releaseMenu");
                map = {};
            }else if(map[85]) {
                scope.resetUIPoistion();
                
            }
            
            
    })
    
        scope.viewPort.fusingStartAnimation.addEventListener('animationend', function(){
            
            //console.log('end');
        });

        a.addEventListener('componentchanged', function (evt) { 
            
            if ( evt.detail.name == 'position' ) {
                var newPos = evt.detail.newData;
                var oldPos = evt.detail.oldData;
                scope.guiContainer.position.x = newPos.x + scope.guiContainer.position.x-oldPos.x;
                scope.guiContainer.position.y = newPos.y + scope.guiContainer.position.y-oldPos.y;
                scope.guiContainer.position.z = newPos.z + scope.guiContainer.position.z-oldPos.z;
            //}
            }


        })
        //
    

        b.addEventListener('componentchanged', function (evt) {
            if ( evt.detail.name !== 'rotation' ) return;
                var degRotation =  evt.detail.newData;
                var cameraRotation = { x: THREE.Math.degToRad(degRotation.x), y: THREE.Math.degToRad(degRotation.y), z: THREE.Math.degToRad(degRotation.z) };
                scope.guiContainer.rotation.x = cameraRotation.x;
                scope.guiContainer.rotation.y = cameraRotation.y;
                scope.guiContainer.rotation.z = cameraRotation.z;
        })


    },
    
    hideVrUI : function ( ) {
        this.sceneEl.removeChild( this.guiEl );
    },

    displayVrUI : function ( ) {
        
        var newPos = this.hiddenChild.getWorldPosition();
        this.guiEl.setAttribute('position', newPos.x + ' ' + newPos.y + ' ' + newPos.z );
        this.sceneEl.appendChild( this.guiEl );
    
    },
    
    resetUIPoistion : function( ) {
        
        var newPos = this.hiddenChild.getWorldPosition();
        this.guiContainer.position.set(newPos.x, newPos.y, newPos.z);
      
    }


   
}