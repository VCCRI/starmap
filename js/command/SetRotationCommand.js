var SetRotationCommand = function(object, rotation ) {
    //new changeBoundingSphereColorCommand()

    //viewPort.
    
    object.object3D.rotation.copy( rotation );
    // object.object3D.traverse( function(child){

    //     child.visible = bool;

    // } )
    //console.log(config.color[cluster]);
}