function setSpriteScale(spritePool, preScale, newScale ) {
    
    for ( var i = 0; i < spritePool.length ; i += 1 ) {
        
        if( spritePool[i].visible == false ) break;
        var pos = spritePool[i].position;
        pos.x = pos.x / preScale * newScale;
        pos.y = pos.y / preScale * newScale;
        pos.z = pos.z / preScale * newScale;
        
    }
}

var KeyboardControl = function(viewPort){

    this.ROTATESPEED = Math.PI*10/180;
    this.SCALESPEED = 0.1;
    this.MOVESPEED = 3;
    this.viewPort = viewPort;
    //this.pointContainer = this.viewPort.pointContainer.object3D;
    this.outlier  = this.viewPort.outlierEl.object3D;
    this.axis = this.viewPort.axis.axisEl.object3D;
    this.boundingSphere = this.viewPort.boundingSphereContainer.object3D;
    this.container = this.viewPort.container;
    
    this.unitVector = new THREE.Vector3( 0, 1, 0 );
    this.MAXSCALE = 10;
    this.MINSCALE = 0.5;
    


};

KeyboardControl.prototype = {
    
    init: function () {
        
    
        var scope = this;
        // var MOVESPEED = scope.MOVESPEED;
        // var preKey = 0;
        // var preTime;
        var preScale = 1;
        var container = scope.container.object3D;
        var cameraWrapper = scope.viewPort.cameraWrapperEl.object3D;
        var camera = scope.viewPort.cameraEl.object3D;
        
        var points = scope.viewPort.pointsEl.object3D;
       // var points = scope.pointContainer.children[0];
        
        var boundingSphere = scope.boundingSphere;
        var axis = scope.axis;
        var outlier = scope.outlier.children[0];
        var spritePool = scope.viewPort.highDemDetail.spritePoolGroup;
      
        
        
        
        var onkeydown = function onkeydown ( e ) {

            // if(points == undefined) {

            //     points = document.querySelector('#pointContainer').object3D.children[0];
            //     outlier = document.querySelector('#outlier').object3D.children[0];
            //     console.log(outlier);
            //     spritePool = document.querySelector('#container').object3D.getObjectByName ( 'spritePool' );
            //     boundingSphere = document.querySelector('#boundingSphereContainer').object3D;
            //     axis = document.querySelector('#axis').object3D;
                
            
            // }
           e.preventDefault( );
            
            
   
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            
            /*
            ROTATE
            */

            // ROTATE LEFT
            if(map[37]){

                container.rotation.y -= scope.ROTATESPEED;
                map = {};

            }
            // ROTATE RIGHT
            else if(map[39]){
                
                container.rotation.y += scope.ROTATESPEED;
                map = {};

            }
            // ROTATE UP
            else if(map[38]){

                container.rotation.x -= scope.ROTATESPEED;
                map = {};

            }
            // ROTATE DOWN
            else if(map[40]){
                container.rotation.x += scope.ROTATESPEED;
                map = {};


            }
        
            /*
            MOVE
            */

            // MOVE FORARD
            else if(map[87]){

                var direction = camera.getWorldDirection();
                cameraWrapper.position.x -= direction.x*scope.MOVESPEED;
                cameraWrapper.position.y -= direction.y*scope.MOVESPEED;
                cameraWrapper.position.z -= direction.z*scope.MOVESPEED;
                map = {};

            }
            // MOVE BACKWARD
            else if(map[83]){

                var direction = camera.getWorldDirection();
                cameraWrapper.position.x += direction.x*scope.MOVESPEED;
                cameraWrapper.position.y += direction.y*scope.MOVESPEED;
                cameraWrapper.position.z += direction.z*scope.MOVESPEED;
                map = {};

            }
            // MOVE LEFT
            else if(map[65]){

                var direction = camera.getWorldDirection();
                var angle = Math.PI / 2;
                direction.applyAxisAngle( scope.unitVector, angle );
                cameraWrapper.position.x -= direction.x*scope.MOVESPEED;
                cameraWrapper.position.y -= direction.y*scope.MOVESPEED;
                cameraWrapper.position.z -= direction.z*scope.MOVESPEED;
                map = {};

            }
            // MOVE RIGHT
            else if(map[68]){

                var direction = camera.getWorldDirection();
                var angle = Math.PI / 2;
                direction.applyAxisAngle( scope.unitVector, angle );
                cameraWrapper.position.x += direction.x*scope.MOVESPEED;
                cameraWrapper.position.y += direction.y*scope.MOVESPEED;
                cameraWrapper.position.z += direction.z*scope.MOVESPEED;
                map = {};


            }
            
            /*
            scale
            */

            // zoom in
            else if(map[81]){

                var newScale = preScale + scope.SCALESPEED;
                
                if( newScale > scope.MAXSCALE ) return;
                // scale point
                for ( var i = 0; i< points.children.length;i ++ ){
                    points.children[i].scale.set(newScale,newScale,newScale);
                }
                // scale outlier
                if( outlier != undefined ) outlier.scale.set(newScale,newScale,newScale);
                boundingSphere.scale.set(newScale,newScale,newScale);
                axis.scale.set(newScale,newScale,newScale);
                setSpriteScale(spritePool.children , preScale, newScale);
                
                preScale = newScale;
                map = {};

            }
            // zoom out
            else if(map[69]){

                var newScale = preScale - scope.SCALESPEED;
                if( newScale < scope.MINSCALE ) return;
                for (var i = 0; i<  points.children.length; i ++ ){
                    points.children[i].scale.set(newScale,newScale,newScale);
                }
                if( outlier != undefined ) outlier.scale.set(newScale,newScale,newScale);
                boundingSphere.scale.set(newScale,newScale,newScale);
                axis.scale.set(newScale,newScale,newScale);
                setSpriteScale(spritePool.children, preScale, newScale);
                //spritePool.scale.set(newScale,newScale,newScale);
                preScale = newScale;
                map = {};

            }
            
            
        
        }
        
        this.onkeydownHandler = onkeydown.bind(this);
        
       // this.onkeydown = this.clicked.bind(this);
        
    },
    
    enableKeyboardControl : function (bool) {
             
        if( bool ) {  document.addEventListener( 'keydown', this.onkeydownHandler, false);
                console.log('keyboardEnabled');
        }

    
        else{  document.removeEventListener( 'keydown', this.onkeydownHandler, false);
        
            console.log('keyboardDisabled');
        }
    }
    
    
}

