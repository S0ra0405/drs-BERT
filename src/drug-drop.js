  //ダブルクリックでスワップ
  $(document).on("dblclick", '.network', function (e) {
    action_history.push("swap");

    let place = Array.from(e.target.parentNode.parentNode.parentNode.children).indexOf(e.target.parentNode.parentNode);
    swapped_container_placed.push(place);
    //console.log("swapped container had placed ",place);

    resetNetworkEvents();
    //console.log("network dbclk");
    let targetId = e.currentTarget.id;
    swapped_network_id.push(targetId);
    //console.log(main_network);
    //console.log(network_arr);
    //console.log(e);
    deleted_mainnetwork.push(main_network);
    let data = getData(network_arr[targetId]);
    network_options = {
      autoResize: true,
      height: "100%",
      width: "100%",
      layout: {
        hierarchical: {
          enabled: true,
          direction: "UD",
          sortMethod: "directed",
          levelSeparation: node_maxheight +20,
          // levelSeparation: 100,
          nodeSpacing: node_maxwidth
        }
      },
      edges: {
        font: {
          size: 16
        },
        widthConstraint: {
          maximum: node_maxwidth
        },
        color: {color: '#76eec6'},
        arrows: {
          to: {
            enabled: true,
            type: 'arrow'
          }
        },
        smooth: {
          enabled: false // これでエッジを直線にする
        }
      },
      nodes: {
        shape: 'box',
        widthConstraint: {
          maximum: node_maxwidth
        },
        color:{
          highlight:{
            border:'#9AFDE8',
            background: '#575f5d'
          }
        }
      },
      physics: {
        enabled: true,
        hierarchicalRepulsion:{
          centralGravity: 0.0,
          springLength: 500,
          springConstant: 0.01,

          nodeDistance: 50,
          springLength: 150,
          damping: 1.0
        },
        repulsion:{
          damping: 1.0
        }
      },
      manipulation: {
        enabled: false,
        addEdge: function (data, callback) {
          AddEdgeFunc(data, callback);
        }
      }
    };
    main_network = new vis.Network(maincontainer, data, network_options);
    e.target.parentNode.parentNode.remove();
    disableHierarchy(main_network);
    eventEdgeDblclicled(main_network);
    NetworkContext();
    deleteEdgeAction();
    editEdgeMode();
  });

  function AddEdgeFunc(data, callback){
    //data.id = String(data.from)+"-"+String(data.to), idが重複するとエラーなる
    let edgeId = String(data.from + "-" + data.to);
    console.log(edgeId, main_network.getClusteredEdges(edgeId), data, points_matrix, typeof(points_matrix), points_matrix[0][5], typeof(points_matrix[0]));
    let edge_isexist = main_network.getClusteredEdges(edgeId).length;
    console.log(edgeId,edge_isexist);
    if(!edge_isexist){
      data.id = edgeId;
      data.label = String(points_matrix[0][data.from-1][data.to-1]);
      data.color = '#738080';
      data.arrows = {
        to: {
          enabled: true,
          type: 'arrow'
        }
      };

      action_history.push("edgeadd");
      added_edge.push(edgeId);
      callback(data);
    }else{
      main_network.updateEdge(String(edgeId), {hidden: false});
    }
  }

  //エッジの削除
  function deleteEdgeAction(container){
    $('#delete-button').on('click', function(){
      action_history.push("edgedel");

      edgeList = main_network.getSelectedEdges().filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      console.log("selected edge:", edgeList);
      let buf = [];
      for(selectedEdges in edgeList){
        let edgeId = main_network.getSelectedEdges()[selectedEdges];
        console.log(main_network.getSelectedEdges()[selectedEdges]);

        let index_destroy = 0;
        for(let index_network in network_arr){
          let edge_isexist = network_arr[index_network].getClusteredEdges(edgeId).length;
          console.log(index_network, edge_isexist, index_destroy);
          if(index_network != 'NaN'){
            if(edge_isexist > 0){
              deleted_network_id.push(index_network);
              clearSingleElement('network-array', index_destroy);
              index_destroy--;
            }
          }
          index_destroy++;
          buf.push(index_destroy);
        }
        main_network.updateEdge(edgeId, {hidden: true});
        deleted_edge_id.push(edgeId);
      }
      deleted_network_place.push(buf);
    });
  }

/**ダブルクリックでエッジ確定*/
  function eventEdgeDblclicled(network){
    network.on("doubleClick", function(params){
      //console.log("dblclickevent");
      console.log(params);
      
      if (params.edges.length == 1) {
        action_history.push("edgedblclk");

        let edgeId = params.edges[0];
        console.log('エッジ'+edgeId + 'がダブルクリックされました');

        /**network.setData({edges: {id: edgeId,color: {color: '#29f6b2'}}});*/

        let index_destroy = -1;
        let buf = [];
        for(let index_network in network_arr){
          let edge_isexist = network_arr[index_network].getClusteredEdges(edgeId).length;
          if(index_network != 'NaN'){
            if(!edge_isexist){
              deleted_network_id.push(index_network);
              clearSingleElement('network-array', index_destroy);
              index_destroy--;
            }
          }
          index_destroy++;
          buf.push(index_destroy);
        }
        deleted_network_place.push(buf);
      }
    });
  }

  f_editMode = false;
  function editEdgeMode(){
    function enable(n){
      console.log(n);
      n.addEdgeMode();
      n.on('release', function(){
        n.addEdgeMode();
      });
    }
    function disable(n){
      n.off('release',);
      n.disableEditMode();
    }

    $('#edit-button').on('click', function(){
      //console.log('editbutton clicked',f_editMode);
      console.log(f_editMode);
      console.log(main_network);
      if(!f_editMode){
        $('#edit-button').css({'background-image':'linear-gradient(180deg, #888888, #888888)', 'border': '1px solid var(--neon-border-color)'});
        enable(main_network);
        f_editMode = true;
      }else{
        disable(main_network);
        $('#edit-button').css({'background-image':'linear-gradient(180deg, white, white)', 'border': '1px solid var(--dark-border-color)'});
        f_editMode = false;
      }
    });
  }

  function getData(network){
    console.log(network);
    var data = network.body.data;
    return data;
  } 

  function getOptions(network){
    var opt = network.options;
    return opt;
  } 