var VrEditor = function(viewPort) {

    this.viewPortCamera = null;
    this.sceneEl = viewPort.sceneEl;
    this.scene = this.sceneEl.object3D;
    this.gui = dat.GUIVR.create( 'Settings' );

    this.keydown = 0;
    this.isGrab = 0;
    // console.log(this.gui);
    config.cursorEl = viewPort.cursorEl;
   
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
    gamepadHelpPanel.setAttribute("position","0 0 -5.1");
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
            // viewPort.cursorEl.components.raycaster.objects.push(this.guiEl);
            viewPort.cursorEl.components.raycaster.refreshObjects();
            //console.log(viewPort.cursorEl.components);
        var scope = this;
        var cameraWrapperEl = scope.cameraWrapperEl;
        var cameraPosition = cameraWrapperEl.object3D.position;
        scope.viewPortCamera = scope.viewPort.cameraEl.object3D.getObjectByProperty( "type", "PerspectiveCamera" );
        var gazeInput = dat.GUIVR.addInputObject( scope.viewPortCamera, scope.viewPort.cursorEl.components.raycaster.raycaster, viewPort.cursorEl );
        config.cursorEl.addEventListener('grabbed', function(){
            scope.isGrab = 1;
        });
        config.cursorEl.addEventListener('grabReleased', function(){
         
            scope.isGrab = 0;
        });
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


        // scope.gui.geometry = new THREE.Geometry();
        scope.gui.position.set(-2,2,0);
        
        scope.gui.scale.set(3,3,1);
 
    
   
        scope.guiContainer.lookAt(cameraPosition);

       
        

        scope.gui.add(config, 'showAllPoints' ).name( 'Display All Points' ).listen( ).onChange( function ( isDisplay ) {
            //console.log(isDisplay);
             for( var key in config.displayCluster ) {
                config.displayCluster[key] = isDisplay.value;
                new DisplayDataCommand( scope.viewPort.pointsDict[key], isDisplay.value );
            }
        });
        
        
        // scope.gui.add(config, 'showAllBounding' ).name( 'Display All Bounding Sphere' ).listen( ).onChange( function ( isDisplay  ) {
            
        //    for( var key in config.displayBoundingSphere ) {
                
        //         config.displayBoundingSphere[key] = isDisplay.value;
        //         new DisplayDataCommand( scope.viewPort.boundingSphereDict[key].object3D, isDisplay.value );
        //     }
 
        // });

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
        
    // reset view
        var reset =  {
            reset: function(){
                scope.viewPort.reset();
                scope.resetUIPoistion();
        
            }
                    
        };

    scope.gui.add(reset, 'reset' ).name( "Reset Camera" );

        var helpStarted = false;    
        var gamePadHelp =  {
            help: function(){
                if (helpStarted) return;
                helpStarted = true;
                scope.gamepadHelpPanel.emit('gamepadhelp');
                
                setTimeout(function () {
                    
                    helpStarted = false;
                    scope.gamepadHelpPanel.emit('gamepadhelpend');
                    
                },10000);
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
                scope.keydown = 1;
                map = {};
            }else if(map[71]){
                scope.guiEl.emit("releaseMenu");
                scope.keydown = 0;
                map = {};
            }else if(map[86]) {
                scope.resetUIPoistion();
                
            }
            
            
    });
    

        scope.cameraWrapperEl.addEventListener('componentchanged', function (evt) { 
            if (scope.isGrab == 1 ) return;
            
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
        var fix = 0;
        var quanternion = scope.cameraEl.object3D.quaternion;
        var delta = 4;
        var fixRP = new THREE.Vector3();
        var preLen = 0;
        scope.cameraEl.addEventListener('componentchanged', function (evt) {
          //  console.log(scope.guiContainer)
            
            if ( evt.detail.name !== 'rotation' ) return;
            if( scope.keydown == 0 )//{
           
        //     var newPos = scope.hiddenChild.getWorldPosition();
        //    // newPos.y = 0;
        //     var relativeP = new THREE.Vector3().subVectors(newPos,scope.guiContainer.position);
        //     var len = relativeP.length();
        //     if( len > 5 && len > preLen ){
        //         // if(fix == 0) {
        //         //     fixRP = relativeP.clone();
        //         //    // delta = len+0.02;
        //         //     fix = 1;
        //         // }
        //         fixRP = relativeP.normalize().multiplyScalar(4);
        //       //  console.log(';settting')
        //         //console.log(new THREE.Vector3().subVectors(newPos,relativeP));
        //         //console.log(scope.guiContainer.position);
        //         scope.guiContainer.position.copy(new THREE.Vector3().subVectors(newPos,fixRP));

        //     }
        //     preLen = len;

            scope.guiContainer.quaternion.copy( quanternion );
            //}
        });


    },
    
    hideVrUI : function ( ) {
        this.sceneEl.removeChild( this.guiEl );
    },

    displayVrUI : function ( ) {
        
        // var newPos = this.hiddenChild.getWorldPosition();
        // this.guiEl.setAttribute('position', newPos.x + ' ' + newPos.y + ' ' + newPos.z );
        this.resetUIPoistion();
        this.sceneEl.appendChild( this.guiEl );
    
    },
    
    resetUIPoistion : function( ) {
        var newPos = this.hiddenChild.getWorldPosition();
        this.guiEl.setAttribute('position', newPos.x + ' ' + newPos.y + ' ' + newPos.z );
   
      
    }


   
}