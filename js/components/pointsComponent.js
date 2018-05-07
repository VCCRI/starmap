AFRAME.registerComponent('points', {
  
    schema: {
      positions: {
        type: 'array',
        default: [0, 0, 0]
      },
      color: {
        type: 'string',
        default:'#00ff00'
      },
      hasColor:{
        type:'boolean',
        default: true
      },
      size: {
        type: 'number',
        default: 1
      },
      textureSrc:{
        type:'string',
        default:"image/whiteBall.png"
      },
      sizeAttenuation:{
        type:'boolean',
        default: false
      }
    },
    
    init: function () {
      //set Material;
      var data = this.data;
      var texture = new THREE.TextureLoader().load(data.textureSrc);
      var pointNum = this.pointNum = data.positions.length/3;

      //create material
      var material = this.material = new THREE.PointsMaterial( { 
        size: data.size,
        map: texture,
        vertexColors: THREE.VertexColors,
        alphaTest: 0.5,
        transparent : false,
        sizeAttenuation: data.sizeAttenuation
      });
      //initalize color array for geometry
      var colorsArray = new Float32Array( pointNum * 3 );

      var color = new THREE.Color( data.color );
      
      var visibleArray = new Float32Array( pointNum);
      for(var i = 0 ; i < pointNum ; i++){
        colorsArray[i*3] = color.r;
        colorsArray[i*3+1] = color.g;
        colorsArray[i*3+2] = color.b;
        
        visibleArray[i] = 1;

      }

      //create geometry
      var geometry = this.geometry = new THREE.BufferGeometry();
      geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( data.positions, 3 ) );
      if( data.hasColor == true )
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colorsArray, 3 ) );
        
        
      geometry.addAttribute( 'visible', new THREE.BufferAttribute( visibleArray, 1 ) );
      geometry.computeBoundingSphere();
      this.boundingSphere = geometry.boundingSphere;
      this.points = new THREE.Points( geometry, material );
 
      this.el.setObject3D( 'mesh', this.points );
      
    },
    
    update: function ( oldData ) {
      var data = this.data;
      var diff = AFRAME.utils.diff(data, oldData);
    
    // Update geometry
        // if ('positions' in diff) {
        //     //var pos =  new Float32Array(this.data.positions.split(","));
        //     this.geometry.removeAttribute ("position");
        //     this.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute(pos, 3 ) );
        //     this.geometry.attributes.position.needsUpdate = true;
    

        // }
    
      if ('color' in diff) {
        var colorsArray = new Float32Array( this.pointNum  * 3 );

        var color = new THREE.Color( this.data.color );

        for(var i = 0 ; i < this.pointNum  ; i++){
          colorsArray[i*3] = color.r;
          colorsArray[i*3+1] = color.g;
          colorsArray[i*3+2] = color.b;
  
        }
        this.geometry.removeAttribute ("color");
        this.geometry.addAttribute( 'color', new THREE.BufferAttribute(colorsArray, 3 ) );
        this.geometry.attributes.color.needsUpdate = true;
      } 
    
    },  
    remove: function () {
        this.el.removeObject3D( 'mesh' );
    },

    getBoundingSphere: function () {
      return this.boundingSphere;
  },
      
    set: function () {
        this.setObject3D( 'mesh', this.points );
    }
  });