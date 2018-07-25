var VoiceControl = function(viewPort) {
    
    this.preCommand = 'stop';
    this.viewPort = viewPort;
    this.guiEl = viewPort.vrEditor.guiEl;
    
            // console.log(camera);
    this.preTime = 0;
    this.MOVESPEED = 0.5;
    this.ROTATESPEED = 0.05;
    
    this.tween = undefined;
    this.unitVector = new THREE.Vector3( 0, 1, 0 );


    var commandBar = this.commandBar = document.createElement("a-entity");
    commandBar.setAttribute("geometry","primitive:plane;height: 0.5; width: 2.5");
    commandBar.setAttribute("material","color:#494949;transparent:true; opacity:0.5");
    commandBar.setAttribute("position","-3 2.5 -5.1");
    commandBar.setAttribute('rotation','0 25 0');
    
 
    var pgeometry = new THREE.PlaneGeometry( 0.25, 0.25);
    
    var texture = new THREE.TextureLoader().load('image/mic.png');
    var pmaterial = new THREE.MeshBasicMaterial( {map: texture,color:0xffffff, side: THREE.FrontSide, alphaTest:0.5} );
    var micIcon = this.micIcon = new THREE.Mesh( pgeometry, pmaterial );
    micIcon.position.set(-0.1,0,0.01);
    commandBar.object3D.add(micIcon);

    
    //   var damageanimation = document.createElement("a-animation");
    //   damageanimation.setAttribute("attribute","material.color");
    //   damageanimation.setAttribute("begin","damage");
    //   damageanimation.setAttribute("from","red");
    //   damageanimation.setAttribute("to","gray");
    //   damageanimation.setAttribute("dur","1000");
    //   damageanimation.setAttribute("repeat","0");
    //   commandBar.appendChild(damageanimation);
    
    var command = this.command = document.createElement("a-text");
    
    command.setAttribute("position","0.02 0.011 0");
    command.setAttribute("value","");
    
    command.setAttribute("width","3");
    command.setAttribute("color","#ffffff");
    commandBar.appendChild(command);
    
    //voice help
    var voiceHelpBar = this.voiceHelpBar = document.createElement('a-entity');
    voiceHelpBar.setAttribute("geometry","primitive:plane;height: 3; width: 3");
    voiceHelpBar.setAttribute("material","color:#494949;transparent:true; opacity:0.5");
    voiceHelpBar.setAttribute("position","0 0 -5.1");
    voiceHelpBar.setAttribute("scale","0 0 0");
    
    
    var voiceHelpPopUp = document.createElement('a-animation');
    voiceHelpPopUp.setAttribute('begin', 'help');
    voiceHelpPopUp.setAttribute('attribute', 'scale');
    voiceHelpPopUp.setAttribute('to', '1 1 1');
    voiceHelpPopUp.setAttribute('dur', '1000');
    voiceHelpBar.appendChild(voiceHelpPopUp);
   
   
    var voiceHelpDisappear = document.createElement('a-animation');
    voiceHelpDisappear.setAttribute('begin', 'helpend');
    voiceHelpDisappear.setAttribute('attribute', 'scale');
    voiceHelpDisappear.setAttribute('to', '0 0 0');
    voiceHelpDisappear.setAttribute('dur', '500');
    voiceHelpBar.appendChild(voiceHelpDisappear);
   
    
    var hbgeometry = new THREE.PlaneGeometry( 3, 3);
    var hbtexture = new THREE.TextureLoader().load('image/voicecommand.png');
    var hbmaterial = new THREE.MeshBasicMaterial( {map: hbtexture,color:0xffffff, side: THREE.FrontSide, alphaTest:0.5} );
    var helptext = this.helptext = new THREE.Mesh( hbgeometry, hbmaterial );
    helptext.position.set(-0.1,0,0.01);
    voiceHelpBar.object3D.add(helptext);
    
    
}

VoiceControl.prototype = {
    
  
    init : function() {
        // TODO
        var cameraWrapper = document.querySelector('#cameraWrapper').object3D;
        var camera = document.querySelector('#camera').object3D;
        var container = document.querySelector('#container').object3D;
        var scope = this;
        var helpStarted = false;
        if (!annyang) return;

        scope.viewPort.cameraEl.appendChild(scope.commandBar);
        scope.viewPort.cameraEl.appendChild(scope.voiceHelpBar);
       // scope.viewPort.cameraEl.appendChild(scope.gamepadBar);
        scope.commandBar.setAttribute('visible',false);
       // scope.helpBar.setAttribute('visible',false);
        //scope.gamepadBar.setAttribute('visible',false);
       
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
                
            },
            
            'reset' : function () {
                
                var e = new Event("keydown");
                e.key='v';    // just enter the char you want to send 
                e.keyCode= 86;
                e.which=e.keyCode;
  
                document.dispatchEvent(e);
                
            },
            'init' : function(){
                scope.viewPort.reset();
                scope.viewPort.vrEditor.resetUIPoistion();
            },
            'help' : function(){
                if (helpStarted) return;
                helpStarted = true;
                scope.voiceHelpBar.emit('help');
                setTimeout(function () {
                    helpStarted = false;
                    scope.voiceHelpBar.emit('helpend');
                },5000);
            }
            
        
        };
        annyang.addCommands(commands);
        annyang.addCallback('resultNoMatch', function(event) {
            scope.micIcon.material.color = new THREE.Color(0xffffff);
            var cmd = event[0];
            if( cmd.length > 15 ) cmd = cmd.slice(0,15);
            scope.command.setAttribute("value",cmd);
            scope.command.setAttribute("color","#ff0000");
            
        });
        
        annyang.addCallback('resultMatch', function(cmd) {
           scope.micIcon.material.color = new THREE.Color(0xffffff);
           scope.command.setAttribute("value",cmd);
           scope.command.setAttribute("color","#3e8e41");
            
        });
        annyang.addCallback('soundstart', function() {
    
            scope.micIcon.material.color = new THREE.Color(0xff0000);
            scope.command.setAttribute("value",'');
        });

    },
    
    enableVoiceControl: function(bool){ 
        if (!annyang) return;
                // Start listening.
        if(bool) {
            annyang.start();
            
            this.commandBar.setAttribute('visible',true);
           // this.gamepadBar.setAttribute('visible',true);
            //this.helpBar.setAttribute('visible',true);
            
        }
        else{ annyang.pause();
        
            this.commandBar.setAttribute('visible',false);
            //this.gamepadBar.setAttribute('visible',false);
            //this.helpBar.setAttribute('visible',false);
        
        }
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
    
};