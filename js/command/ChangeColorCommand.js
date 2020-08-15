var ChangeColorCommand = function(viewPort, cluster, color ) {
    if(cluster == 'mpoints__-1') {
        
        viewPort.pointContainer.querySelector('#outlier').components[cluster].changeColor(color);
        return;
    }
    
    viewPort.boundingSphereDict[cluster].setAttribute('material', 'color', color );
    var pointsEl = viewPort.pointContainer.querySelector('#points');
    pointsEl.components[cluster].changeColor(color);
}