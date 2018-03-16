var VoiceControl = function(viewPort) {
    
    this.preCommand = 'stop';
    
    this.guiEl = viewPort.vrEditor.guiEl;
    
            // console.log(camera);
    this.preTime = 0;
    this.MOVESPEED = 0.5;
    this.ROTATESPEED = 0.05;
    
    this.tween = undefined;
    this.unitVector = new THREE.Vector3( 0, 1, 0 );

}

VoiceControl.prototype = {
    
    init : function() {
        // TODO
        var cameraWrapper = document.querySelector('#cameraWrapper').object3D;
        var camera = document.querySelector('#camera').object3D;
        var container = document.querySelector('#container').object3D;
        var scope = this;
        if (!annyang) return;
                    // Let's define a command.
        var commands = {
            'forward': function( ) { 
                

                var e = new Event("keydown");
                e.key='w';    // just enter the char you want to send 
                e.keyCode= 87;
                e.which=e.keyCode;
     
                document.dispatchEvent(e);
              
                
            },
            'backward' : function( ) {
                var e = new Event("keydown");
                e.key='x';    // just enter the char you want to send 
                e.keyCode=88;
                e.which=e.keyCode;
 
                document.dispatchEvent(e);
               
            },
            
            'left' : function(){

                var e = new Event("keydown");
                e.key='a';    // just enter the char you want to send 
                e.keyCode= 65;
                e.which=e.keyCode;
      
                document.dispatchEvent(e);
            },
            
            
            'right' : function(){
                var e = new Event("keydown");
                e.key='d';    // just enter the char you want to send 
                e.keyCode= 68;
                e.which=e.keyCode;
    
                document.dispatchEvent(e);
                
                
            },
            'rotate' : function() {
                
                var e = new Event("keydown");
                e.key='j';    // just enter the char you want to send 
                e.keyCode = 74;
                e.which = e.keyCode;
    
                document.dispatchEvent(e);
                
            },
            'in' : function(){
                
                var e = new Event("keydown");
                e.key='u';    // just enter the char you want to send 
                e.keyCode= 85;
                e.which=e.keyCode;
                console.log(e);

                document.dispatchEvent(e);
                
            },
            'out' : function(){
                
                var e = new Event("keydown");
                e.key='h';    // just enter the char you want to send 
                e.keyCode= 72;
                e.which=e.keyCode;
                console.log(e);
      
                document.dispatchEvent(e);
                
            },
            'select': function() {
              
                 scope.guiEl.emit("pressedMenu");
                
            },
            'stop' : function () {
                
                var e = new Event("keydown");
                e.key='c';    // just enter the char you want to send 
                e.keyCode= 80;
                e.which=e.keyCode;
  
                document.dispatchEvent(e);
                
            }
            
        
        };
        annyang.addCommands(commands);
        

    },
    
    enableVoiceControl: function(bool){ // Start listening.
        if(bool) annyang.start();
        else annyang.pause();
      },
      
    //   stopAllTween: function( ) {
    //       TWEEN.removeAll();
    //       this.tween.stop()
    //     // var activeTween = TWEEN.getAll();
    //      console.log('force stop all');
    //     // for ( var j = 0 ; j < activeTween.length ; j += 1 ) {
    //     //     activeTween[j].stop();
    //     // }
    //   }
    
}