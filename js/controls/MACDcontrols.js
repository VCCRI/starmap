AFRAME.registerComponent('MACDRotationControl', {
    // schema: {
    //     moveSpeed: {
    //       default: 0.03
    //     },
    //     runSpeed:{
    //         default: 0.05
    //     }
    //   },
    init: function () {
        this.prevAnimation = null;


        window.addEventListener( 'keydown', function( e ) {
            e.preventDefault( );
         
            e = e ||window.event; // to deal with IE
            var map = {};
            map[e.keyCode] = e.type == 'keydown';
            if (map[67] || map[69]||map[81]||map[90]){
                if((map[67]||map[81]||map[90])&& preKey == 87) return;
                if((map[67]||map[69]||map[90])&& preKey == 65) return;
                if((map[69]||map[81]||map[90])&& preKey == 68) return;
                if((map[67]||map[69]||map[81])&& preKey == 88) return;
            
            }else if(map[85]){ //Attack u


            }else if(map[72]){ //Skill1 h

    
            }else if(map[74]){ //Skill2 j


            }else if(map[70] || map[78]||map[84]||map[82]){


            }else if(map[87] && preKey != 87){// w front
            

            }else if(map[88] && preKey != 88 ){//x back
               
                
            }else if(map[65] && preKey != 65){ //a left
            

            }else if(map[68] && preKey != 68 ){ //d right
                

            }
        } );

    },


});