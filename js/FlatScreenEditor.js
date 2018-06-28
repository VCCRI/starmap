var FlatScreenEditor = function (viewPort) {
    //console.log(viewPort);
    this.viewPort = viewPort;
    this.cameraEl = viewPort.cameraEl;
    this.reclusterTool = viewPort.reclusterTool;
    this.settingGUI = null;
    this.dataEditorGUI = null;
    //this.selectBox =  this.reclusterTool.selectBox;
    this.container = viewPort.container.object3D;
    this.cameraWrapperEl = viewPort.cameraWrapperEl;
    this.raycaster = viewPort.cursorEl.components.raycaster;
    this.highDemDetail = viewPort.highDemDetail;
  
    //console.log(this.raycaster);
     // gamepad helper
    var keyboardHelpPanel = this.keyboardHelpPanel = document.createElement('a-entity');
    keyboardHelpPanel.setAttribute("geometry","primitive:plane;height: 4; width: 8");
    keyboardHelpPanel.setAttribute("material","color:#AAAAAA;transparent:true; opacity:0.7");
    keyboardHelpPanel.setAttribute("position","0 0 -5.1");
    keyboardHelpPanel.setAttribute("scale","0 0 0");
    
    var keyboardHelpPopUp = document.createElement('a-animation');
    keyboardHelpPopUp.setAttribute('begin', 'keyboardhelp');
    keyboardHelpPopUp.setAttribute('attribute', 'scale');
    keyboardHelpPopUp.setAttribute('to', '1 1 1');
    keyboardHelpPopUp.setAttribute('dur', '1000');
    keyboardHelpPanel.appendChild(keyboardHelpPopUp);
   
   
    var keyboardHelpDisappear = document.createElement('a-animation');
    keyboardHelpDisappear.setAttribute('begin', 'keyboardhelpend');
    keyboardHelpDisappear.setAttribute('attribute', 'scale');
    keyboardHelpDisappear.setAttribute('to', '0 0 0');
    keyboardHelpDisappear.setAttribute('dur', '500');
    keyboardHelpPanel.appendChild(keyboardHelpDisappear);
    
    
    var gpgeometry = new THREE.PlaneGeometry( 8,4 );
    var gptexture = new THREE.TextureLoader().load('image/keyboard2.png');
    var gpmaterial = new THREE.MeshBasicMaterial( {map: gptexture,color:0xffffff, side: THREE.FrontSide, alphaTest:0.5} );
    var gptext = this.gptext =  new THREE.Mesh( gpgeometry, gpmaterial );
    gptext.position.set(-0.1,0,0.01);
    keyboardHelpPanel.object3D.add(gptext);
    this.cameraEl.appendChild(keyboardHelpPanel);

}

FlatScreenEditor.prototype = {

    initFlatScreenUI : function ( ) {

        var scope = this;
  
        scope.settingGUI = new dat.GUI({ width: 300, closeOnTop:true, name: 'Custom Settings'} );
    
        // Show All Points
        scope.settingGUI.add(config, 'showAllPoints' ).name( 'Display All Points' ).listen( ).onChange( function ( isDisplay ) {
            for( var key in config.displayCluster ) {
                config.displayCluster[key] = isDisplay;
                new DisplayDataCommand( viewPort.pointsDict[key], isDisplay );
                scope.highDemDetail.setVisible(key, isDisplay );
            }
 
        });

        // Display All Bounding Sphere
        // scope.settingGUI.add(config, 'showAllBounding' ).name( 'Display All Bounding Sphere' ).listen( ).onChange( function ( isDisplay  ) {
       
        //     for( var key in config.displayBoundingSphere ) {
                
        //         config.displayBoundingSphere[key] = isDisplay;
        //         new DisplayDataCommand( viewPort.boundingSphereDict[key].object3D, isDisplay );
          
        //     }
        // });

        //  Display Points, Display Bounding, Cluster Color for each cluster
        for( var cluster in config.color ) { 
            
            config.clusterList.push( cluster );
            var name = cluster.replace( 'mpoints__','' );
            if( name != -1 ) var currCluster = 'Cluster ' + name;
            else var currCluster = 'Outliers';
            //var clusterFolder = scope.settingGUI.addFolder( folderName, config.color[cluster] );

            scope.settingGUI.add( config.displayCluster, cluster ).name( 'Display '+currCluster,config.color[cluster] ).listen( ).onChange( function ( isDisplay ) {
                new DisplayDataCommand( viewPort.pointsDict[this.property], isDisplay );
                scope.highDemDetail.setVisible(this.property, isDisplay);
    
            });
           
            // if(name != -1) {
            //     clusterFolder.add( config.displayBoundingSphere, cluster ).name( 'Display Bounding' ).listen( ).onChange(
            //          function ( isDisplay ) {
            //             new DisplayDataCommand( viewPort.boundingSphereDict[this.property].object3D, isDisplay );
            //     });
            // }

        }
        
        
         var featureMapFolder = scope.settingGUI.addFolder( 'Feature Map', '#FFFFFF' );
         
        featureMapFolder.open();
        
        for ( var i = 0 ; i < config.featureMap.length ; i += 1 ) {
            var name = i + 1;
            featureMapFolder.add(config.featureMap[i] , Object.keys(config.featureMap[i])[0] ).name( name +' -> ' + Object.keys(config.featureMap[i])[0] );
        // console.log(config.featureMap);

        }
        
    // reset view
    var reset =  {
        reset: function(){
            scope.viewPort.reset();
    
        }
                
    };

    scope.settingGUI.add(reset, 'reset' ).name( "Reset Camera" );

        var helpStarted = false;    
        var keyboardHelp =  {
            help: function(){
                if (helpStarted) return;
                helpStarted = true;
                scope.keyboardHelpPanel.emit('keyboardhelp');
                
                setTimeout(function () {
                    
                    helpStarted = false;
                    scope.keyboardHelpPanel.emit('keyboardhelpend');
                    
                },10000);
            }
            
        };
       
        scope.settingGUI.add(keyboardHelp, 'help' ).name( "Help" );
        //window.location.reload(true);



        var exitParam = {
            exit : function() { 
                window.location.reload(true);
            }
        }
        
        scope.settingGUI.add(exitParam,'exit').name('Exit');
    },

    removeFlatScreenUI : function ( ) {
        console.log( 'destroy FlatScreen UI' );
        this.settingGUI.destroy( );
      //  this.dataEditorGUI.destroy( );
    },
    
    hideFlatScreenUI : function ( ) {
        console.log( 'hide FlatScreen UI' );
        //this.dataEditorGUI.hide( );
        this.settingGUI.hide( );
    },

    displayFlatScreenUI : function ( ) {
        console.log( 'show FlatScreen UI' );
        //this.dataEditorGUI.show( );
        this.settingGUI.show( );
    }

}