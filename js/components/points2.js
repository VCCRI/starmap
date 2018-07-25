AFRAME.registerComponent('mpoints', {
  multiple: true,

  schema: {
    positions: {
      type: 'array',
      default: [0, 0, 0]
    },
    color: {
      type: 'string',
      default:'#00ff00'
    },
    featuresNum:{
      type:'number',
      default: 3
    },
    size: {
      type: 'number',
      default: 3
    },
    textureSrc:{
      type:'string',
      default:"image/ball.png"
    },
    sizeAttenuation:{
      type:'boolean',
      default: true
    }
  },
  
  init : function ( ) {
      //console.log("init success");
  },
  update: function ( ) {
    //console.log('update');
    var data = this.data;
    
    var pointNum = this.pointNum = data.positions.length/3;
    var geometry = this.geometry = new THREE.BufferGeometry();
    var visibleArray = new Float32Array( pointNum );
    
    
    this.rotationAxis = new THREE.Vector3( 0, 0, 1 );
    this.rotationAngle = Math.PI*2/this.data.featuresNum;
    
    var colorsArray = new Float32Array( pointNum * 3 );
    var color = this.color = new THREE.Color( data.color );
    for(var i = 0 ; i < pointNum ; i++){
        colorsArray[i*3] = color.r;
        colorsArray[i*3+1] = color.g;
        colorsArray[i*3+2] = color.b;
        if(this.id != -1) visibleArray[i] = 1;
    }
    
    //create material
  if(this.id  == -1) {
    var material = this.material = new THREE.PointsMaterial( { 
      
        size: data.size,
        vertexColors: THREE.VertexColors,
        alphaTest: 0.5,
        transparent : false,
        depthTest: true,
        sizeAttenuation: data.sizeAttenuation
    });
   geometry.addAttribute( 'color', new THREE.BufferAttribute( colorsArray, 3 ) );
  }
  else {
    
    var material = this.material = new THREE.PointsMaterial( { 
        size: data.size,
        map:new THREE.TextureLoader().load(data.textureSrc),
        vertexColors: THREE.VertexColors,
        alphaTest: 0.5,
        transparent : false,
        depthTest: true,
        sizeAttenuation: true
    });
   geometry.addAttribute( 'color', new THREE.BufferAttribute( colorsArray, 3 ) );

      
  geometry.addAttribute( 'visible', new THREE.BufferAttribute( visibleArray, 1 ) );

    
  }

  geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( data.positions, 3 ) );
  geometry.computeBoundingSphere();
  this.boundingSphere = geometry.boundingSphere;
  this.preHiddenPoints = [];
  this.points = new THREE.Points( geometry, material );
  this.points.name = this.id;
  this.el.setObject3D( this.attrName, this.points );

        
  },  
  
  remove: function () {
      this.el.removeObject3D( 'mesh' );
  },

  getBoundingSphere: function () {
    return this.boundingSphere;
  },
  changeColor: function ( newColor ) {
    
    if ( this.id == -1 ) {
      console.log('outlier change color')
      var colorsArray = this.geometry.attributes.color;
    }
    else {
      
      console.log('clusterd data change color')
      var colorsAttribute = this.geometry.attributes.customColor;
      var colorsArray = colorsAttribute.array;
    }
    
    var color = new THREE.Color( newColor );
    for(var i = 0 ; i < this.pointNum ; i++){
      colorsArray[i*3] = color.r;
      colorsArray[i*3+1] = color.g;
      colorsArray[i*3+2] = color.b;
    }

    colorsAttribute.needsUpdate = true;

  },
  
  hidePoints: function( hiddenPoints, spritePool, dumyPool, poolIndex, quaternion ) {
    
    var visibleAttribute = this.geometry.attributes.visible;
    var visibleArray = visibleAttribute.array;
    var scale = this.points.scale.x;
    
 
    for ( var i = 0 ; i < this.preHiddenPoints.length ; i += 1 ) {
      var indexes = this.preHiddenPoints[i].i; 
      visibleArray[indexes] = 1;
    } 
    
    
    if ( hiddenPoints != undefined ) {
      
      for ( var i = 0 ; i < hiddenPoints.length ; i += 1 ) {
        
        var currPoint = hiddenPoints[i];
        var indexes = currPoint.i; 
        
      
        var fakeSprite = dumyPool[poolIndex];

        fakeSprite.position.set(currPoint.x*scale,currPoint.y*scale,currPoint.z*scale);
        var worldPos = fakeSprite.getWorldPosition();
        
        var currSprite = spritePool[poolIndex];
        currSprite.position.copy(worldPos);
        
        this.drawFeatures( currSprite, currPoint );
  
        currSprite.material.color = this.color;
        currSprite.material.needsUpdate = true;
        currSprite.visible = true;
        currSprite.class = this.attrName;
        currSprite.quaternion.copy( quaternion );
        poolIndex += 1;
        visibleArray[indexes] = 0;
      }
      this.preHiddenPoints = hiddenPoints;
    }
    else this.preHiddenPoints = [];
    visibleAttribute.needsUpdate = true;
    return poolIndex; 
    
  },
  
  drawFeatures: function ( currSprite, currPoint ) {
    
     
    var lineVertices = [];
    
    var feature = currPoint.f;
    var positionAttribute  = currSprite.children[0].geometry.attributes.position;
    var positionArray = positionAttribute.array;
    
    var preCoor = this.calculatePointCoor2(feature[0],0);
    var starCoor = {x:preCoor.x,y:preCoor.y,z:preCoor.z};
    var currCoor;
    positionArrayIndex = 0;
    
    for ( var i = 1 ; i < this.data.featuresNum ; i += 1 ) {
    
      // this.calculatePointCoor( feature[i], i, positionArray );
      currCoor = this.calculatePointCoor2( feature[i], i, positionArray );
      
      positionArray[positionArrayIndex] = preCoor.x;
      positionArrayIndex += 1;
      positionArray[positionArrayIndex] = preCoor.y;
      positionArrayIndex += 1;
      positionArray[positionArrayIndex] = preCoor.z;
      positionArrayIndex += 1;

      positionArray[positionArrayIndex] = currCoor.x;
      positionArrayIndex += 1;
      positionArray[positionArrayIndex] = currCoor.y;
      positionArrayIndex += 1;
      positionArray[positionArrayIndex] = currCoor.z;
      positionArrayIndex += 1;

      positionArray[positionArrayIndex] = 0;
      positionArrayIndex += 1;
      positionArray[positionArrayIndex] = 0;
      positionArrayIndex += 1;
      positionArray[positionArrayIndex] = 0;
      positionArrayIndex += 1;

      preCoor = currCoor;
    
    }
    

    positionArray[positionArrayIndex] = preCoor.x;
    positionArrayIndex += 1;
    positionArray[positionArrayIndex] = preCoor.y;
    positionArrayIndex += 1;
    positionArray[positionArrayIndex] = preCoor.z;
    positionArrayIndex += 1;

    positionArray[positionArrayIndex] = starCoor.x;
    positionArrayIndex += 1;
    positionArray[positionArrayIndex] = starCoor.y;
    positionArrayIndex += 1;
    positionArray[positionArrayIndex] = starCoor.z;
    positionArrayIndex += 1;

    positionArray[positionArrayIndex] = 0;
    positionArrayIndex += 1;
    positionArray[positionArrayIndex] = 0;
    positionArrayIndex += 1;
    positionArray[positionArrayIndex] = 0;
    positionArrayIndex += 1;
    

    // console.log(positionArrayIndex);
    // console.log(positionArray);

    positionAttribute.needsUpdate = true;
    
    currSprite.children[0].visible = true;
  },
  
  calculatePointCoor: function( feature, index, vertices ) {
    var angle = this.rotationAngle*index;
    
    var sinTheta = Math.round(Math.sin(angle)*1000)/1000;
    var cosTheta = Math.round(Math.cos(angle)*1000)/1000;
    vertices[3*index] = -sinTheta*feature;
    
    vertices[3*index+1] = cosTheta*feature;
    vertices[3*index+2] = 0;

    //return new THREE.Vector3(-sinTheta*feature, cosTheta*feature, 0);
    
    
  },

    calculatePointCoor2: function( feature, index ) {
    var angle = this.rotationAngle*index;
    
    var sinTheta = Math.round(Math.sin(angle)*1000)/1000;
    var cosTheta = Math.round(Math.cos(angle)*1000)/1000;

    return {x:-sinTheta*feature,y:cosTheta*feature,z:0};
    // vertices[3*index] = -sinTheta*feature;
    
    // vertices[3*index+1] = cosTheta*feature;
    // vertices[3*index+2] = 0;

    //return new THREE.Vector3(-sinTheta*feature, cosTheta*feature, 0);
    
    
  }
});