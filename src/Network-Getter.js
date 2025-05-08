function getData(network){
    //console.log(network);
    var data = network.body.data;
    return data;
  } 

function getOptions(network){
    var opt = network.options;
    return opt;
} 

function getNodes(network){
    let data = network.body.nodeIndices;
    ////console.log(data);
    ////console.log(network.body.nodes[1].labelModule.elementOptions.label);
    let labeldata = {};
    for(let i=0;i<data.length;i++){
        let key = data[i];
        let node = network.body.nodes[key];
        ////console.log(network.body.nodes[key].labelModule.elementOptions.label);
        labeldata[key] = {
            label: node.labelModule.elementOptions.label,
            color: node.options.color.border || null
        };
    }
    return labeldata;
}

function getEdges(network){
    let data = network.body.edgeIndices;
    //console.log(data);
    return data;
}