// class for x y z axis
var Axis = function( viewPort ) {

    var boundingBox = viewPort.boundingBox;
    console.log(boundingBox);

    // a group
    var axisEl = document.createElement( 'a-entity' );
/* <a-entity line="start: 0, 1, 0; end: 2 0 -5; color: red"
          line__2="start: -2, 4, 5; end: 0 4 -3; color: green"></a-entity> */



    var fromX = Math.round(boundingBox.minX*1.2);
    var endX = Math.round(boundingBox.maxX*1.2)
    var xLineEl = document.createElement( 'a-entity' );;
    xLineEl.setAttribute('line','start: ' + fromX + ' 0 0; end: ' + endX + ' 0 0; color: #ff0000' );
    
    var arrowXEl= document.createElement("a-entity");
    arrowXEl.setAttribute( 'points', { positions: [endX, 0, 0] , hasColor : false , size: 100, textureSrc:'image/posX.png', sizeAttenuation: false} );
    xLineEl.appendChild(arrowXEl);
    //arrowX.setAttribute("axis","positions:"+toX+",0,0;sizes:100;textureSrc:posX.png;sizeAttenuation:false");
    axisEl.appendChild(xLineEl);


    // xLine.setAttribute("line","start: "+fromX+" 0 0; end: "+toX+" 0 0; color: #ff0000");
    // container.appendChild(xLine);
    // var arrowX= document.createElement("a-entity");
    // arrowX.setAttribute("axis","positions:"+toX+",0,0;sizes:100;textureSrc:posX.png;sizeAttenuation:false");
    // xLine.appendChild(arrowX);
    var fromY = Math.round(boundingBox.minY*1.2);
    var endY = Math.round(boundingBox.maxY*1.2)
    var yLineEl = document.createElement( 'a-entity' );
    yLineEl.setAttribute('line','start: 0 '+ fromY + ' 0; end: 0 ' + endY + ' 0; color: #00ff00' );
    var arrowYEl= document.createElement("a-entity");
    arrowYEl.setAttribute( 'points', { positions: [0, endY, 0] , hasColor : false , size: 100, textureSrc:'image/posY.png', sizeAttenuation: false} );
    yLineEl.appendChild(arrowYEl);
    axisEl.appendChild(yLineEl);


    var fromZ = Math.round(boundingBox.minZ*1.2);
    var endZ = Math.round(boundingBox.maxZ*1.2)
    var zLineEl = document.createElement( 'a-entity' );
    zLineEl.setAttribute('line','start: 0 0 '+ fromZ + '; end: 0 0 ' + endZ + '; color: #0000ff' );
    var arrowZEl= document.createElement("a-entity");
    arrowZEl.setAttribute( 'points', { positions: [0, 0, endZ] , hasColor : false , size: 100, textureSrc:'image/posZ.png', sizeAttenuation: false} );
    yLineEl.appendChild(arrowZEl);   
    axisEl.appendChild(zLineEl);


    viewPort.container.appendChild(axisEl);
    // var fromY = center.y-radius-10;
    // var toY = center.y+radius+10;
    // var yLine  = document.createElement('a-entity');
    
    // yLine.setAttribute("line","start: 0 "+fromY+" 0; end:  0 "+toY+" 0; color: #00ff00");
    // container.appendChild(yLine);
    // var arrowY= document.createElement("a-entity");
    // arrowY.setAttribute("axis","positions:0,"+toY+",0;sizes:100;textureSrc:posY.png;sizeAttenuation:false");
    // yLine.appendChild(arrowY);
    
    // var fromZ = center.z-radius-10;
    // var toZ = center.z+radius+10;
    // var zLine  = document.createElement('a-entity');
    
    // zLine.setAttribute("line","start: 0 0 "+fromZ+"; end:  0 0 "+toZ+"; color: #0000ff");
    // container.appendChild(zLine);
    // var z= document.createElement("a-entity");
    // z.setAttribute("axis","positions:0,0,"+toZ+";sizes:100;textureSrc:posZ.png;sizeAttenuation:false");
    // zLine.appendChild(z);

}