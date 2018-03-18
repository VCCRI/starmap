AFRAME.registerComponent('movement', {
    schema: {
        moveSpeed: {
          default: 0.03
        }
      },
    init: function () {
        console.log("init movement");
       // var cameraWrapperEl = document.querySelector('#cameraWrapper');
        var tween;
        var count = this.count = 0;
        //var el = this.el;
        var moveSpeed = this.data.moveSpeed;
        //var moveFlag = "idle"; 
        var preKey = 0;
        var preTime;
        //var camera =this.el.object3D;
        // console.log(camera);
        // console.log(camera);
        var cameraWrapperEl = document.querySelector('#cameraWrapper');
        var camera = cameraWrapperEl.querySelector('#camera').object3D;

        window.addEventListener( 'keydown', function( e ) {
            e.preventDefault( );
            console.log(camera);
            // var cameraWrapperEl = document.querySelector('#cameraWrapper');
            // var camera = cameraWrapperEl.querySelector('#camera').object3D;
            var position = cameraWrapperEl.getAttribute("position");
            this.repeating = true;
            var pos = null;
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            if (map[67] || map[69]||map[81]||map[90]){
                if((map[67]||map[81]||map[90])&& preKey == 87) return;
                if((map[67]||map[69]||map[90])&& preKey == 65) return;
                if((map[69]||map[81]||map[90])&& preKey == 68) return;
                if((map[67]||map[69]||map[81])&& preKey == 88) return;
                if(tween) tween.stop();
                preKey = 0;         
                     
            }else if(map[85]){ //Attack u
    

            }else if(map[72]){ //Skill1 h


           
    
            }else if(map[74]){ //Skill2 j

             

            }else if(map[70] || map[78]||map[84]||map[82]){//reset skill animation n  t
                //if(tween) tween.stop();
                // gameRoom.send({action: "SKILLANIMATION", data:JSON.stringify({name:"none"})})
                // Animation.setAnimation(el.children[0].querySelector("#"+client.id),"none");
            }
            else if(map[87] && preKey != 87){// w front
                if(preKey == 88 || preKey == 65 || preKey == 68){
                    if(tween) tween.stop();

                }
                var direction = camera.getWorldDirection();
                preKey = 87;
                map = {};    
                tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    var now = new Date().getTime();
           
                    if(now-preTime <10) return;
                    preTime = now;
                    pos = cameraWrapperEl.getAttribute("position");
       
                    direction = camera.getWorldDirection();
                    newX = pos.x-direction.x*moveSpeed;
                    newY = pos.y-direction.y*moveSpeed;
                    newZ = pos.z-direction.z*moveSpeed;
                    var newPos =  newX +" "+newY+" "+newZ;
                    
                    cameraWrapperEl.setAttribute('position', newPos);
                
                 })
                .onStart(function(){
                    preTime = new Date().getTime();
                })
                .start();   
            }
            else if(map[88] && preKey != 88 ){//x back
                if(preKey == 87  || preKey == 65 || preKey == 68){
                    if(tween) tween.stop();
                }
                var direction = camera.getWorldDirection();
                preKey = 88;
                map = {};
                tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    var now = new Date().getTime();
                    if(now-preTime <10) return;
                    preTime = now;
                    pos = cameraWrapperEl.getAttribute("position");
                    direction = camera.getWorldDirection();
                    newX = pos.x+direction.x*moveSpeed;
                    newY = pos.y+direction.y*moveSpeed;
                    newZ = pos.z+direction.z*moveSpeed;
                    var newPos =  newX +" "+newY+" "+newZ;
                    cameraWrapperEl.setAttribute('position', newPos);
                })
                .onStart(function(){
                    preTime = new Date().getTime();
                })
                .start();
                
            }
            else if(map[65] && preKey != 65){ //a left
                if(preKey == 87 || preKey == 88  || preKey == 68){
                    if(tween) tween.stop();
                }
                var direction = camera.getWorldDirection();
                preKey = 65;
                map = {};
                tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    var now = new Date().getTime();
                    if(now-preTime <10) return;
                    preTime = now;
                    pos = cameraWrapperEl.getAttribute("position");
                    direction = camera.getWorldDirection();
                    var axis = new THREE.Vector3( 0, 1, 0 );
                    var angle = Math.PI / 2;
                    direction.applyAxisAngle( axis, angle );
                    newX = pos.x-direction.x*moveSpeed;
                    newY = pos.y-direction.y*moveSpeed;
                    newZ = pos.z-direction.z*moveSpeed;
                    var newPos =  newX +" "+newY+" "+newZ;
                    cameraWrapperEl.setAttribute('position', newPos);
                })
                .onStart(function(){
                    preTime = new Date().getTime();
                })
                .start();
            }
            else if(map[68] && preKey != 68 ){ //d right
                if(preKey == 87 || preKey == 88 || preKey == 65){
                    if(tween) tween.stop();
                }
                var direction = camera.getWorldDirection();
                preKey = 68;
                map = {};
                tween = new TWEEN.Tween()
                .repeat(Infinity)
                .onUpdate(function(){
                    var now = new Date().getTime();
                    if(now-preTime <10) return;
                    preTime = now;

                    pos = cameraWrapperEl.getAttribute("position");
                    direction = camera.getWorldDirection();
                    var axis = new THREE.Vector3( 0, 1, 0 );
                    var angle = Math.PI / 2;
                    direction.applyAxisAngle( axis, angle );
                    newX = pos.x+direction.x*moveSpeed;
                    newY = pos.y+direction.y*moveSpeed;
                    newZ = pos.z+direction.z*moveSpeed;
                 
                    var newPos =  newX +" "+newY+" "+newZ;
                    cameraWrapperEl.setAttribute('position', newPos);
       
                })
                .onStart(function(){
                    preTime = new Date().getTime();
  
                })
                .start();
            }
        } );

    },


});