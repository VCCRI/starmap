AFRAME.registerComponent('axis', {
  schema: {
    colors: {
    //type: 'string',
      default:'255,0,0'
    },
    sizes: {
    //  type: 'string',
      default: '0'
    },
    positions: {
    // type: 'string',
      default: ''
    },
    textureSrc:{
    //type:'string',
      default:"ball.png"
    },
    sizeAttenuation:{
      default: true
    }
  },
  
  init: function () {
    var sceneEl = this.el.sceneEl;
   this.geometry=new THREE.BufferGeometry();
  },
  

  

  
  update: function () {

       if (this.data.positions =='') {
 //     console.log("retu");
      return
    }
      
        this.geometry = new THREE.BufferGeometry();

        var pos =  new Float32Array(this.data.positions.split(","));
        var color =  new Float32Array(this.data.colors.split(","));
        var size =  new Float32Array(this.data.sizes.split(","));
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute(pos, 3 ) );
        //this.geometry.addAttribute( 'color', new THREE.BufferAttribute(color, 3 ) );

        this.geometry.computeBoundingSphere();
        
       // this.boundingSphere = this.geometry.boundingSphere;
       //S console.log(this.boundingSphere);new THREE.TextureLoader().load( "textures/sprites/disc.png" );
        this.geometry.addAttribute( 'size', new THREE.BufferAttribute(size, 1 ) );
        var texture=new THREE.TextureLoader().load(this.data.textureSrc);
        //sizeAttenuation: false
        var material = new THREE.PointsMaterial( { size: size[0],vertexColors: THREE.VertexColors,map:texture,alphaTest:0.5,sizeAttenuation: this.data.sizeAttenuation} );
        
        var points = new THREE.Points(this.geometry, material);
        // Set mesh on entity.
        this.el.setObject3D('axis', points);





  }
  

});