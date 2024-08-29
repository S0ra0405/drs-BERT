action_history = [];

deleted_mainnetwork = [];

deleted_network = [];
deleted_network_id = [];
deleted_network_place = [];

deleted_edge_id = [];

added_edge = [];
swapped_container_placed = [];
swapped_network_id = [];

/**
$('#undo-button').on('click', function(e){
  console.log('undobutton');
  UndoAction();
});
*/
$(window).keydown(function(e){
  if(event.ctrlKey){
    if(e.keyCode === 90){
      UndoAction();
      return false;
    }
  }
});

function UndoAction(){
  console.log("UndoAction",action_history);
  let hist = action_history.pop();
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
        //levelSeparation: 100,
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
        to:{
          enabled: true,
          type: 'arrow'
        }
      },
      smooth: {
        enabled: false
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
      ///***
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
      // */
    },
    manipulation: {
      enabled: false,
      addEdge: function (data, callback) {
          AddEdgeFunc(data, callback);
      }
    }
  };

  function UndoDeletedNetworks(){
    console.log(deleted_network_id);
    deleted_network_id.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    
    let network_place_arr = deleted_network_place.pop();
    let container_boxarr = document.getElementById('network-array');
    console.log(network_place_arr);

    while(deleted_network_id.length > 0){
      place = network_place_arr.pop();
      let elementId = deleted_network_id.pop();
      if(container_boxarr.children.namedItem(elementId)){continue;}

      let replaced_data = getData(network_arr[elementId]);

      console.log(elementId);
      let el = document.createElement('div', {is : 'expanding-div'});
      el.setAttribute("id", elementId);
      let child_len = container_boxarr.children.length;
      console.log(place);
      if(child_len <= place || child_len == 0 || place < 0){
        container_boxarr.appendChild(el);
      }else{
        container_boxarr.insertBefore(el,container_boxarr.children.item(place));
      }
      console.log(replaced_data);
      let network = new vis.Network(el, replaced_data, network_options);
      disableHierarchy(network);
      eventEdgeDblclicled(network);
    }
  }

  function UndoSwap(){
    resetNetworkEvents();
    let main_data = getData(main_network);
    let replaced_data = getData(deleted_mainnetwork.pop());

    let container_boxarr = document.getElementById('network-array');
    let el = document.createElement('div', {is : 'expanding-div'});
    let elementId = swapped_network_id.pop();
    el.setAttribute("id", elementId);
    let container_place = swapped_container_placed.pop();
    let child_len = container_boxarr.children.length;
    if(child_len <= container_place || child_len == 0 || container_place < 0){
      container_boxarr.appendChild(el);
    }else{
      container_boxarr.insertBefore(el,container_boxarr.children.item(container_place));
    }

    let network = new vis.Network(el, main_data, network_options);
    disableHierarchy(network);
    eventEdgeDblclicled(network);
    network_arr[elementId] = network;

    main_network = new vis.Network(maincontainer, replaced_data, network_options);
    disableHierarchy(main_network);
    eventEdgeDblclicled(main_network);
    NetworkContext();
    deleteEdgeAction();
    editEdgeMode();
  }

  switch(hist){
    case "edgedel":
      deletedEdgeId = deleted_edge_id.pop();
      main_network.updateEdge(deletedEdgeId, {hidden: false});
    case "edgedblclk":
      UndoDeletedNetworks();
      break;

    case "swap":
      UndoSwap();
      break;

    case "edgeadd":
      let edgeId = added_edge.pop();
      console.log("Undo AddEdge ",edgeId);
      main_network.updateEdge(String(edgeId), {id: undefined, hidden: true});
      break;
  }
}


function RedoAction(){

}