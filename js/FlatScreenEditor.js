var FlatScreenEditor = function (viewPort) {
    //console.log(viewPort);
    
    this.cameraEl = viewPort.cameraEl;
    this.reclusterTool = viewPort.reclusterTool;
    this.settingGUI = null;
    this.dataEditorGUI = null;
    //this.selectBox =  this.reclusterTool.selectBox;
    this.container = viewPort.container.object3D;
    this.cameraWrapperEl = viewPort.cameraWrapperEl;
    this.raycaster = viewPort.cursorEl.components.raycaster;
  
    //console.log(this.raycaster);
    

}

FlatScreenEditor.prototype = {

    initFlatScreenUI : function ( ) {

        var scope = this;
  
        scope.settingGUI = new dat.GUI({ width: 275, closeOnTop:true, name: 'Custom Settings'} );
    
        // Show All Points
        scope.settingGUI.add(config, 'showAllPoints' ).name( 'Display All Points' ).listen( ).onChange( function ( isDisplay ) {
            for( var key in config.displayCluster ) {
                config.displayCluster[key] = isDisplay;
                new DisplayDataCommand( viewPort.pointsDict[key], isDisplay );
            }
 
        });

        // Display All Bounding Sphere
        scope.settingGUI.add(config, 'showAllBounding' ).name( 'Display All Bounding Sphere' ).listen( ).onChange( function ( isDisplay  ) {
       
            for( var key in config.displayBoundingSphere ) {
                
                config.displayBoundingSphere[key] = isDisplay;
                new DisplayDataCommand( viewPort.boundingSphereDict[key].object3D, isDisplay );
            }
        });

        //  Display Points, Display Bounding, Cluster Color for each cluster
        for( var cluster in config.color ) { 
            
            config.clusterList.push( cluster );
            var name = cluster.replace( 'mpoints__','' );
            if( name != -1 ) var folderName = 'Cluster ' + name;
            else var folderName = 'Outliers';
            var clusterFolder = scope.settingGUI.addFolder( folderName, config.color[cluster] );

            clusterFolder.add( config.displayCluster, cluster ).name( 'Display Points' ).listen( ).onChange( function ( isDisplay ) {
                new DisplayDataCommand( viewPort.pointsDict[this.property], isDisplay );
            });
            if(name != '-1') {
                clusterFolder.add( config.displayBoundingSphere, cluster ).name( 'Display Bounding' ).listen( ).onChange(
                     function ( isDisplay ) {
                        new DisplayDataCommand( viewPort.boundingSphereDict[this.property].object3D, isDisplay );
                });
            }

        }
        
        
         var featureMapFolder = scope.settingGUI.addFolder( 'Feature Map', '#FFFFFF' );
         
         
        
        for ( var i = 0 ; i < config.featureMap.length ; i += 1 ) {
            var name = i + 1;
            featureMapFolder.add(config.featureMap[i] , Object.keys(config.featureMap[i])[0] ).name( name +' -> ' + Object.keys(config.featureMap[i])[0] );
        // console.log(config.featureMap);

        }

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