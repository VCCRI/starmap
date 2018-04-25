var VrEditor = function(viewPort) {

    this.viewPortCamera = null;
    this.sceneEl = viewPort.sceneEl;
    this.scene = this.sceneEl.object3D;
    this.gui = dat.GUIVR.create( 'Settings' );
    this.keydown = 0;
    // console.log(this.gui);
    //       this.gui.dom.setAttribute('class', 'clickable');
    this.guiEl = document.createElement('a-entity');  
    this.viewPort = viewPort;
    this.guiContainer = this.guiEl.object3D;
    this.cameraEl = viewPort.cameraEl;
    this.cameraWrapperEl = viewPort.cameraWrapperEl;
    this.guiContainer.add(this.gui);
 //   this.initPositionOffset = {x: 2, y: 2, z: 5.5};
    this.unitVector = new THREE.Vector3(0, 1, 0);
    this.hiddenChild = viewPort.hiddenChild;
    
    // gamepad helper
    var gamepadHelpPanel = this.gamepadHelpPanel = document.createElement('a-entity');
    gamepadHelpPanel.setAttribute("geometry","primitive:plane;height: 4; width: 7");
    gamepadHelpPanel.setAttribute("material","color:#AAAAAA;transparent:true; opacity:0.7");
    gamepadHelpPanel.setAttribute("position","0 0 -5.05");
    gamepadHelpPanel.setAttribute("scale","0 0 0");
    
    var gamepadHelpPopUp = document.createElement('a-animation');
    gamepadHelpPopUp.setAttribute('begin', 'gamepadhelp');
    gamepadHelpPopUp.setAttribute('attribute', 'scale');
    gamepadHelpPopUp.setAttribute('to', '1 1 1');
    gamepadHelpPopUp.setAttribute('dur', '1000');
    gamepadHelpPanel.appendChild(gamepadHelpPopUp);
   
   
    var gamepadHelpDisappear = document.createElement('a-animation');
    gamepadHelpDisappear.setAttribute('begin', 'gamepadhelpend');
    gamepadHelpDisappear.setAttribute('attribute', 'scale');
    gamepadHelpDisappear.setAttribute('to', '0 0 0');
    gamepadHelpDisappear.setAttribute('dur', '500');
    gamepadHelpPanel.appendChild(gamepadHelpDisappear);
    
    
    var gpgeometry = new THREE.PlaneGeometry( 4, 4);
    var gptexture = new THREE.TextureLoader().load('image/gamepad.png');
    var gpmaterial = new THREE.MeshBasicMaterial( {map: gptexture,color:0xffffff, side: THREE.FrontSide, alphaTest:0.5} );
    var gptext = this.gptext =  new THREE.Mesh( gpgeometry, gpmaterial );
    gptext.position.set(-0.1,0,0.01);
    gamepadHelpPanel.object3D.add(gptext);
    
    this.cameraEl.appendChild(gamepadHelpPanel);
}

VrEditor.prototype = {

    initVrEditorUI : function() {
        var scope = this;
        var cameraWrapperEl = scope.cameraWrapperEl;
        var cameraPosition = cameraWrapperEl.object3D.position;
        scope.viewPortCamera = scope.viewPort.cameraEl.object3D.getObjectByProperty( "type", "PerspectiveCamera" );
        var gazeInput = dat.GUIVR.addInputObject( scope.viewPortCamera, scope.viewPort.cursorEl.components.raycaster.raycaster );

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
                setTimeout(function(){gazeInput.pressed( false );},200);

            }, false );
        });
        
        ['releaseMenu']
        .forEach( function(e){
            window.addEventListener(e, function(){
                gazeInput.pressed( false );
      
            }, false );
        });


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
            if( name != -1 ) var currCluster = 'Cluster ' + name;
            else var currCluster = 'Outliers';
            //var clusterFolder = dat.GUIVR.create( folderName, config.color[cluster] );
            scope.gui.add( config.displayCluster, cluster  ).name( 'Display '+currCluster,config.color[cluster] ).listen( ).onChange( function( isDisplay ) {
                //console.log(isDisplay)
                 new DisplayDataCommand( scope.viewPort.pointsDict[isDisplay.name], isDisplay.value );
                           
 
            });
            //  if(name != -1) {
            // clusterFolder.add( config.displayBoundingSphere, cluster ).name( 'Display Bounding' ).listen( ).onChange(
            //      function( isDisplay ) {
            //          //console.log(isDisplay)
            //           new DisplayDataCommand( scope.viewPort.boundingSphereDict[isDisplay.name].object3D, isDisplay.value );
             
            //     }
            // );
            //  }

           // scope.gui.addFolder( clusterFolder );
           
    
        }
        
        
        var featureMapFolder = dat.GUIVR.create( 'Feature Map', '#FFFFFF' );

  

        for ( var i = 0 ; i < config.featureMap.length ; i += 1 ) {
            
            var name = i + 1;
            featureMapFolder.add(config.featureMap[i] , Object.keys(config.featureMap[i])[0] ).name( name + " " );
        }

        scope.gui.addFolder( featureMapFolder );
        
        var helpStarted = false;    
        var gamePadHelp =  {
            help: function(){
                if (helpStarted) return;
                helpStarted = true;
                scope.gamepadHelpPanel.emit('gamepadhelp');
                
                setTimeout(function () {
                    
                    helpStarted = false;
                    scope.gamepadHelpPanel.emit('gamepadhelpend');
                    
                },5000);
            }
            
        }
       
        scope.gui.add(gamePadHelp, 'help' ).name( "Help" );
        // var b = scope.viewPort.cameraEl;
        // var a = scope.viewPort.cameraWrapperEl;
      

        window.addEventListener( 'keydown', function( e ) {
            e.preventDefault( );
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            
            if(map[79]){
                scope.guiEl.emit("pressMenu");
                scope.keydown = 1
                map = {};
            }else if(map[71]){
                scope.guiEl.emit("releaseMenu");
                scope.keydown = 0
                map = {};
            }else if(map[86]) {
                scope.resetUIPoistion();
                
            }
            
            
    })
    

        scope.cameraWrapperEl.addEventListener('componentchanged', function (evt) { 
            
            if ( evt.detail.name == 'position' ) {
                var newPos = evt.detail.newData;
                var oldPos = evt.detail.oldData;
                scope.guiContainer.position.x = newPos.x + scope.guiContainer.position.x-oldPos.x;
                scope.guiContainer.position.y = newPos.y + scope.guiContainer.position.y-oldPos.y;
                scope.guiContainer.position.z = newPos.z + scope.guiContainer.position.z-oldPos.z;
            //}
            }


        });
        //
    
        var quanternion = scope.cameraEl.object3D.quaternion;
        scope.cameraEl.addEventListener('componentchanged', function (evt) {
            
            if ( evt.detail.name !== 'rotation' ) return;
            if( scope.keydown == 0 )
            scope.guiContainer.quaternion.copy( quanternion );

        });


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