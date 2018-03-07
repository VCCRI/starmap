
var Compass = function(cameraEl, container){

    var compassWrapperEl = this.compassWrapperEl = document.createElement('a-entity');
    compassWrapperEl.setAttribute('id','compassWrapper');
    

    compassWrapperEl.setAttribute('position','-0.35 -0.35 -1');
    var coordinateRotation = {x:0,y:0,z:0};
    var cameraRotation = {x:0,y:0,z:0};

    var cameraLookatEl = document.createElement('a-entity');
    cameraLookatEl.setAttribute('id','cameraLookat');
    cameraLookatEl.setAttribute('meshline','path: 0 0 -0.1, 0 0 0.1; color: #000000;lineWidth:10');

    var cameraLookAtLArrowEl = document.createElement('a-entity');
    cameraLookAtLArrowEl.setAttribute('meshline','path:-0.03 0 -0.05, 0 0 -0.1; color:#000000;lineWidth:10');

    var cameraLookAtRArrowEl = document.createElement('a-entity');
    cameraLookAtRArrowEl.setAttribute('meshline','path:0.03 0 -0.05, 0 0 -0.1; color:#000000;lineWidth:10');

    cameraLookatEl.appendChild(cameraLookAtLArrowEl);
    cameraLookatEl.appendChild(cameraLookAtRArrowEl);
    compassWrapperEl.appendChild(cameraLookatEl);


    // coordinate system element
    var coordinateSystemEl = document.createElement('a-entity');
    coordinateSystemEl.setAttribute('id','compass');
    coordinateSystemEl.setAttribute('position','0 0 0');
    coordinateSystemEl.setAttribute('rotation','0 0 0');


    // xAxis
    var xAxisEl = document.createElement('a-entity');
    xAxisEl.setAttribute('meshline','path: 0.1 0 0, -0.1 0 0; color: #ff0000');
    // positive X
    var posXEl= document.createElement("a-entity");
    posXEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size:  0.1, textureSrc:'image/posX.png', sizeAttenuation: true} );
    posXEl.setAttribute('position','0.12 0 0');
    // negative x
    var negXEl= document.createElement("a-entity");
    negXEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.1, textureSrc:'image/negX.png', sizeAttenuation: true} );
    negXEl.setAttribute('position','-0.14 0 0');
    xAxisEl.appendChild(posXEl);
    xAxisEl.appendChild(negXEl);


    // yAxis
    var yAxisEl = document.createElement('a-entity');
    yAxisEl.setAttribute('meshline','path: 0 0.1 0, 0 -0.1 0; color: #00ff00');
    // positive y
    var posYEl= document.createElement("a-entity");
    posYEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.1, textureSrc:'image/posY.png', sizeAttenuation: true} );
    posYEl.setAttribute('position','0 0.12 0');
    // negative y
    var negYEl= document.createElement("a-entity");
    negYEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false ,  size: 0.1, textureSrc:'image/negY.png', sizeAttenuation: true} );
    negYEl.setAttribute('position','0 -0.14 0');
    yAxisEl.appendChild(posYEl);
    yAxisEl.appendChild(negYEl);


    // zAxis
    var zAxisEl = document.createElement('a-entity');
    zAxisEl.setAttribute('meshline','path: 0 0 0.1, 0 0 -0.1; color: #0000ff');
    // positive z
    var posZEl= document.createElement("a-entity");
    posZEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false , size: 0.1, textureSrc:'image/posZ.png', sizeAttenuation: true} );
    posZEl.setAttribute('position','0 0 0.12');
    // negative z
    var negZEl= document.createElement("a-entity");
    negZEl.setAttribute( 'points', { positions: [0,0,0] , hasColor : false , size: 0.1, textureSrc:'image/negZ.png', sizeAttenuation: true} );
    negZEl.setAttribute('position','0 0 -0.14');
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

        cameraLookatEl.object3D.rotation.set( cameraRotation.x, 0, 0 );
        coordinateSystemEl.object3D.rotation.set( coordinateRotation.x, coordinateRotation.y-cameraRotation.y, coordinateRotation.z-cameraRotation.z  );
        // cameraLookatEl.setAttribute( "rotation",{x:cameraRotation.x,y:0,z:0} );
        // coordinateSystemEl.setAttribute( "rotation",{x:coordinateRotation.x,y:coordinateRotation.y-cameraRotation.y,z:coordinateRotation.z-cameraRotation.z} );
        
    });

    container.addEventListener('componentchanged', function (evt) {
        if (evt.detail.name !== 'rotation') return;
        coordinateRotation = evt.detail.newData;

        coordinateSystemEl.object3D.rotation.set( coordinateRotation.x, coordinateRotation.y-cameraRotation.y, coordinateRotation.z-cameraRotation.z  );
        
       // coordinateSystemEl.setAttribute("rotation",{x:coordinateRotation.x,y:coordinateRotation.y-cameraRotation.y,z:coordinateRotation.z-cameraRotation.z});
    });
    compassWrapperEl.setAttribute( 'visible', false );
    return compassWrapperEl;
}
