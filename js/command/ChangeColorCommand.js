var ChangeColorCommand = function(viewPort, cluster, color ) {
    //new changeBoundingSphereColorCommand()
    //viewPort.boundingSphereDict[cluster].object3D.material.color = color;
    viewPort.boundingSphereDict[cluster].object3D.children[0].material.color.set(color);
    //('material', 'color', color );
    //viewPort.
    viewPort.pointsDict[cluster].setAttribute('points', 'color', color);
    //console.log(config.color[cluster]);
}