// class for x y z axis
var Axis = function( viewPort) {


    // a group
    this.axisEl = document.createElement( 'a-entity' );
    this.axisEl.setAttribute('id','axis');
    viewPort.container.appendChild(this.axisEl);
}

Axis.prototype = {

    renderAxis: function( boundingBox ){
        var fromX = Math.round(boundingBox.minX*1.2);
        var endX = Math.round(boundingBox.maxX*1.2)
        if (fromX > 0) fromX = 0;
        if (endX < 5 ) endX = 5;
        var xLineEl = document.createElement( 'a-entity' );;
        xLineEl.setAttribute('line','start: ' + fromX + ' 0 0; end: ' + endX + ' 0 0; color: #B22222' );
        
        var arrowXEl= document.createElement("a-entity");
        arrowXEl.setAttribute( 'points', { positions: [endX, 0, 0] , hasColor : false , size:  80, textureSrc:'image/posX.png', sizeAttenuation: false, color: '#B22222'} );
        xLineEl.appendChild(arrowXEl);
        //arrowX.setAttribute("axis","positions:"+toX+",0,0;sizes: 80;textureSrc:posX.png;sizeAttenuation:false");
        this.axisEl.appendChild(xLineEl);


        // xLine.setAttribute("line","start: "+fromX+" 0 0; end: "+toX+" 0 0; color: #ff0000");
        // container.appendChild(xLine);
        // var arrowX= document.createElement("a-entity");
        // arrowX.setAttribute("axis","positions:"+toX+",0,0;sizes: 80;textureSrc:posX.png;sizeAttenuation:false");
        // xLine.appendChild(arrowX);
        var fromY = Math.round(boundingBox.minY*1.2);
        var endY = Math.round(boundingBox.maxY*1.2)
        if (fromY > 0) fromY = 0;
        if (endY < 5 ) endY = 5;
        var yLineEl = document.createElement( 'a-entity' );
        yLineEl.setAttribute('line','start: 0 '+ fromY + ' 0; end: 0 ' + endY + ' 0; color: #006400' );
        var arrowYEl= document.createElement("a-entity");
        arrowYEl.setAttribute( 'points', { positions: [0, endY, 0] , hasColor : false , size:  80, textureSrc:'image/posY.png', sizeAttenuation: false , color: '#006400'} );
        yLineEl.appendChild(arrowYEl);
        this.axisEl.appendChild(yLineEl);


        var fromZ = Math.round(boundingBox.minZ*1.2);
        var endZ = Math.round(boundingBox.maxZ*1.2)
        if (fromZ > 0) fromZ = 0;
        if (endZ < 5 ) endZ = 5;
        var zLineEl = document.createElement( 'a-entity' );
        zLineEl.setAttribute('line','start: 0 0 '+ fromZ + '; end: 0 0 ' + endZ + '; color: #0000CD' );
        var arrowZEl= document.createElement("a-entity");
        arrowZEl.setAttribute( 'points', { positions: [0, 0, endZ] , hasColor : false , size:  80, textureSrc:'image/posZ.png', sizeAttenuation: false, color: '#0000CD'} );
        yLineEl.appendChild(arrowZEl);   
        this.axisEl.appendChild(zLineEl);




    }
}