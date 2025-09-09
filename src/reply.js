function replyEditedNetwork(){
    let nodes = getNodes(main_network);
    let edges = getEdges(main_network);
    console.log(nodes);
    //console.log(edges);
    return {'nodes': nodes, 'edges': edges};
}

function Submit_CreatedNetwork(){
    let data = replyEditedNetwork();
    // let dataObject = JSON.parse(data);
    data.step = "Create";

    // data = JSON.stringify(dataObject);
    let json = JSON.stringify(data);
    let path = 'editlog';
    SendLog_json(json, path);
}

function Submit_ChangeNetwork(){
    let data = replyEditedNetwork();
    data.step = "Swap";
    let json = JSON.stringify(data);
    let path = 'editlog';
    SendLog_json(json, path);
}

function Submit_EditedNetwork(){
    $('#download').on('click', function(){
        let data = replyEditedNetwork();
        // let dataObject = JSON.parse(data);
        data.step = "Edited";
        // data = JSON.stringify(dataObject);
        let json = JSON.stringify(data);
        let path = 'editlog';
        SendLog_json(json, path);
    });
}
