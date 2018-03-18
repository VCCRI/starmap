AFRAME.registerComponent('drag-rotate-component',{
    schema : { speed : {default:2}},
    init : function() {
        this.ifMouseDown = false;
        this.ifTouchDown = false;
        this.previousTouchX = 0;
        this.previousTouchY = 0;
        this.x_cord = 0;
        this.oldRotation = new THREE.Vector3(0,0,0);
        //this.y_cord = 0;
        document.addEventListener('mousedown',this.OnDocumentMouseDown.bind(this));
        document.addEventListener('mouseup',this.OnDocumentMouseUp.bind(this));
        document.addEventListener('mousemove',this.OnDocumentMouseMove.bind(this));

        document.addEventListener('touchstart',this.OnDocumentTouchStart.bind(this));
        document.addEventListener('touchend',this.OnDocumentTouchEnd.bind(this));
        document.addEventListener('touchmove',this.OnDocumentTouchMove.bind(this));


    },
    OnDocumentTouchStart : function(event){

        this.ifTouchDown = true;
        this.previousTouchX = event.touches[0].screenX;
        this.previousTouchY = event.touches[0].screenY;

    },

    OnDocumentTouchEnd : function(){

        this.ifTouchDown = false;

    },

    OnDocumentTouchMove : function(event){
        if(this.ifTouchDown) {
            var touch = event.touches[0];

            var movementX = touch.screenX - this.previousTouchX;
            var movementY = touch.screenY - this.previousTouchY;
            var comX = Math.abs(movementX);
            var comY = Math.abs(movementY);
            var newRotation = this.el.object3D.rotation.clone( );
            this.el.object3D.rotation.copy( this.oldRotation );  
            //console.log(touch.screenX,this.previousTouchX);
            if( comX > comY ){

                //this.el.object3D.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
                newRotation.y +=  movementX*this.data.speed/1000;
               // this.el.object3D.rotateY(movementX*this.data.speed/1000);
                //this.previousTouchX = touch.screenX;
                console.log("X");
          
            }
            else{
                //this.el.object3D.rotateX(movementY*this.data.speed/1000);  
                newRotation.x +=  movementY*this.data.speed/1000;
                //this.previousTouchY = touch.screenY;
                console.log("Y");
            }
            this.el.object3D.rotation.copy( newRotation );  
            this.previousTouchX = touch.screenX;
            this.previousTouchY = touch.screenY;
        }
    },

    OnDocumentMouseDown : function(event) {
        this.ifMouseDown = true;
        this.x_cord = event.clientX;
        //console.log(this.x_cord);
    //this.y_cord = event.clientY;
    },
      
    OnDocumentMouseUp : function() {
        this.ifMouseDown = false;

    },

    OnDocumentMouseMove : function(event) {
        if(this.ifMouseDown){

            var temp_x = event.clientX-this.x_cord;
            this.el.object3D.rotateY(temp_x*this.data.speed/1000);
            this.x_cord = event.clientX;

        }
    }
});