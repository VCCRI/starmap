AFRAME.registerComponent('keyboardcontrol', {
    schema: {
        rotateSpeed: {
            type:"number",
            default: 15
        },
        scaleSpeed:{
            type:"number",
            default: 0.1
        },
        moveSpeed: {
            type:"number",
            default: 1
        }
      },
    init: function () {

       //
        var moveSpeed = this.data.moveSpeed;
        var preKey = 0;
        var preTime;
        var data = this.data;
        var cameraWrapperEl = document.querySelector('#cameraWrapper');
        var camera = cameraWrapperEl.querySelector('#camera').object3D;
        var container = document.querySelector('#container');
        console.log("hahaha");

        window.addEventListener( 'keydown', function( e ) {
            e.preventDefault( );
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            
            /*
            ROTATE
            */

            // ROTATE LEFT
            if(map[37]){
                var rotate = container.getAttribute("rotation");
                var y = rotate.y - data.rotateSpeed;
                var newCoor = rotate.x+" "+y+" "+rotate.z;
                container.setAttribute("rotation",newCoor);
                //console.log("left");
                map = {};
            }
            // ROTATE RIGHT
            else if(map[39]){
                var rotate = container.getAttribute("rotation");
                var y = rotate.y + data.rotateSpeed;
                var newCoor = rotate.x+" "+y+" "+rotate.z;
                container.setAttribute("rotation",newCoor);
                map = {};   
            }
            // ROTATE UP
            else if(map[38]){
                var rotate = container.getAttribute("rotation");
                var x = rotate.x - data.rotateSpeed;
                var newCoor = x+" "+rotate.y+" "+rotate.z;
                container.setAttribute("rotation",newCoor);
                map = {};
            }
            // ROTATE DOWN
            else if(map[40]){
                var rotate = container.getAttribute("rotation");
                var x = rotate.x + data.rotateSpeed;
                var newCoor = x+" "+rotate.y+" "+rotate.z;
                container.setAttribute("rotation",newCoor);
                map = {};    
            }
        
            /*
            MOVE
            */

            // MOVE FORARD
            else if(map[87]){
                var direction = camera.getWorldDirection();
                var pos = cameraWrapperEl.getAttribute('position');
                var newPos =  {x:pos.x-direction.x*data.moveSpeed, y:pos.y-direction.y*data.moveSpeed, z:pos.z-direction.z*data.moveSpeed};
                cameraWrapperEl.setAttribute('position', newPos);
                map = {};
            }
            // MOVE BACKWARD
            else if(map[83]){
                var direction = camera.getWorldDirection();
                var pos = cameraWrapperEl.getAttribute('position');
                var newPos =  {x:pos.x+direction.x*data.moveSpeed, y:pos.y+direction.y*data.moveSpeed, z:pos.z+direction.z*data.moveSpeed};
                cameraWrapperEl.setAttribute('position', newPos);
                map = {};
            }
            // MOVE LEFT
            else if(map[65]){
                var direction = camera.getWorldDirection();
                var pos = cameraWrapperEl.getAttribute('position');
                var axis = new THREE.Vector3( 0, 1, 0 );
                var angle = Math.PI / 2;
                direction.applyAxisAngle( axis, angle );
                var newPos =  {x:pos.x-direction.x*data.moveSpeed, y:pos.y-direction.y*data.moveSpeed, z:pos.z-direction.z*data.moveSpeed};
                cameraWrapperEl.setAttribute('position', newPos);
                map = {};
            }
            // MOVE RIGHT
            else if(map[68]){
                var direction = camera.getWorldDirection();
                var pos = cameraWrapperEl.getAttribute('position');
                var axis = new THREE.Vector3( 0, 1, 0 );
                var angle = Math.PI / 2;
                direction.applyAxisAngle( axis, angle );
                var newPos =  {x:pos.x+direction.x*data.moveSpeed, y:pos.y+direction.y*data.moveSpeed, z:pos.z+direction.z*data.moveSpeed};
                cameraWrapperEl.setAttribute('position', newPos);
                map = {};
            }
            
            /*
            scale
            */

            // SCALE UP
            else if(map[81]){
                console.log(container.object3D);
                var scale = container.getAttribute("scale");
                var newScale = scale.x + data.scaleSpeed;
                var newCoor = newScale+" "+newScale+" "+newScale;
                container.setAttribute("scale",newCoor);
                map = {};
            }
            // SCALE DOWN
            else if(map[69]){
                console.log("asfsdaf");
                var scale = container.getAttribute("scale");
                if(scale.x <= 0.5) return;
                var newScale = scale.x - data.scaleSpeed;
                var newCoor = newScale+" "+newScale+" "+newScale;
                container.setAttribute("scale",newCoor);
              
                map = {};
            }
        
        } );

    },


});
