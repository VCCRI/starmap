var Points =  function () {
    
    this.positions = [];
    this.index = [];
    this.textureInfo = [];
    this.color ='';
    this.features = {};
    this.boundingSphere = {};
}

Points.prototype = {
    
    findPoint : function ( index ) {
        
        return { x:this.positions[3*index], y:this.positions[3*index+1], z:this.positions[3*index+2] }
        
    },
    
    getSurrendingPoints : function ( threshhold, p ) {
        var l = [];

        for( var index = 0; index< this.positions.length; index += 3 ) {
             
            var x0 = this.positions[index];
            var y0 = this.positions[index+1];
            var z0 = this.positions[index+2];
 
            var newPoint = { x:x0, y:y0, z:z0, i:index/3, f:[], d:this.calculateDistance(x0, y0, z0, p),t:this.textureInfo[index/3]};

            for ( var value of Object.values(this.features)) {
                newPoint.f.push(value[index/3]);
            }

             
            if( Math.abs(x0-p.x) <= threshhold && Math.abs(y0-p.y)<=threshhold && Math.abs(z0-p.z) <= threshhold ) {
                
                l.push(newPoint);
                
            }
            
         }
         
         l.sort(function(p1, p2){return p1.d - p2.d});
         //console.log(l);
         return l;
         

    }, 

    calculateDistance : function(x0, y0, z0, p) {
        return Math.pow((x0-p.x),2)+Math.pow((y0-p.y),2)+Math.pow((z0-p.z),2);
        
    }
}