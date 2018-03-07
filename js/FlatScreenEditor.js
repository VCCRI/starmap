var FlatScreenEditor = function (viewPort) {
    console.log(viewPort);
    this.settingGUI = null;
    this.cameraEl = null;
    this.dataEditorGUI = null;
    

}

FlatScreenEditor.prototype = {

    addFlatScreenUI : function ( ) {

        var cameraEl = this.cameraEl = viewPort.cameraEl;
        // Custom Setting GUI
        this.settingGUI = new dat.GUI({ width: 275, closeOnTop:true, name: 'Custom Settings'} );
    
        // Show All Points
        this.settingGUI.add(config, 'showAllPoints' ).name( 'Display All Points' ).onChange( function ( isDisplay ) {
            for( var key in config.displayCluster ) {
                config.displayCluster[key] = isDisplay;
                new DisplayDataCommand( viewPort.pointsDict[key], isDisplay );
            }
        });
        // Display All Bounding Sphere
        this.settingGUI.add(config, 'showAllBounding' ).name( 'Display All Bounding Sphere' ).onChange( function ( isDisplay  ) {
            for( var key in config.displayBoundingSphere ) {
                config.displayBoundingSphere[key] = isDisplay;
                new DisplayDataCommand( viewPort.boundingSphereDict[key], isDisplay );
            }
        });

        //  Display Points, Display Bounding, Cluster Color for each cluster
        for( var cluster in config.color ) { 
            config.clusterList.push( cluster );
            var clusterFolder = this.settingGUI.addFolder( 'Cluster ' + cluster );
            clusterFolder.add( config.displayCluster, cluster ).name( 'Display Points' ).listen( ).onChange( function ( isDisplay ) {
                new DisplayDataCommand( viewPort.pointsDict[this.property], isDisplay );
            });
            
            clusterFolder.add( config.displayBoundingSphere, cluster ).name( 'Display Bounding' ).listen( ).onChange(
                 function ( isDisplay ) {
                new DisplayDataCommand( viewPort.boundingSphereDict[this.property], isDisplay );
            });

            clusterFolder.addColor( config.color, cluster ).name( 'Cluster Color' ).onFinishChange( function ( color ) {
                new ChangeColorCommand( viewPort, this.property, color );
            });

        }
       

        // Data Editor GUI

        var dataEditorContainer = document.createElement( 'div' );
        dataEditorContainer.setAttribute( 'id', 'dataEditorContainer' );
        this.dataEditorGUI = new dat.GUI({ width: 300, closeOnTop:true, autoPlace:false ,name:'Data Editor'} );
      
        
        var fileUploaded = function ( ) {
            //boundingBoxEl.setAttribute( 'visible', false );
            gui.destroy( );
            viewPort.initControlUIAndRendering( fileData );
        }

        var obj = { startToExplore : fileUploaded };

        // View Perspective
        var dataEditorMenu = {
             viewPerspective : '',
            //     front: function ( ) {
              
            //         var pos = viewPort.cameraWrapperEl.object3D.position;
            //         //var newRotation = new THREE.Euler( );
            //         //console.log(distance);
            //        // new SetPositionCommand( this.cameraEl, pos.x, pos.y,pos.z );
            //         new SetRotationCommand( this.cameraEl, new THREE.Euler(0, 0, 0 ) );

            //     },
            //     back: function ( ) {
            //         //console.log(distance);
            //         new SetRotationCommand( this.cameraEl, new THREE.Euler(0, 1.57, 0 ) );
            //     },           
            //     left: function ( ) {
            //         new SetRotationCommand( this.cameraEl, new THREE.Euler(0, -0.785, 0 ) );
            //     },
            //     right: function ( ) {
            //         new SetRotationCommand( this.cameraEl, new THREE.Euler(0, 0.785, 0 ) );
            //     },
            //     top: function ( ) {
            //         new SetRotationCommand( this.cameraEl, new THREE.Euler( -0.785, 0, 0 ) );
            //     },
            //     down: function ( ) {
            //         new SetRotationCommand( this.cameraEl, new THREE.Euler( 0.785, 0, 0 ) );
            //     },
            // },
            selectBy : '',
            reclusterClass : '',
            selectFinish : function ( ) {
                cameraEl.setAttribute('look-controls-enabled',true);
                viewPerspectiveDom.style.display = 'none';
                console.log("select finished");
                modifyFolder.show();
            },
            confirm : function ( ) {
                modifyFolder.hide();
                this.selectBy = '';
                console.log('confirm');
            }

        }

       
 
        /** 
         * Recluster Menu
         **/
        var reclusterFolder = this.dataEditorGUI.addFolder( 'Recluster' );

        reclusterFolder.add( dataEditorMenu, 'selectBy', ['Area', 'Cluster'] ).name( 'Select By' ).listen( ).onChange( function ( type ) {

            if (type == 'Area') {
                cameraEl.setAttribute('look-controls-enabled', false );
                viewPerspectiveDom.style.display = '';
                //viewPerspectiveFolder.show( );
                //TODO add a box To viewPort

            }else if(type == 'Cluster' ) {
                cameraEl.setAttribute('look-controls-enabled', true );
                viewPerspectiveDom.style.display = 'none';
                console.log('select by clusters');
            } 

        })
        
        var viewPerspectiveList = reclusterFolder.add( dataEditorMenu, 'viewPerspective', ['front', 'Back', 'Left', 'Right', 'Top', 'Down'] ).onChange( function( perspective ) { 
            if( perspective == 'Front' ) {

            }else if( perspective == 'Back' ) {


            }else if( perspective == 'Left' ) {


            }else if( perspective == 'Right' ) {


            }else if( perspective == 'Top' ) {


            }else if( perspective == 'Down' ) {


            }
        });
        var viewPerspectiveDom = viewPerspectiveList.domElement.parentElement.parentElement;
        
        //viewPerspectiveList.hide();
        viewPerspectiveDom.style.display = 'none';
        console.log(viewPerspectiveList);
        // var viewPerspectiveFolder = reclusterFolder.addFolder( 'select Perspective' );
        // viewPerspectiveFolder.add( dataEditorMenu.viewPerspective, 'front' ).name( 'Front View' );
        // viewPerspectiveFolder.add( dataEditorMenu.viewPerspective, 'back' ).name( 'Back View' );
        // viewPerspectiveFolder.add( dataEditorMenu.viewPerspective, 'left' ).name( 'Left View' );
        // viewPerspectiveFolder.add( dataEditorMenu.viewPerspective, 'right' ).name( 'Right View' );
        // viewPerspectiveFolder.add( dataEditorMenu.viewPerspective, 'top' ).name( 'Top View' );
        // viewPerspectiveFolder.add( dataEditorMenu.viewPerspective, 'down' ).name( 'Down View' );
        // viewPerspectiveFolder.hide( );

        // selectBoxFolder
        reclusterFolder.add( dataEditorMenu, 'selectFinish' ).name( 'Finish Select' );


        // Finish Select
        reclusterFolder.add( dataEditorMenu, 'selectFinish' ).name( 'Finish Select' );

        /** 
         * Modification Menu
         **/
        var modifyFolder = reclusterFolder.addFolder( 'Modification' );
        modifyFolder.hide();
        
        // Change Cluster
        var reclusterTo = modifyFolder.add( dataEditorMenu, 'reclusterClass', config.clusterList  ).name( 'Change Cluster to' );

        // Confirm
        modifyFolder.add( dataEditorMenu, 'confirm' ).name( 'Confirm Moification' );

        // History Menu
        var historyFolder = this.dataEditorGUI.addFolder( 'History' );


        dataEditorContainer.appendChild( this.dataEditorGUI.domElement );
        document.querySelector( 'body' ).appendChild( dataEditorContainer );

    },
    
    addSelectArea : function ( ) {
        var cameraDirection = this.cameraEl.object3D.getWorldDirection();

        var pos = viewPort.cameraWrapperEl.object3D.position;

    },

    removeFlatScreenUI : function ( ) {
        console.log( 'destroy FlatScreen UI' );
        this.settingGUI.destroy( );
        this.dataEditorGUI.destroy( );
    },
    
    hideFlatScreenUI : function ( ) {
        console.log( 'hide FlatScreen UI' );
        this.dataEditorGUI.hide( );
        this.settingGUI.hide( );
    },

    displayFlatScreenUI : function ( ) {
        console.log( 'show FlatScreen UI' );
        this.dataEditorGUI.show( );
        this.settingGUI.show( );
    }

}