
function setSpriteScale(spritePool, dumyPool, preScale, newScale ) {

    for ( var i = 0; i < spritePool.length ; i += 1 ) {
        
        if( spritePool[i].visible == false ) break;
        var pos = dumyPool[i].position;
        pos.x = pos.x / preScale * newScale;
        pos.y = pos.y / preScale * newScale;
        pos.z = pos.z / preScale * newScale;
 
        spritePool[i].position.copy(dumyPool[i].getWorldPosition());
       
        
    }
}

var prePos = new THREE.Vector3(0,0,0);
function setSpriteRotate(spritePool,dumyPool ) {
  
    
    for ( var i = 0; i < spritePool.length ; i += 1 ) {

        if( spritePool[i].visible == false ) break;
        spritePool[i].position.copy(dumyPool[i].getWorldPosition());
        
    }
}

var KeyboardControl = function(viewPort){

    this.ROTATESPEED = 10;
    this.SCALESPEED = 0.1;
    this.MOVESPEED = 3;
    this.viewPort = viewPort;
    //this.pointContainer = this.viewPort.pointContainer.object3D;
    this.outlier  = this.viewPort.outlierEl.object3D;
    this.axis = this.viewPort.axis.axisEl.object3D;
    this.boundingSphere = this.viewPort.boundingSphereContainer.object3D;
    this.splImage = this.viewPort.splImageContainer.object3D;
    this.container = this.viewPort.container;
    
    this.unitVector = new THREE.Vector3( 0, 1, 0 );
    this.MAXSCALE = 10;
    this.MINSCALE = 0.5;
    


};

KeyboardControl.prototype = {
    
    init: function () {
        
    
        var scope = this;

        var preScale = 1;
        var container = scope.container;
        var cameraWrapper = scope.viewPort.cameraWrapperEl.object3D;
        var camera = scope.viewPort.cameraEl.object3D;
        var points = scope.viewPort.pointsEl.object3D;        
        var boundingSphere = scope.boundingSphere;
        var axis = scope.axis;
        var outlier = scope.outlier.children[0];
        var spritePool = scope.viewPort.highDemDetail.spritePool;
        var dumyPool = scope.viewPort.highDemDetail.dumyPool;
        var splImage = scope.splImage;
        
        
        
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
                var rotate = container.getAttribute('rotation');
                rotate.y -= scope.ROTATESPEED;
                container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.object3D.updateMatrixWorld();
                setSpriteRotate(spritePool,dumyPool);
                map = {};

            }
            // ROTATE RIGHT
            else if(map[39]){
                
                var rotate = container.getAttribute('rotation');
                rotate.y += scope.ROTATESPEED;
                container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.object3D.updateMatrixWorld();
                setSpriteRotate(spritePool,dumyPool);
                map = {};

            }
            // ROTATE UP
            else if(map[38]){

                var rotate = container.getAttribute('rotation');
                rotate.x -= scope.ROTATESPEED;
                container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.object3D.updateMatrixWorld();
                setSpriteRotate(spritePool,dumyPool);
                map = {};

            }
            // ROTATE DOWN
            else if(map[40]){
                
                var rotate = container.getAttribute('rotation');
                rotate.x += scope.ROTATESPEED;
                container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                container.object3D.updateMatrixWorld();
                setSpriteRotate(spritePool,dumyPool);
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
								var len = Math.sqrt(direction.x*direction.x + direction.z*direction.z);
                cameraWrapper.position.x -= direction.x*scope.MOVESPEED/len;
                cameraWrapper.position.z -= direction.z*scope.MOVESPEED/len;
                map = {};

            }
            // MOVE RIGHT
            else if(map[68]){

                var direction = camera.getWorldDirection();
                var angle = Math.PI / 2;
                direction.applyAxisAngle( scope.unitVector, angle );
								var len = Math.sqrt(direction.x*direction.x + direction.z*direction.z);
                cameraWrapper.position.x += direction.x*scope.MOVESPEED/len;
                cameraWrapper.position.z += direction.z*scope.MOVESPEED/len;
                map = {};
            }

            // MOVE UP
            else if(map[88]){

                cameraWrapper.position.y += scope.MOVESPEED;
                map = {};

            }
            // MOVE DOWN
            else if(map[90]){

                cameraWrapper.position.y -= scope.MOVESPEED;
                map = {};

            }
            
            /*
            scale
            */

            // zoom in
            else if(map[81]){
                if (splImage.visible == true) return;
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
                setSpriteScale(spritePool, dumyPool, preScale, newScale );
                
                preScale = newScale;
                map = {};

            }
            // zoom out
            else if(map[69]){
                if (splImage.visible == true) return;
                var newScale = preScale - scope.SCALESPEED;
                if( newScale < scope.MINSCALE ) return;
                for (var i = 0; i<  points.children.length; i ++ ){
                    points.children[i].scale.set(newScale,newScale,newScale);
                }
                if( outlier != undefined ) outlier.scale.set(newScale,newScale,newScale);
                boundingSphere.scale.set(newScale,newScale,newScale);
                axis.scale.set(newScale,newScale,newScale);
                
               
                setSpriteScale(spritePool, dumyPool, preScale, newScale );
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

