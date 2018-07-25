var HighDemDetail = function ( viewPort ) {
    
    
    this.spritePool = [];
    this.dumyPool = [];
    this.viewPort = viewPort;
    this.container = this.viewPort.container.object3D;
    this.preIndex = 0;
  //  this.featuresNum  = undefined;
    var spritePoolGroup = this.spritePoolGroup = new THREE.Group();
    this.scene = viewPort.sceneEl.object3D;
    spritePoolGroup.name = 'spritePool';
    this.NUMOFSP = viewPort.NUMOFSP;
    this.container.add(spritePoolGroup);
   // this.pointsEl = undefined;
    
   
}


HighDemDetail.prototype = {
    
    init : function () {
        var scope = this;
        scope.featuresNum = scope.viewPort.featuresNum;
        scope.pointsEl = scope.viewPort.pointsEl;  
        var quanternion = scope.viewPort.cameraEl.object3D.quaternion;

       // console.log(scope.featuresNum);
        var texture = new THREE.TextureLoader().load('image/features/' + scope.featuresNum + '.png');
        var pgeometry = new THREE.PlaneGeometry( 1, 1);
      
        for ( var i = 0 ; i < scope.NUMOFSP ; i += 1 ) {
            var pmaterial = new THREE.MeshBasicMaterial( {map: texture, side: THREE.FrontSide, alphaTest:0.5} );
            var plane = new THREE.Mesh( pgeometry, pmaterial );
            plane.scale.set( 1.75, 1.75, 1.75);
            var material = new THREE.MeshBasicMaterial({color:0xffffff,linewidth: 3,opacity:0.7,transparent:true});
            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array(scope.featuresNum*3*3);
            geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            
            var line = new THREE.Mesh( geometry, material );
            line.position.set(0, 0, 0.01);
            line.visible = false;
            plane.add(line);
            plane.visible = false;
            plane.class = '';
            var fakeSprite = new THREE.Object3D();
            fakeSprite.visible = false;
            scope.spritePoolGroup.add(fakeSprite);
       
            scope.spritePool.push(plane);
            scope.dumyPool.push(fakeSprite);
            
            scope.scene.add(plane);
        
        }
        
        // camera = viewPort.cameraEl.object3D;
        scope.viewPort.cameraEl.addEventListener('componentchanged',function(evt){
        
        if ( evt.detail.name != 'rotation') return;
        for (var j = 0; j < scope.NUMOFSP ; j += 1) {
            
            if(scope.spritePool[j].visible == false) continue;
                scope.spritePool[j].quaternion.copy( quanternion );
                // sprite.quaternion.copy( scope.cameraEl.object3D.quaternion );
            }
        })

  //  })
    
    },
    
    showHighDemDetail : function ( points ) {
        //hide the 
        // if(this.pointsEl == undefined ){
        //     this.featuresNum = this.viewPort.featuresNum;
        //     this.pointsEl = this.viewPort.pointContainer.querySelector('#points');  
        // } 
        
        var currIndex = 0;
        
        var keys = Object.keys(this.pointsEl.components);
        var quaternion = this.viewPort.cameraEl.object3D.quaternion;
        for( var i = 0 ; i < keys.length ; i += 1 ) {
          
            var cluster = keys[i];
            if( this.pointsEl.components[cluster].id == undefined ) continue;
            var id = cluster.replace( 'mpoints__','');
            var hiddenPoints = points[id];
            currIndex = this.pointsEl.components[cluster].hidePoints(hiddenPoints, this.spritePool,this.dumyPool, currIndex, quaternion);
            
        }
        
        currIndex -= 1;
        
        if( currIndex < this.preIndex ) {
            for( var i = currIndex+1  ; i <= this.preIndex ; i += 1 ) {
                if ( this.spritePool[i].visible == false ) break;
                this.spritePool[i].visible = false;
                this.spritePool[i].children[0].visible = false;
                this.spritePool[i].class = '';
                
            }
            
        }
        
       this.preIndex = currIndex;
    },
    
    setVisible:function( cluster, bool ){
        
        for ( var i = 0 ; i <  this.spritePool.length ; i += 1 ) {
            if(this.spritePool[i].class == '') break;
            if (this.spritePool[i].class == cluster) this.spritePool[i].visible = bool;
        }
        
    }
}