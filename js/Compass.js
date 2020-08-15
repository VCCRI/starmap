
var Compass = function(cameraEl, container){

    var compassWrapperEl = this.compassWrapperEl = document.createElement('a-entity');
    compassWrapperEl.setAttribute('id','compassWrapper');
    
    var rad = 1.571;
    compassWrapperEl.setAttribute('position','-2 -1.8 -6');



   // compassWrapperEl.object3D.quaternion.copy( cameraEl.object3D.quaternion );


    var coordinateRotation = {x:0,y:0,z:0};
    var cameraRotation = {x:0,y:0,z:0};

    var cameraLookatEl = document.createElement('a-entity');
    cameraLookatEl.setAttribute('id','cameraLookat');
    //cameraLookatEl.setAttribute('meshline','path: 0 0 -0.7, 0 0 0.7; color: #000000;lineWidth:6');

    cameraLookatEl.setAttribute('geometry','primitive: plane; height: 2; width: 2');
    cameraLookatEl.setAttribute('material','side: double;src:image/arrow.png; transparent:true; depthTest:0.8');
    cameraLookatEl.setAttribute('rotation','-90 0 0');
//<a-entity geometry="primitive: plane; height: 10; width: 10" material="side: double"></a-entity>
    // var cameraLookAtLArrowEl = document.createElement('a-entity');
    // cameraLookAtLArrowEl.setAttribute('meshline','path:-0.15 0 -0.4, 0 0 -0.7; color:#000000;lineWidth:6');
    // cameraLookAtLArrowEl.object3D.quaternion.copy( cameraEl.object3D.quaternion );
    // var cameraLookAtRArrowEl = document.createElement('a-entity');
    // cameraLookAtRArrowEl.setAttribute('meshline','path:0.15 0 -0.4, 0 0 -0.7; color:#000000;lineWidth:6');

    // cameraLookatEl.appendChild(cameraLookAtLArrowEl);
    // cameraLookatEl.appendChild(cameraLookAtRArrowEl);
    compassWrapperEl.appendChild(cameraLookatEl);


    // coordinate system element
    var coordinateSystemEl = document.createElement('a-entity');
    coordinateSystemEl.setAttribute('id','compass');
    coordinateSystemEl.setAttribute('position','0 0 0');
    coordinateSystemEl.setAttribute('rotation','0 0 0');


    // xAxis
    var xAxisEl = document.createElement('a-entity');
    xAxisEl.setAttribute('meshline','path: 0.7 0 0, -0.7 0 0; color: #B22222; lineWidth: 7');
    // positive X
    var posXEl= document.createElement("a-entity");
    posXEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size:  0.5, textureSrc:'image/posX.png', sizeAttenuation: true, color: '#B22222'} );
    posXEl.setAttribute('position','0.85 0 0');
    // negative x
    var negXEl= document.createElement("a-entity");
    negXEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.5, textureSrc:'image/negX.png', sizeAttenuation: true, color: '#B22222'} );
    negXEl.setAttribute('position','-0.85 0 0');
    xAxisEl.appendChild(posXEl);
    xAxisEl.appendChild(negXEl);


    // yAxis
    var yAxisEl = document.createElement('a-entity');
    yAxisEl.setAttribute('meshline','path: 0 0.7 0, 0 -0.7 0; color: #006400; lineWidth: 7');
    // positive y
    var posYEl= document.createElement("a-entity");
    posYEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.5, textureSrc:'image/posY.png', sizeAttenuation: true,  color: '#006400'} );
    posYEl.setAttribute('position','0 0.85 0');
    // negative y
    var negYEl= document.createElement("a-entity");
    negYEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.5, textureSrc:'image/negY.png', sizeAttenuation: true,  color: '#006400'} );
    negYEl.setAttribute('position','0 -0.85 0');
    yAxisEl.appendChild(posYEl);
    yAxisEl.appendChild(negYEl);


    // zAxis
    var zAxisEl = document.createElement('a-entity');
    zAxisEl.setAttribute('meshline','path: 0 0 0.7, 0 0 -0.7; color: #0000CD;lineWidth: 7');
    // positive z
    var posZEl= document.createElement("a-entity");
    posZEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false , size: 0.5, textureSrc:'image/posZ.png', sizeAttenuation: true, color: '#0000CD'} );
    posZEl.setAttribute('position','0 0 0.85');
    // negative z
    var negZEl= document.createElement("a-entity");
    negZEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false , size: 0.5, textureSrc:'image/negZ.png', sizeAttenuation: true, color: '#0000CD'} );
    negZEl.setAttribute('position','0 0 -0.85');
    zAxisEl.appendChild(posZEl);
    zAxisEl.appendChild(negZEl);

    coordinateSystemEl.appendChild(xAxisEl);
    coordinateSystemEl.appendChild(yAxisEl);
    coordinateSystemEl.appendChild(zAxisEl);

    compassWrapperEl.appendChild(coordinateSystemEl);
    cameraEl.appendChild(compassWrapperEl);

    //camera rotation 
    cameraEl.addEventListener('componentchanged', function (evt) {
        if ( evt.detail.name !== 'rotation' ) return;
        var degRotation =  evt.detail.newData;
        //console.log(degRotation);   
        // console.log(cameraEl.object3D.getWorldRotation ());
        cameraRotation = { x: THREE.Math.degToRad(degRotation.x), y: THREE.Math.degToRad(degRotation.y), z: THREE.Math.degToRad(degRotation.z) };

        cameraLookatEl.object3D.rotation.set( cameraRotation.x-rad, 0, 0 );
        coordinateSystemEl.object3D.rotation.set( coordinateRotation.x, coordinateRotation.y-cameraRotation.y, coordinateRotation.z-cameraRotation.z  );
        // cameraLookatEl.setAttribute( "rotation",{x:cameraRotation.x,y:0,z:0} );
        // coordinateSystemEl.setAttribute( "rotation",{x:coordinateRotation.x,y:coordinateRotation.y-cameraRotation.y,z:coordinateRotation.z-cameraRotation.z} );
        
    });

    container.addEventListener('componentchanged', function (evt) {
        if (evt.detail.name !== 'rotation') return;
        var newRotation = evt.detail.newData;
       // console.log(newRotation);
        coordinateRotation = {
            x:THREE.Math.degToRad(newRotation.x),
            y:THREE.Math.degToRad(newRotation.y),
            z:THREE.Math.degToRad(newRotation.z)
        }
        coordinateSystemEl.object3D.rotation.set( coordinateRotation.x, coordinateRotation.y-cameraRotation.y, coordinateRotation.z-cameraRotation.z  );
        
       // coordinateSystemEl.setAttribute("rotation",{x:coordinateRotation.x,y:coordinateRotation.y-cameraRotation.y,z:coordinateRotation.z-cameraRotation.z});
    });
    compassWrapperEl.setAttribute( 'visible', false );
}
