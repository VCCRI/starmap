var VrEditor = function(viewPort) {
    console.log(viewPort);
    this.gui = null;
    this.viewPortCamera = null;
    this.sceneEl = viewPort.sceneEl;
    this.scene = this.sceneEl.object3D;
}

VrEditor.prototype = {

    addVrEditorUI : function() {
        var cameraWrapperEl = viewPort.cameraWrapperEl;
        var initPos = cameraWrapperEl.object3D.position;
        this.viewPortCamera = viewPort.cameraEl.object3D.getObjectByProperty ( "type", "PerspectiveCamera" );
        var gazeInput = dat.GUIVR.addInputObject( this.viewPortCamera );
        this.scene.add( gazeInput.cursor );

        ['aEvent']
        .forEach( function(e){
            window.addEventListener(e, function(){
                gazeInput.pressed( true );
                console.log("Down");
            }, false );
        });
        ['bEvent']
        .forEach( function(e){
            window.addEventListener(e, function(){
                gazeInput.pressed( false );
                console.log("up");
            }, false );
        });

        var { camera, renderer } = this.sceneEl;
        var gui = this.gui = dat.GUIVR.create( 'Settings' );
            this.gui.position.x = initPos.x+0.5;
            this.gui.position.y = initPos.y+2.0;
            this.gui.position.z = initPos.z-2;
            this.scene.add( this.gui );
        
        // this.gui.position.x = 1;
        // this.gui.position.y = 2.0;
        // this.gui.position.z = -1;
        // this.scene.add( this.gui );
        // const animFolder = dat.GUIVR.create( 'Animation' );
        // animFolder.add( animState, 'spinning' ).listen();
        // animFolder.add( animState, 'spinSpeed', ['slow','fast'] ).listen();
        // gui.addFolder( animFolder );
  
        //add show points, show bounding and change color for each cluster
        for( var cluster in config.color ) { 
            var clusterFolder = dat.GUIVR.create( 'Cluster ' + cluster );
            clusterFolder.add( config.displayCluster, cluster ).name( 'Display Points' ).onChange( function( evt ) {
            
                new DisplayDataCommand( viewPort.pointsDict[evt.name], evt.value );
            });
            
            clusterFolder.add( config.displayBoundingSphere, cluster ).name( 'Display Bounding' ).onChange(
                 function( evt ) {
                    
                new DisplayDataCommand( viewPort.boundingSphereDict[evt.name], evt.value );
            }
        );

            // clusterFolder.addColor( config.color, cluster ).name( 'Cluster Color' ).onFinishChange( function( color ) {
            //     new ChangeColorCommand( viewPort, this.property, color );
            // });

            this.gui.addFolder( clusterFolder );
           
        // this.gui.onChange(function(evt){
        //     console.log(evt);
        // })
     
        }
        var b = viewPort.cameraEl;
        var a = viewPort.cameraWrapperEl;
        var hiddenEl = cameraWrapperEl.querySelector("#hiddenEl").object3D;
        a.addEventListener('componentchanged', function (evt) { 
            if ( evt.detail.name !== 'position' ) return;
                var newPos = evt.detail.newData;
                var oldPos = evt.detail.oldData;
                gui.position.x = newPos.x+ gui.position.x-oldPos.x ;
                gui.position.y = newPos.y+ gui.position.y-oldPos.y;
                gui.position.z = newPos.z + (gui.position.z-oldPos.z);
            // var newPos = hiddenEl.getWorldPosition();
            // var sdf = b.object3D.getWorldPosition();
            // console.log(sdf);
            // console.log(newPos.z-sdf.z);
            // console.log("------");
            // gui.position.x = newPos.x;
            // gui.position.y = newPos.y;
            // gui.position.z = newPos.z;



        })
        //
    
        var compassWrapper = cameraWrapperEl.querySelector("#compassWrapper").object3D;
        var hiddenEl = cameraWrapperEl.querySelector("#hiddenEl").object3D;
        b.addEventListener('componentchanged', function (evt) {
            if ( evt.detail.name !== 'rotation' ) return;
            var degRotation =  evt.detail.newData;
           // console.log(degRotation);
            var cameraRotation = { x: THREE.Math.degToRad(degRotation.x), y: THREE.Math.degToRad(degRotation.y), z: THREE.Math.degToRad(degRotation.z) };
     
            
            var newPos = hiddenEl.getWorldPosition();

            
            // // console.log(cameraRotation);
            // // // console.log(cameraEl.object3D.getWorldPosition());
            //  console.log(newPos);

            gui.position.x = newPos.x;
            gui.position.y = newPos.y;
            gui.position.z = newPos.z;

            gui.rotation.x = cameraRotation.x;
            gui.rotation.y = cameraRotation.y;
            gui.rotation.z = cameraRotation.z;
        })

        // this.gui.add(config, 'showAllPoints').name(' Display All Points').onChange(function(){
        //     console.log("show all points");

        // });

        // this.gui.add(config, 'showAllBounding').name(' Display All Bounding Sphere').onChange(function(){
        //     console.log("show all points");

        // });

    }



}