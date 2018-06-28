AFRAME.registerComponent('drag-rotate-component',{
    schema : { speed : {default:1}},
    init : function() {
        this.ifMouseDown = false;
        this.ifTouchDown = false;
        this.previousTouchX = 0;
        this.x_cord = 0;
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

    },

    OnDocumentTouchEnd : function(){

        this.ifTouchDown = false;

    },

    OnDocumentTouchMove : function(event){
        if(this.ifTouchDown) {
            var touch = event.touches[0];

            var movementX = touch.screenX - this.previousTouchX;
            //console.log(touch.screenX,this.previousTouchX);
            this.el.object3D.rotateY(movementX*this.data.speed/1000);
            this.previousTouchX = touch.screenX;
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