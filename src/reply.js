function replyEditedNetwork(){
    let nodes = getNodes(main_network);
    let edges = getEdges(main_network);
    //console.log(nodes);
    //console.log(edges);
    return {'nodes': nodes, 'edges': edges};
}

function Submit_EditedNetwork(){
    $('#download').on('click', function(){
        let data = replyEditedNetwork();
        let json = JSON.stringify(data);
        let path = 'editlog';
        SendLog_json(json, path);
    });
}
