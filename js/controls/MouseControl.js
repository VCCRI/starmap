var MouseControl = function ( viewPort ) {

    this.camera = viewPort.cameraEl.object3D;
    this.cameraWrapper =  viewPort.cameraWrapperEl.object3D;
    var sceneEl = this.sceneEl = viewPort.sceneEl;
   
    var canvas = this.canvas = undefined;
    var raycaster= this.raycaster = undefined;
    var objects = undefined;
    viewPort.sceneEl.addEventListener('render-target-loaded', function () {
        canvas = viewPort.sceneEl.canvas;
        raycaster = viewPort.cursorEl.components.raycaster.raycaster;
        //canvas.addEventListener( 'mousedown', onMouseDown, false );
    });
    this.container = viewPort.container.object3D;
    var onDownPosition = this.onDownPosition = new THREE.Vector2();
	var onUpPosition = this.onUpPosition = new THREE.Vector2();
    var mouse = new THREE.Vector2();



    function handleClick() {
        var objects = viewPort.cursorEl.components.raycaster.objects[0].children;
  
		if ( onDownPosition.distanceTo( onUpPosition ) <= 0.005 ) {

            var intersects = getIntersects( onUpPosition, objects );
            if(intersects.length != 0) viewPort.findSurrendingPoints(intersects[0].index, intersects[0].object.name);
            //intersection.index,intersection.object.name
            //console.log(intersects[0].index, intersects[0].object.name);
		}

	}


    function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
		raycaster.setFromCamera( mouse, viewPort.cameraEl.components.camera.camera);
        //TODO
		return raycaster.intersectObjects( objects );

	}

    function getMousePosition( dom, x, y ) {

        var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

    }
    
	function onMouseDown( event ) {

		event.preventDefault();
        var array = getMousePosition( sceneEl, event.clientX, event.clientY );
		onDownPosition.fromArray( array);

		canvas.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

        var array = getMousePosition( sceneEl, event.clientX, event.clientY );
		onUpPosition.fromArray( array);
		handleClick();

		canvas.removeEventListener( 'mouseup', onMouseUp, false );

	}

 
    this.enableMouseControl = function enableMouseControl( bool ){
        
        if( bool == true) {
            canvas.addEventListener( 'mousedown', onMouseDown, false );
            //console.log('start');
            
        }
        else {
            canvas.removeEventListener( 'mousedown', onMouseDown, false );
            console.log('end');
        }
    }

}
    