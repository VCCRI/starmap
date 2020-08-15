
var VrControl = function( viewPort ) {
        //this.guiEl = vrEditor.guiEl;
        this.preTime = 0;
        this.MOVESPEED = 1;
        this.ROTATESPEED = 1.5;
        this.SCALESPEED = 0.02;
        this.tween = undefined;
        this.unitVector = new THREE.Vector3( 0, 1, 0 );
        this.preKey = 0;
        this.viewPort = viewPort;
        this.MAXSCALE = 8;
        this.MINSCALE = 0.5;
        this.timeThreshold = 20;

}
  VrControl.prototype = {
    
    init : function() {
        
        var scope = this;
        var preScale = 1;
        

        var outlier  = scope.viewPort.outlierEl.object3D;
        var axis = scope.viewPort.axis.axisEl.object3D;
        var boundingSphere = scope.viewPort.boundingSphereContainer.object3D;
        var container = scope.viewPort.container;
        var cameraWrapperEl = scope.viewPort.cameraWrapperEl;
        var cameraWrapper = cameraWrapperEl.object3D;
        var camera = scope.viewPort.cameraEl.object3D;
        var points = scope.viewPort.pointsEl.object3D;

        var spritePool = scope.viewPort.highDemDetail.spritePool;
        var dumyPool = scope.viewPort.highDemDetail.dumyPool;
        var splImage = scope.viewPort.splImageContainer.object3D;
  
        
        var onkeydown = function( e ) {
            e.preventDefault( );

            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            
            if( map[78] || map[82] || map[84] || map[70] ) {
                
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.preKey = 0; 
                map = {};
            }
            
            else if (map[67] || map[69] || map[81] || map[90] || map[80] ){
                
                if(((map[67]||map[81]||map[90])&& scope.preKey == 87) ||
                ((map[67]||map[69]||map[90])&& scope.preKey == 65) || 
                ((map[69]||map[81]||map[90])&& scope.preKey == 68) || 
                ((map[67]||map[69]||map[81])&& scope.preKey == 88)) {
                     map = {};
                     return;
                }
                
                if(scope.preKey != 0 && scope.tween ) { scope.tween.stop();}
                 scope.preKey = 0; 
                 map = {};
                     
            }
            
            else if(map[87] && scope.preKey != 87){// w front
                
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    
                    var now = new Date().getTime();
                    
                    if(now-scope.preTime < scope.timeThreshold) {map = {}; return;}
                    scope.preTime = now;

                    var direction = camera.getWorldDirection();
                    
                    var newX =  cameraWrapper.position.x - direction.x*scope.MOVESPEED; 
                    var newY = cameraWrapper.position.y - direction.y*scope.MOVESPEED;
                    var newZ = cameraWrapper.position.z - direction.z*scope.MOVESPEED;
                    cameraWrapperEl.setAttribute( 'position', newX + ' ' + newY + ' ' + newZ );
                    // cameraWrapper.position.x -= direction.x*scope.MOVESPEED;
                    // cameraWrapper.position.y -= direction.y*scope.MOVESPEED;
                    // cameraWrapper.position.z -= direction.z*scope.MOVESPEED;
                    
                })
                .onStart(function(){
                    scope.preTime = new Date().getTime();
                })
                .start(); 
                
                scope.preKey = 87;
                map = {};
                
            }
            else if(map[88] && scope.preKey != 88 ){//x back
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    
                    var now = new Date().getTime();
                    
                    if(now-scope.preTime <scope.timeThreshold) {map = {}; return;}
                    scope.preTime = now;
                    
                    var direction = camera.getWorldDirection();
                    
                    var newX =  cameraWrapper.position.x + direction.x*scope.MOVESPEED; 
                    var newY = cameraWrapper.position.y + direction.y*scope.MOVESPEED;
                    var newZ = cameraWrapper.position.z + direction.z*scope.MOVESPEED;
                    cameraWrapperEl.setAttribute( 'position', newX + ' ' + newY + ' ' + newZ );
                    
                })
                .onStart(function(){
                    scope.preTime = new Date().getTime();
                })
                .start(); 
                
                scope.preKey = 88;
                map = {};
                
            }
            else if(map[65] && scope.preKey != 65){ //a left
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    
                    var now = new Date().getTime();
                    
                    if(now-scope.preTime <scope.timeThreshold) {map = {}; return;}
                    scope.preTime = now;
                    
                    var direction = camera.getWorldDirection();
                    var angle = Math.PI / 2;
                    direction.applyAxisAngle( scope.unitVector, angle );

                    var newX =  cameraWrapper.position.x - direction.x*scope.MOVESPEED; 
                    var newY = cameraWrapper.position.y - direction.y*scope.MOVESPEED;
                    var newZ = cameraWrapper.position.z - direction.z*scope.MOVESPEED;
                    cameraWrapperEl.setAttribute( 'position', newX + ' ' + newY + ' ' + newZ );
                    
                })
                .onStart(function(){
                    scope.preTime = new Date().getTime();
                })
                .start(); 
                
                scope.preKey = 65;
                map = {};
            }
            else if(map[68] && scope.preKey != 68 ){ //d right
            
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    
                    var now = new Date().getTime();
                    
                    if(now-scope.preTime <scope.timeThreshold){map = {}; return;}
                    scope.preTime = now;
                    
                    var direction = camera.getWorldDirection();
                    var angle = Math.PI / 2;
                    direction.applyAxisAngle( scope.unitVector, angle );

                    var newX =  cameraWrapper.position.x + direction.x*scope.MOVESPEED; 
                    var newY = cameraWrapper.position.y + direction.y*scope.MOVESPEED;
                    var newZ = cameraWrapper.position.z + direction.z*scope.MOVESPEED;
                    cameraWrapperEl.setAttribute( 'position', newX + ' ' + newY + ' ' + newZ );
                    
                })
                .onStart(function(){
                    scope.preTime = new Date().getTime();
                })
                .start(); 
                
                scope.preKey = 68;
                map = {};
               
            }else if(map[89] && scope.preKey != 89 ){ // y rotate
            
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    
                    var now = new Date().getTime();
                    if(now-scope.preTime < scope.timeThreshold) {map = {}; return;}
                    scope.preTime = now;
                    var rotate = container.getAttribute('rotation');
                    rotate.y -= scope.ROTATESPEED;
                    container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                    container.object3D.updateMatrixWorld();
                    setSpriteRotate(spritePool,dumyPool);
                    
                })
                .onStart(function(){
                    scope.preTime = new Date().getTime();
                })
                .start(); 
                
                scope.preKey = 89;
                map = {};
               
            }else if(map[74] && scope.preKey != 74 ){ // j rotate 
            
                if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                scope.tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    
                    var now = new Date().getTime();
                    if(now-scope.preTime < scope.timeThreshold) {map = {}; return;}
                    scope.preTime = now;
                    var rotate = container.getAttribute('rotation');
                    rotate.y += scope.ROTATESPEED;
                    container.setAttribute('rotation', rotate.x+' '+rotate.y+ ' '+rotate.z);
                    container.object3D.updateMatrixWorld();
                    setSpriteRotate(spritePool,dumyPool);
                 
                    
                })
                .onStart(function(){
                    scope.preTime = new Date().getTime();
                })
                .start(); 
                
                scope.preKey = 74;
                map = {};
               
            }
            
            else if(map[85] && scope.preKey != 85 ){ // a zoom in 
                if (splImage.visible == true) return;
                if ( preScale + scope.SCALESPEED < scope.MAXSCALE) {
                    if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                    scope.tween = new TWEEN.Tween()
                    .repeat(Infinity)
                    .onUpdate(function(){
                        
                        var now = new Date().getTime();
                        if(now-scope.preTime < scope.timeThreshold) {map = {}; return;}
                        scope.preTime = now;
                        var newScale = preScale + scope.SCALESPEED;
                        if(newScale > scope.MAXSCALE) {
                            scope.tween.stop();
                            scope.preKey = 70;
                        }
                        // scale point 
                        for ( var i = 0; i< points.children.length;i += 1 ){
                            points.children[i].scale.set(newScale,newScale,newScale);
                        }
                        // scale outlier
                        if( outlier != undefined ) outlier.scale.set(newScale,newScale,newScale);
                        boundingSphere.scale.set(newScale,newScale,newScale);
                        axis.scale.set(newScale,newScale,newScale);
                        
                        setSpriteScale(spritePool, dumyPool, preScale, newScale );
                        preScale = newScale;
    
                        
                    })
                    .onStart(function(){
                        scope.preTime = new Date().getTime();
                    })
                    .start(); 
                    
                    scope.preKey = 85;
                }
                map = {};
            }
             else if(map[72] && scope.preKey != 72 ){ // h zoom out
                if (splImage.visible == true) return;
                if ( preScale + scope.SCALESPEED > scope.MINSCALE) {
                    if(scope.preKey != 0 && scope.tween ) scope.tween.stop();
                    scope.tween = new TWEEN.Tween()
                    .repeat(Infinity)
                    .onUpdate(function(){
                        
                        var now = new Date().getTime();
                        if(now-scope.preTime < scope.timeThreshold) {map = {}; return;}
                        scope.preTime = now;
                        var newScale = preScale - scope.SCALESPEED;
                        if(newScale < scope.MINSCALE) {
                            scope.tween.stop();
                            scope.preKey = 82;
                        }
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
    
                        
                    })
                    .onStart(function(){
                        scope.preTime = new Date().getTime();
                    })
                    .start(); 
                    
                    scope.preKey = 72;
                }
                map = {};
            }
            //85 70// 72 82
        }
        this.onkeydownHandler = onkeydown.bind(this);
    },
    
    enableVrControl : function (bool) {
         
    if( bool ) {  
        document.addEventListener( 'keydown', this.onkeydownHandler, false);
        console.log('vrControl enabled');
    }


    else{  
        document.removeEventListener( 'keydown', this.onkeydownHandler, false);
        if(this.preKey != 0 && this.tween ) { this.tween.stop();}
        this.preKey = 0;
        console.log('vrControl disabled');
    }
}

}