function createAxis(center,radius,container){
    var fromX = center.x-radius-10;
    var toX = center.x+radius+10;
    var xLine  = document.createElement('a-entity');
    xLine.setAttribute("line","start: "+fromX+" 0 0; end: "+toX+" 0 0; color: #ff0000");
    container.appendChild(xLine);
    var arrowX= document.createElement("a-entity");
    arrowX.setAttribute("axis","positions:"+toX+",0,0;sizes:100;textureSrc:posX.png;sizeAttenuation:false");
    xLine.appendChild(arrowX);
    
    
    var fromY = center.y-radius-10;
    var toY = center.y+radius+10;
    var yLine  = document.createElement('a-entity');
    
    yLine.setAttribute("line","start: 0 "+fromY+" 0; end:  0 "+toY+" 0; color: #00ff00");
    container.appendChild(yLine);
    var arrowY= document.createElement("a-entity");
    arrowY.setAttribute("axis","positions:0,"+toY+",0;sizes:100;textureSrc:posY.png;sizeAttenuation:false");
    yLine.appendChild(arrowY);
    
    var fromZ = center.z-radius-10;
    var toZ = center.z+radius+10;
    var zLine  = document.createElement('a-entity');
    
    zLine.setAttribute("line","start: 0 0 "+fromZ+"; end:  0 0 "+toZ+"; color: #0000ff");
    container.appendChild(zLine);
    var z= document.createElement("a-entity");
    z.setAttribute("axis","positions:0,0,"+toZ+";sizes:100;textureSrc:posZ.png;sizeAttenuation:false");
    zLine.appendChild(z);
    // var 
    //  <a-entity  axis="positions:0,0,0;sizes:0.1;textureSrc:posX.png" position="0.12 0 0"></a-entity>
}

function createCompass(){
    var fromX = center.x-radius-10;
    var toX = center.x+radius+10;
    var xLine  = document.createElement('a-entity');
    xLine.setAttribute(",line","start: "+fromX+" 0 0; end: "+toX+" 0 0; color: #ff0000");
    container.appendChild(xLine);
    
    
    var fromY = center.y-radius-10;
    var toY = center.y+radius+10;
    var yLine  = document.createElement('a-entity');
    
    yLine.setAttribute("line","start: 0 "+fromY+" 0; end:  0 "+toY+" 0; color: #00ff00");
    container.appendChild(yLine);
    
    var fromZ = center.z-radius-10;
    var toZ = center.z+radius+10;
    var zLine  = document.createElement('a-entity');
    
    zLine.setAttribute("line","start: 0 0 "+fromZ+"; end:  0 0 "+toZ+"; color: #0000ff");
    container.appendChild(zLine);
}