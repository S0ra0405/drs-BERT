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
        ////console.log(network.body.nodes[key].labelModule.elementOptions.label);
        labeldata[key] = network.body.nodes[key].labelModule.elementOptions.label;
    }
    return labeldata;
}

function getEdges(network){
    let data = network.body.edgeIndices;
    //console.log(data);
    return data;
}