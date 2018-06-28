AFRAME.registerComponent('logo', {

  
  
    init: function () {
        

      
        this.particleSystem = new THREE.GPUParticleSystem( {maxParticles: 500} );
        this.clock = new THREE.Clock();
        this.ticks = 0;

        
        var hbgeometry = new THREE.PlaneGeometry( 3, 3);
        var hbtexture = new THREE.TextureLoader().load('image/texture3.png');
        var hbmaterial = new THREE.MeshBasicMaterial( {map: hbtexture,color:0xffffff, side: THREE.FrontSide, alphaTest:0.5} );
        var sprite = this.sprite = new THREE.Mesh( hbgeometry, hbmaterial );
        this.sprite.position.set(0, 0, -6);
        
        
        
         this.options = {
				position: new THREE.Vector3(),
				positionRandomness: 0,
				velocity: new THREE.Vector3(),
				velocityRandomness: 0,
				color: 0xaa88ff,
				colorRandomness: 0,
				turbulence: 0.05,
				lifetime: 5,
				size: 5,
				sizeRandomness: 2
			};
			this.spawnerOptions = {
				spawnRate: 100,
				horizontalSpeed:0.75,
				verticalSpeed: 0.5,
				timeScale: 1
			};
			this.particleSystem.position.set(0,0,-30)
			this.el.setObject3D('mesh',this.particleSystem);
            this.el.setObject3D('mesh2', this.sprite);
    },
    
    
    tick: function() {
       
            var delta = this.clock.getDelta() * this.spawnerOptions.timeScale;
            this.ticks += delta;
            
            this.options.position.x = Math.sin( this.ticks * this.spawnerOptions.horizontalSpeed ) * 12;
            this.options.position.y = Math.sin( this.ticks * this.spawnerOptions.verticalSpeed ) * 5.5;
            this.options.position.z = Math.sin( this.ticks * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed ) * 5;
            for ( var x = 0; x < this.spawnerOptions.spawnRate * delta; x++ ) {
            // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
            // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
                this.particleSystem.spawnParticle( this.options );
                
                
            }
            this.particleSystem.update( this.ticks );
        
        this.sprite.rotation.z += 0.01;
        
        
        
    }
    
    
  
})
  
