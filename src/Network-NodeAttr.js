
function NetworkContext(){
    main_network.on("oncontext", function (params) {
        switchingNodes = main_network.getNodeAt(params.pointer.DOM);
        //console.log(params);
        if(switchingNodes > 0){
            //console.log(switchingNodes);
            main_network.selectNodes(String(switchingNodes));
        }
        params.event.preventDefault();

        RedefAttribute(switchingNodes);
        /** コンテキストメニューの表示
        $(".custom-menu").css({
            top: params.event.pageY + "px",
            left: params.event.pageX + "px",
            visibility: "visible",
        });
        */
    });
    /** コンテキストメニューの非表示
    main_network.on("click", function(){
        $(".custom-menu").css({
            visibility: "hidden",
            transition: "1.0s"
        });
    });
    */
}

function NodeColor(name){
    this.background = '#575f5d';
    this.highlight_bg = '#575f5d';
    if(name == "claim"){
        this.name = name;
        this.next_name = "ground"
        this.border = '#76eec6';
        this.highlight_bd = '#9AFDE8';
    }else if(name == "ground"){
        this.name = name;
        this.next_name = "cant_predict";
        this.border = '#EF476F';
        this.highlight_bd = '#F8A0A3';
    }else{
        this.name = name;
        this.next_name = "claim";
        this.border = '#454A49';
        this.highlight_bd = '#A0A7A5';
    }
    return this;
}

function RedefAttribute(nodeId){
    //エッジ全部非表示→点数計算→AddEdge改変でエッジ描画
    //console.log(nodeId);
    if (nodeId) {
        let nodeColor = new NodeColor(contents[nodeId-1]);
        contents[nodeId-1] = nodeColor.next_name;
        main_network.body.nodes[nodeId].options.color = {   
            "background": nodeColor.background, 
            "border": nodeColor.border,
            "highlight": {
                "background": nodeColor.highlight_bg,
                "border": nodeColor.highlight_bd
            }
        }
    }
}